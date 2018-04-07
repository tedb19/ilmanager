import Hapi from 'hapi'
import net from 'net'
import Boom from 'boom'

import { utilsPlugins } from '../utils'
import { routesPlugins } from '../routes'
import { initializeDb } from '../seed'
import { checkSystemsStatus } from '../logic/stats.logic'
import { queueManager } from '../logic/queue.logic'
import { saveIncomingToQueue } from '../routes/DAD/processMessage'
import { logger } from '../utils/logger.utils'

const server = module.exports = new Hapi.Server()

const AppPorts = {
  IL: 3003,
  webUI: 5000,
  VL: 3007,
  DAD: 9721
}

server.connection({ port: AppPorts.IL, labels: ['IL'] })
server.connection({ port: AppPorts.webUI, labels: ['web-ui'] })
server.connection({ port: AppPorts.VL, labels: ['VL'] })
server.connection({ port: AppPorts.DAD, labels: ['DAD'] })

const TCPPort = 9720
const START_BYTES = '|~~'
const END_BYTES = '~~|'

const plugins = [ ...utilsPlugins, ...routesPlugins ]

server.register(plugins, (error) => {
  if (error) throw error
  server.initialize((error) => {
    if (error) throw error
    initializeDb()
      .then((message) => {
        logger.info(message.msg)
        server.start((error) => {
          if (error) {
            logger.error(`Error starting server: ${error}`)
            throw error
          }

          const tcpServer = net.createServer((socket) => {
            socket.on('data', (data) => {
              const dataStr = data.toString('utf8')

              if (dataStr.startsWith(START_BYTES) && dataStr.endsWith(END_BYTES)) {
                const payload = dataStr.substring(3, dataStr.length - 3)
                const CCCNumber = saveIncomingToQueue(JSON.parse(payload))
                let response = ''
                CCCNumber
                  ? response = JSON.stringify({ msg: 'successfully received by the Interoperability Layer (IL)' })
                  : response = Boom.notAcceptable('No CCC Number specified! This message will still be sent out')
                socket.write(`${START_BYTES}${response}${END_BYTES}`)
                socket.end()
              } else {
                socket.write(`Oh snap! This message has no start bytes (${START_BYTES}) and end bytes (${END_BYTES}) defined! Its been ignored`)
                socket.end()
              }
            })
          })

          tcpServer.on('error', (err) => {
            logger.error(`An error occured on the TCP server ${err}`)
          })
          tcpServer.listen(TCPPort, () => {
            logger.info(`TCP Listener bound on port ${TCPPort}`)
          })

          logger.info(`Viral Load API Server started @ ${server.select('VL').info.uri}`)
          logger.info(`Interoperability Layer API Server started @ ${server.select('IL').info.uri}`)
          logger.info(`Interoperability Layer Web Interface running @ ${server.select('web-ui').info.uri}`)
          logger.info(`Data Acquisition and Dispersal System (DAD) running @ ${server.select('DAD').info.uri}`)
          checkSystemsStatus()
          queueManager()
          // QueuePruner()
        })
      })
      .catch(error => {
        logger.info(error)
      })
  })
})
