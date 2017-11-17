
import entityRoutes from './entity.routes'
import messageTypeRoutes from './messagetype.routes'
import subscriberRoutes from './subscriber.routes'
import statsRoutes from './stats.routes'
import logsRoutes from './logs.routes'
import addressMappingRoutes from './addressmapping.routes'
import webRoutes from './web.routes'

export const routesPlugins = [
    { register: entityRoutes },
    { register: webRoutes },
    { register: messageTypeRoutes },
    { register: subscriberRoutes },
    { register: statsRoutes },
    { register: logsRoutes },
    { register: addressMappingRoutes }
]
