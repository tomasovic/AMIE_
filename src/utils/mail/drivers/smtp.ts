import nodemailer, {Transporter} from 'nodemailer'
import {Options} from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export class Smtp {
    private transporter: Transporter<SMTPTransport.SentMessageInfo>

    constructor(config: string | SMTPTransport | SMTPTransport.Options | undefined) {
        this.transporter = nodemailer.createTransport(config)
    }

    send(message: Options) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(message, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}