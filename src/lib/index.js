import cluster from 'cluster'
import os from 'os'

import Hapi from 'hapi'

import { utilsPlugins } from '../utils'
import { routesPlugins } from '../routes'
import { initializeDb } from '../seed'
import { checkSystemsStatus } from '../logic/stats.logic'
import { queueManager } from '../logic/queue.logic'
import { logger } from '../utils/logger.utils'
import { AppPorts } from '../config/constants'
import { tcpServer } from '../routes/DAD/dad.tcp'

export const server = new Hapi.Server({
  connections: {
    router: {
      isCaseSensitive: true,
      stripTrailingSlash: true
    }
  }
})

if (cluster.isMaster) {
  os.cpus().forEach(cpu => cluster.fork())
  checkSystemsStatus()
  queueManager()
} else {
  server.connection({ port: AppPorts.IL, labels: ['IL'] })
  server.connection({ port: AppPorts.webUI, labels: ['web-ui'] })
  server.connection({ port: AppPorts.VL, labels: ['VL'] })
  server.connection({ port: AppPorts.DAD, labels: ['DAD'] })

  const plugins = [...utilsPlugins, ...routesPlugins]

  const initializeServer = async () => {
    try {
      await server.register(plugins)
      await server.initialize()
      const message = await initializeDb()
      logger.info(message.msg)
      await server.start()

      tcpServer.on('error', (err) => logger.error(`An error occured on the TCP server ${err}`))
      tcpServer.listen(AppPorts.DAD_TCP, () => logger.info(`TCP Listener bound on port ${AppPorts.DAD_TCP}`))

      logger.info(`Viral Load API Server started @ ${server.select('VL').info.uri}`)
      logger.info(`Interoperability Layer API Server started @ ${server.select('IL').info.uri}`)
      logger.info(`Interoperability Layer Web Interface running @ ${server.select('web-ui').info.uri}`)
      logger.info(`Data Acquisition and Dispersal System (DAD) running @ ${server.select('DAD').info.uri}`)
    } catch (error) {
      logger.error(`An error occured when initializing the server: ${error}`)
      process.exit(1)
    }
  }

  initializeServer()
}
