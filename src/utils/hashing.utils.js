import crypto from 'crypto'

export const createHash = (input) => {
    const jsonStr = JSON.stringify(input)
    return crypto.createHash('sha1').update(jsonStr).digest('hex')
}