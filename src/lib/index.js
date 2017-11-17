import Hapi from 'hapi'
import Labbable from 'labbable'

import { log } from '../utils/log.utils'
import { utilsPlugins } from '../utils'
import { routesPlugins } from '../routes'
import { initializeDb } from '../seed'
import { updateEntitiesStatus } from '../logic/stats.logic'
import { checkSystemsStatus } from '../logic/stats.logic'


const server = module.exports = new Hapi.Server();

server.connection({ port: 5000 })

const plugins = [ ...utilsPlugins, ...routesPlugins ]

server.register(plugins, (error) => {
    if (error) throw error
    
    server.initialize((error) => {
        if (error) throw error
        initializeDb(false)
            .then(() => {
                server.start((error) => {
                    if (error) throw error
                    server.log(['app', 'info'], `Server started @ ${server.info.uri}`)
                    checkSystemsStatus.start()
                })
            })
            .catch(error => server.log(['app', 'error'], error))
    })
})