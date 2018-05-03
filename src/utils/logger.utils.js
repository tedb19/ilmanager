import bunyan from 'bunyan'
import bformat from 'bunyan-format'

const formatOut = bformat({ outputMode: 'short' })

export const logger = bunyan.createLogger({
  name: 'IL',
  streams: [
    {
      level: 'info',
      stream: formatOut // log INFO and above to stdout
    },
    {
      type: 'rotating-file',
      path: `logs-${new Date().toDateString()}.json`,
      period: '1d', // daily rotation
      count: 10,
      json: false
    }
  ]
})
