import drivers from './drivers'
import {Sender} from './sender'
import {Drivers} from '../../types/types'

class Manager {
    driver(name: keyof Drivers, config: any) {
        const driver = drivers[name]

        return new Sender(new driver(config))
    }
}

export default new Manager()