import net from 'net'

import { savePayload } from './saveIncomingToQueue'
import { START_BYTES, END_BYTES } from '../../config/constants'
import { logger } from '../../utils/logger.utils'

export const tcpServer = net.createServer((socket) => {
  socket.on('data', async (data) => {
    const dataStr = data.toString('utf8')
    if (dataStr.startsWith(START_BYTES) && dataStr.endsWith(END_BYTES)) {
      const payload = dataStr.substring(3, dataStr.length - 3)
      const response = await savePayload(payload)
      socket.write(`${START_BYTES}${response}${END_BYTES}`)
      socket.end()
    } else {
      socket.write(`Oh snap! This message has no start bytes (${START_BYTES}) and end bytes (${END_BYTES}) defined! Its been ignored`)
      socket.end()
    }
  })

  socket.on('error', (err) => {
    logger.error('Error on TCP server socket: ', err.stack)
  })
})
