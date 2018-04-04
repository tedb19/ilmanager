import "isomorphic-fetch"
import net from 'net'

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
    sendTCP: async (address, payload) => {
        const startBytes = '|~~'
        const endBytes = '~~|'

        const client = new net.Socket()
        client.connect(address.split(':')[1], address.split(':')[0], function() {
            client.write(`${startBytes}${payload}${endBytes}`)
            client.end()
        })
        return client
    }
}