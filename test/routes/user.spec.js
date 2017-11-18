const Code = require('code')
const Lab = require('lab')
const server = require('../../src/lib/index')

const lab = exports.lab = Lab.script();

const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

describe('GET /api/entities', () => {
    const request = {
        method: 'GET',
        url: '/api/entities'
    }
    it('returns HTTP Status Code 200', (done) => {
      
        server.select('IL').inject(request, (response) => {
          expect(response.payload).equal(200)
          done()
        })
    })

    it('returns an array', (done) => {
      
        server.select('IL').inject(request, (response) => {
            console.log(response.payload)
          expect(JSON.parse(response.payload)).to.be.an.array()
          done()
        })
    })
})