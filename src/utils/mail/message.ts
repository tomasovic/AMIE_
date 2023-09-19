import {MailData} from '../../types/types'

export class Message {
    private readonly data: MailData = {from: '', subject: '', text: '', to: ''}

    constructor() {
        this.data = {from: '', subject: '', text: '', to: ''}
    }

    to(address: string) {
        this.data['to'] = address
        return this
    }

    from(address: string) {
        this.data['from'] = address
        return this
    }

    subject(title: string) {
        this.data['subject'] = title
        return this
    }

    // data for email template
    with(data: any) {
        this.data['context'] = data
        return this
    }

    text(text: string) {
        this.data['text'] = text
        return this
    }

    parse() {
        return this.data
    }
}