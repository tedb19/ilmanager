import Path from 'path'

exports.register = (server, options, next) => {
  const webServer = server.select('web-ui')

  webServer.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: Path.join(__dirname, '..', '..', '..', 'build'),
        listing: false,
        index: ['index.html']
      }
    },
    config: {
      description: 'serves the react web app',
      tags: ['react', 'web app', 'client'],
      notes: 'serves the react web app',
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  })
  return next()
}

exports.register.attributes = {
  name: 'web.routes'
}
