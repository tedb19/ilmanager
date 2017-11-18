import Hapi from 'hapi'

import { utilsPlugins } from '../utils'
import { routesPlugins } from '../routes'
import { initializeDb } from '../seed'
import { updateEntitiesStatus } from '../logic/stats.logic'
import { checkSystemsStatus } from '../logic/stats.logic'

const server = module.exports = new Hapi.Server();

server.connection({ port: 3003, labels: ['IL'] })
server.connection({ port: 5000, labels: ['web-ui'] })
server.connection({ port: 3007, labels: ['VL'] })

const plugins = [ ...utilsPlugins, ...routesPlugins ]

server.register(plugins, (error) => {
    if (error) throw error
    
    server.initialize((error) => {
        if (error) throw error
        initializeDb(false)
            .then((message) => {
                server.log(['app', message.level], message.msg)
                server.start((error) => {
                    if (error) {
                        server.log(['app', 'error'], `Error starting server: ${error}`)
                        throw error
                    }
                    server.log(['app', 'info'], `Viral Load API Server started @ ${server.select('VL').info.uri}`)
                    server.log(['app', 'info'], `Interoperability Layer API Server started @ ${server.select('IL').info.uri}`)
                    server.log(['app', 'info'], `Interoperability Layer Web Interface running @ ${server.select('web-ui').info.uri}`)
                    checkSystemsStatus.start()
                })
            })
            .catch(error => server.log(['app', 'error'], error))
    })
})

