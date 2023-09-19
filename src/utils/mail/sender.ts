import {Message} from './message'

export class Sender {
    private driver: any

    constructor(driver: any) {
        this.driver = driver
    }

    async send(cb: (arg: any) => void) {
        const message = new Message()
        cb(message)

        return await this.driver.send(message.parse())
    }
}