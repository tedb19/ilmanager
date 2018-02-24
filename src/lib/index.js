import Hapi from 'hapi'
import net from 'net'

import { utilsPlugins } from '../utils'
import { routesPlugins } from '../routes'
import { initializeDb } from '../seed'
import { updateEntitiesStatus } from '../logic/stats.logic'
import { checkSystemsStatus } from '../logic/stats.logic'
import { queueManager } from '../logic/queue.logic';
import { processIncoming } from '../routes/DAD/processMessage'
import { VLManager } from '../routes/VL/labresult.payload'

const server = module.exports = new Hapi.Server()

server.connection({ port: 3003, labels: ['IL'] })
server.connection({ port: 5000, labels: ['web-ui'] })
server.connection({ port: 3007, labels: ['VL'] })
server.connection({ port: 9721, labels: ['DAD'] })

const TCPPort = 9720

const plugins = [ ...utilsPlugins, ...routesPlugins ]

server.register(plugins, (error) => {
    if (error) throw error
    
    server.initialize((error) => {
        if (error) throw error
        initializeDb()
            .then((message) => {
                server.log(['app', message.level], message.msg)
                server.start((error) => {
                    if (error) {
                        server.log(['app', 'error'], `Error starting server: ${error}`)
                        throw error
                    }
                    //TCP
                    const tcpServer = net.createServer((socket) => {
                        socket.on('data', (data)=> {
                            const dataStr = data.toString('utf8')
                            const payload = dataStr.substring(3, dataStr.length-3)//remove start and end bytes
                            const CCCNumber = processIncoming(JSON.parse(payload))
                            let response = ''
                            CCCNumber
                                ? response = JSON.stringify({ msg: 'successfully received by the Interoperability Layer (IL)'})
                                : response = Boom.notAcceptable('No CCC Number specified! This message will still be sent out')
                            socket.write(`|~~${response}~~|`)
                            socket.end()
                        })
                    })
                    
                    tcpServer.on('error', (err) => {
                        server.log(['tcp', 'server'], `An error occured on the TCP server ${err}`)
                    })
                    
                    tcpServer.listen(TCPPort, () => {
                        server.log(['tcp', 'server'], `TCP Listener bound on port ${TCPPort}`)
                    })
                    server.log(['app', 'info'], `Viral Load API Server started @ ${server.select('VL').info.uri}`)
                    server.log(['app', 'info'], `Interoperability Layer API Server started @ ${server.select('IL').info.uri}`)
                    server.log(['app', 'info'], `Interoperability Layer Web Interface running @ ${server.select('web-ui').info.uri}`)
                    server.log(['app', 'info'], `Data Acquisition and Dispersal System (DAD) running @ ${server.select('DAD').info.uri}`)
                    checkSystemsStatus()
                    queueManager()
                    VLManager()
                })
            })
            .catch(error => {
                server.log(['app', 'error'], error)
            })
    })
})



