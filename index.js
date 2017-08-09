import Hapi from 'hapi'
import Labbable from 'labbable'

import { log } from './utils/log.utils'
import { utilsPlugins } from './utils'
import { routesPlugins } from './routes'
import { initializeDb } from './seed'

const server = module.exports = new Hapi.Server();

server.connection({ port: 3000 })

const plugins = [ ...utilsPlugins, ...routesPlugins ]

server.register(plugins, (error) => {
    if (error) throw error
    
    server.initialize((error) => {
        if (error) throw error
        initializeDb()
            .then(() => {
                server.start((error) => {
                    if (error) throw error
                    log.info(`Server started @ ${server.info.uri}`)
                })
            })
            .catch(error => log.error(error))
    })
})