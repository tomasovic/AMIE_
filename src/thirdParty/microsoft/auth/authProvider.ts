// @ts-nocheck
import msal from '@azure/msal-node'
import axios from 'axios'
import {Request, Response} from 'express'
import {NextResolverFn} from '../../../types/resolvers-types'

import msalConfig from '../../../config/microsoftConfig'

export class AuthProvider {
    msalConfig
    cryptoProvider

    constructor(msalConfig) {
        this.msalConfig = msalConfig
        this.cryptoProvider = new msal.CryptoProvider()
    };

    login(options = {}) {
        return async (req: Request, res: Response, next: NextResolverFn<any>) => {

            const state = this.cryptoProvider.base64Encode(
                JSON.stringify({
                    successRedirect: options.successRedirect || '/',
                })
            )

            const authCodeUrlRequestParams = {
                state: state,
                scopes: options.scopes || [],
                redirectUri: options.redirectUri,
            }

            const authCodeRequestParams = {
                state: state,
                scopes: options.scopes || [],
                redirectUri: options.redirectUri,
            }

            if (!this.msalConfig.auth.cloudDiscoveryMetadata || !this.msalConfig.auth.authorityMetadata) {

                const [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
                    this.getCloudDiscoveryMetadata(this.msalConfig.auth.authority),
                    this.getAuthorityMetadata(this.msalConfig.auth.authority)
                ])

                this.msalConfig.auth.cloudDiscoveryMetadata = JSON.stringify(cloudDiscoveryMetadata)
                this.msalConfig.auth.authorityMetadata = JSON.stringify(authorityMetadata)
            }

            const msalInstance = this.getMsalInstance(this.msalConfig)

            return this.redirectToAuthCodeUrl(
                authCodeUrlRequestParams,
                authCodeRequestParams,
                msalInstance
            )(req, res, next)
        }
    }

    acquireToken(options = {}) {
        return async (req, res, next) => {
            try {
                const msalInstance = this.getMsalInstance(this.msalConfig)

                if (req.session.tokenCache) {
                    msalInstance.getTokenCache().deserialize(req.session.tokenCache)
                }

                const tokenResponse = await msalInstance.acquireTokenSilent({
                    account: req.session.account,
                    scopes: options.scopes || [],
                })

                req.session.tokenCache = msalInstance.getTokenCache().serialize()
                req.session.accessToken = tokenResponse.accessToken
                req.session.idToken = tokenResponse.idToken
                req.session.account = tokenResponse.account

                res.redirect(options.successRedirect)
            } catch (error) {
                if (error instanceof msal.InteractionRequiredAuthError) {
                    return this.login({
                        scopes: options.scopes || [],
                        redirectUri: options.redirectUri,
                        successRedirect: options.successRedirect || '/',
                    })(req, res, next)
                }

                next(error)
            }
        }
    }

    handleRedirect(options = {}) {
        return async (req, res, next) => {
            if (!req.body || !req.body.state) {
                return next(new Error('Error: response not found'))
            }

            const authCodeRequest = {
                ...req.session.authCodeRequest,
                code: req.body.code,
                codeVerifier: req.session.pkceCodes.verifier,
            }

            try {
                const msalInstance = this.getMsalInstance(this.msalConfig)

                if (req.session.tokenCache) {
                    msalInstance.getTokenCache().deserialize(req.session.tokenCache)
                }

                const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body)

                req.session.tokenCache = msalInstance.getTokenCache().serialize()
                req.session.idToken = tokenResponse.idToken
                req.session.account = tokenResponse.account
                req.session.isAuthenticated = true

                const state = JSON.parse(this.cryptoProvider.base64Decode(req.body.state))
                res.redirect(state.successRedirect)
            } catch (error) {
                next(error)
            }
        }
    }

    logout(options = {}) {
        return (req, res, next) => {
            let logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/`

            if (options.postLogoutRedirectUri) {
                logoutUri += `logout?post_logout_redirect_uri=${options.postLogoutRedirectUri}`
            }

            req.session.destroy(() => {
                res.redirect(logoutUri)
            })
        }
    }

    getMsalInstance(msalConfig) {
        return new msal.ConfidentialClientApplication(msalConfig)
    }


    /**
     * Prepares the auth code request parameters and initiates the first leg of auth code flow
     * @param authCodeUrlRequestParams
     * @param authCodeRequestParams
     * @param msalInstance
     */
    redirectToAuthCodeUrl(authCodeUrlRequestParams, authCodeRequestParams, msalInstance) {
        return async (req, res, next) => {
            const {verifier, challenge} = await this.cryptoProvider.generatePkceCodes()
            req.session.pkceCodes = {
                challengeMethod: 'S256',
                verifier: verifier,
                challenge: challenge,
            }

            req.session.authCodeUrlRequest = {
                ...authCodeUrlRequestParams,
                responseMode: msal.ResponseMode.FORM_POST, // recommended for confidential clients
                codeChallenge: req.session.pkceCodes.challenge,
                codeChallengeMethod: req.session.pkceCodes.challengeMethod,
            }

            req.session.authCodeRequest = {
                ...authCodeRequestParams,
                code: '',
            }

            try {
                const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest)
                res.redirect(authCodeUrlResponse)
            } catch (error) {
                next(error)
            }
        }
    }

    /**
     * Retrieves cloud discovery metadata from the /discovery/instance endpoint
     * @returns
     */
    async getCloudDiscoveryMetadata(authority) {
        const endpoint = 'https://login.microsoftonline.com/common/discovery/instance'

        try {
            const response = await axios.get(endpoint, {
                params: {
                    'api-version': '1.1',
                    'authorization_endpoint': `${authority}/oauth2/v2.0/authorize`
                }
            })

            return await response.data
        } catch (error) {
            throw error
        }
    }

    async getAuthorityMetadata(authority) {
        const endpoint = `${authority}/v2.0/.well-known/openid-configuration`

        try {
            const response = await axios.get(endpoint)
            return await response.data
        } catch (error) {
            console.log(error)
        }
    }
}

export const authProvider = new AuthProvider(msalConfig)