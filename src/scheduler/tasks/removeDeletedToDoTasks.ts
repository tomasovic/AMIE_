import {BaseTask} from './baseTask'
import client from '../../api/client'

export class RemoveDeletedToDoTasks extends BaseTask {
    async handle() {
        const date = new Date()
        date.setDate(date.getDate() - 30)

        await client.todo.deleteMany({
            where: {
                deletedAt: {
                    lte: date
                }
            }
        })
        
        this.info('Finished!')
        this.saveLog('Removed deleted todo tasks older than 30 days')
    }
}