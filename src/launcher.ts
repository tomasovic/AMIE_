import {Server} from './api/server'

class Launcher {
    private server: Server

    constructor() {
        this.server = new Server()
    }

    launchApp = async () => {
        await this.server.createServer()
    }

}

new Launcher().launchApp()