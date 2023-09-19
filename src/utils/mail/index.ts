import {mailConfig} from '../../config/mailConfig'
import {Drivers, MailConfig} from '../../types/types'
import {Sender} from './sender'
import {BaseException} from '../../exceptions/baseException'
import Manager from './manager'
import {EmailException} from '../../exceptions/emailException'

class Mailer {
    private readonly config: MailConfig
    private driver: Sender

    constructor(config: MailConfig) {
        this.config = config
        this.driver = this.determineDriver()
    }

    async send(cb: any) {
        return await this.driver.send(cb)
            .then(res => {
            })
            .catch(err => {
                throw new BaseException(err.message)
            })
    }

    private determineDriver(): Sender {
        const connection = this.config.connection
        if (connection in this.config) {
            return Manager.driver(connection as keyof Drivers, this.config[connection as keyof MailConfig])
        }

        throw new EmailException()
    }

}

export default new Mailer(mailConfig)