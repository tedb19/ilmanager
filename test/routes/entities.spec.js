import { expect } from 'chai'
import { testServer } from '../server/testServer'

describe('GET /api/entities', async () => {
  const server = await testServer()
  const request = {
    method: 'GET',
    url: '/api/entities'
  }

  it('returns HTTP Status Code 200', done => {
    server.select('IL').inject(request, response => {
      expect(JSON.parse(response.statusCode)).to.equal(200)
      done()
    })
  })

  it('returns an array', done => {
    try {
      server.select('IL').inject(request, response => {
        expect(JSON.parse(response.payload)).to.be.an('array')
        done()
      })
    } catch (err) {
      console.log('Test Error', err)
    }
  })
})
