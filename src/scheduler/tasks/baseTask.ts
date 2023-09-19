import fileLogger from '../../utils/logger/logger'

export class BaseTask {
    async handle() {
        this.info('Empty task!')
    }

    info(message: string) {
        console.log('🤖 Cron message -> ', message)
    }

    saveLog(message: string) {
        fileLogger.info(message)
    }
}