import passport from 'passport'
import passportJWT from 'passport-jwt'
import {userServices} from '../../api/users/services/user.services'
import {UnauthenticatedException} from '../../exceptions/unauthenticatedException'
import {LoginUserInput} from '../../types/resolvers-types'
import {GraphQLLocalStrategy} from 'graphql-passport'

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

export default (config: { JWT_KEY: any }) => {
    passport.use(
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
                secretOrKey: config.JWT_KEY,
            },
            async (jwtPayload, done) => {
                const user = await userServices.getUserById(jwtPayload.userId)
                if (!user) {
                    const err = new UnauthenticatedException()
                    return done(err)
                }

                return done(null, user)
            }
        )
    )

    passport.use(
        new GraphQLLocalStrategy({passReqToCallback: true}, async (req, email, password, done) => {
            if (typeof email !== 'string' || typeof password !== 'string') {
                return done(new UnauthenticatedException())
            }

            const loginUserInput: LoginUserInput = {
                email,
                password,
            }

            const user = await userServices.login(loginUserInput)
            if (!user) {
                return done(new UnauthenticatedException())
            }

            return done(null, user)
        })
    )

    passport.serializeUser((user, done) => {
        // @ts-ignore
        done(null, user.jwt)
    })

    passport.deserializeUser(async (id: number, done) => {
        const user = await userServices.getUserById(id)
        if (!user) {
            const err = new UnauthenticatedException()
            return done(err)
        }

        return done(null, user)
    })

    return passport
}
