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
    },
    receiveTCP: async (port) => {
        const server = net.createServer((socket) => {
            console.log('client connected')
            socket.on('end', () => {
              console.log('client disconnected')
            })
        })

        server.on('error', (err) => {
            throw err;
        })
        server.listen(port, () => {
            console.log(`TCP Listener bound on port ${port}`)
        })
    }
}