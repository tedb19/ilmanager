import { logger } from '../utils/logger.utils'
import models from '../models'

export const ZooKeeper = () => {
  setInterval(async () => {
    try {
      const fiveDaysAgo = new Date().setDate(new Date().getDate() - 5)
      await Promise.all([pruner.logs(fiveDaysAgo), pruner.queue(fiveDaysAgo)])
    } catch (error) {
      logger.error(error)
    }
  }, 60000 * 60 * 2)
}

const pruner = {
  queue: async fiveDaysAgo => {
    await models.Queue.destroy({
      where: {
        status: 'SENT',
        updatedAt: {
          $lte: fiveDaysAgo
        }
      }
    })
  },
  logs: async fiveDaysAgo => {
    await models.Logs.destroy({
      where: {
        level: 'INFO',
        updatedAt: {
          $lte: fiveDaysAgo
        }
      }
    })
  }
}
