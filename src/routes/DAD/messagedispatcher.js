import fetch from 'isomorphic-fetch'
import net from 'net'
import base64 from 'base-64'

export const messageDispatcher = {
  sendHTTP: async (address, payload) => {
    return fetch(address, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    })
  },
  sendToDHIS2: async (address, payload, user) => {
    return fetch(address, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml+adx',
        'Authorization': 'Basic ' + base64.encode(user.username + ':' + user.password)
      },
      body: payload
    })
  },
  sendTCP: async (address, payload) => {
    const startBytes = '|~~'
    const endBytes = '~~|'

    const client = new net.Socket()
    client.connect(address.split(':')[1], address.split(':')[0], function () {
      client.write(`${startBytes}${payload}${endBytes}`)
      client.end()
    })
    return client
  }
}
