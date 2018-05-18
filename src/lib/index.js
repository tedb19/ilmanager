import cluster from 'cluster'
import os from 'os'

import Glue from 'glue'
import { initializeDb } from '../seed'
import { checkSystemsStatus } from '../logic/stats.logic'
import { queueManager } from '../logic/queue.logic'
import { logger } from '../utils/logger.utils'
import { AppPorts } from '../config/constants'
import { tcpServer } from '../routes/DAD/dad.tcp'

import manifest from '../config/manifest.json'

const options = {
  relativeTo: __dirname
}

if (cluster.isMaster) {
  initializeDb().then(
    result => {
      logger.info(result.msg)
      os.cpus().forEach(cpu => cluster.fork())
      checkSystemsStatus()
      queueManager()
      logger.info(`Starting the Interoperability Layer...`)
    },
    error => {
      logger.error(`An error occured: ${error}`)
      process.exit(1)
    }
  )
} else {
  Glue.compose(manifest, options).then(
    server => server.start(),
    error => {
      logger.error(`An error occured when initializing the server: ${error}`)
      process.exit(1)
    }
  )

  tcpServer.on('error', err =>
    logger.error(`An error occured on the TCP server ${err}`)
  )
  tcpServer.listen(AppPorts.DAD_TCP, () =>
    logger.debug(`TCP Listener bound on port ${AppPorts.DAD_TCP}`)
  )
}
