const Code = require('code')
const Lab = require('lab')
const server = require('../../src/lib/index')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('GET /api/entities', () => {
  const request = {
    method: 'GET',
    url: '/api/entities'
  }

  it('returns HTTP Status Code 200', (done) => {
    server.select('IL').inject(request, (response) => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  it('returns an array', (done) => {
    server.select('IL').inject(request, (response) => {
      console.log('response.payload', response.payload)
      console.log('response.result', response.result)
      expect(response.payload).to.be.an.array()
      done()
    })
  })
})
