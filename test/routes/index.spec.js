const Code = require('code')
const Lab = require('lab')
const server = require('../../index')

const lab = exports.lab = Lab.script();

const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

before((done) => {
    /*
        Callcack only fires once the server is initialized
    */
    server.labbableReady((err) => {
        if(err) return done(err)
        return done()
    })
})

describe('The server', () => {
    it('initializes', (done) => {
        expect(server.isInitialized()).to.equal(true)
        done()
    })
})