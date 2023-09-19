import winston, {Logger} from 'winston'
import {loggerConfig} from '../../config/loggerConfig'
import {LoggerOptions} from '../../types/types'
// import DailyRotateFile from 'winston-daily-rotate-file'
import fs from 'fs'
import util from 'util'
import path from 'path'
import DailyRotateFile from 'winston-daily-rotate-file'

const {format} = winston
const {combine, timestamp, prettyPrint, errors} = format

const readDir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

class FileLogger {
    private logger: Logger

    constructor(config: LoggerOptions) {
        const transport = new DailyRotateFile(config)
        this.logger = winston.createLogger({
            format: combine(
                errors({stack: false}),
                timestamp(),
                prettyPrint(),
                format.json()
            ),
            // @ts-ignore
            json: true,
            transports: [
                transport
            ]
        })
    }

    public info(message: string, meta?: any): void {
        this.logger.info(message, meta)
    }

    public error(message: string, meta?: any): void {
        this.logger.error(message, meta)
    }

    /**
     * Returns all log files in the logs directory.
     */
    async getLogDates() {
        const destination = path.join(__dirname, 'logs')
        let files = await readDir(destination)
        files = files.filter((file: string | string[]) => file.includes('.log'))
        return files
    }

    /**
     * Returns all logs from a specific date.
     * @param date
     */
    async getLogByDate(date: string) {
        const destination = path.join(__dirname, `logs/${date}.log`)
        const file = await readFile(destination, 'utf8')
        const logs = file.split('\n')
        const parsedLogs = []
        const logLevels: { [key: string]: number } = {}

        for (const log of logs) {
            try {
                const parsedLog = JSON.parse(log)// how many errors in total
                // how much info and similar in total
                if (logLevels.hasOwnProperty(parsedLog.level)) {
                    logLevels[parsedLog.level]++
                } else {
                    logLevels[parsedLog.level] = 1
                }

                parsedLogs.push(parsedLog)
            } catch (err) {
                console.error(err)
            }
        }

        return {
            date,
            total: parsedLogs.length,
            logLevels,
            logs: parsedLogs
        }
    }
}

export default new FileLogger(loggerConfig)