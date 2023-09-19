// @ts-nocheck
import cron from 'node-cron'
import {CronException} from '../exceptions/cronException'
import fileLogger from '../utils/logger/logger'

class Scheduler {
    private cron
    private readonly tasks

    constructor(cron) {
        this.cron = cron
        this.tasks = {
            '0 0 */30 * *': [
                './tasks/removeDeletedToDoTasks'
            ],
        }
    }

    runTasks() {
        for (const [interval, taskPaths] of Object.entries(this.tasks)) {
            for (const taskPath of taskPaths) {
                this.cron.schedule(interval, async () => {
                    try {
                        const taskModule = await import(taskPath)
                        if (taskModule && taskModule.RemoveDeletedToDoTasks) {
                            const taskInstance = new taskModule.RemoveDeletedToDoTasks()
                            await taskInstance.handle()
                        } else {
                            fileLogger.error(`Task ${taskPath} does not exist`)
                        }
                    } catch (err) {
                        throw new CronException()
                    }
                })
            }
        }
    }
}

export default new Scheduler(cron)
