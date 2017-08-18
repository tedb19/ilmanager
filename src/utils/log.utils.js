export let log = {}
log.info = (msg) => console.log('\n\x1b[35m', msg)
log.error = (msg) => console.log('\n\x1b[31m', msg)