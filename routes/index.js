
import entityRoutes from './entity.routes'
import messageTypeRoutes from './messagetype.routes'
import subscriberRoutes from './subscriber.routes'

export const routesPlugins = [{ register: entityRoutes }, { register: messageTypeRoutes }, { register: subscriberRoutes }]
