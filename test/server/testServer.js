import Glue from 'glue'

import manifest from './manifest.json'

const options = {
  relativeTo: __dirname
}

export const testServer = async () => {
  const server = await Glue.compose(manifest, options)
  await server.start()
  return server
}
