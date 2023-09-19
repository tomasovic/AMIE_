import {LoggerOptions} from '../types/types'

export const loggerConfig: LoggerOptions = {
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    dirname: './src/utils/logger/logs',
    maxSize: '20m',
    maxFiles: '14d'
}