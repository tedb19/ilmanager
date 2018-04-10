
import entityRoutes from './IL/entity.routes'
import messageTypeRoutes from './IL/messagetype.routes'
import subscriberRoutes from './IL/subscriber.routes'
import statsRoutes from './IL/stats.routes'
import logsRoutes from './IL/logs.routes'
import addressMappingRoutes from './IL/addressmapping.routes'
import webRoutes from './web-ui/web.routes'
import labOrderRoutes from './VL/laborder.routes'
import labResultRoutes from './VL/labresult.routes'
import DADRoutes from './DAD/dad.routes'
import QueueRoutes from './IL/queue.routes'
import SettingsRoutes from './IL/settings.routes'

export const routesPlugins = [
  { register: entityRoutes },
  { register: webRoutes },
  { register: messageTypeRoutes },
  { register: subscriberRoutes },
  { register: statsRoutes },
  { register: logsRoutes },
  { register: addressMappingRoutes },
  { register: labOrderRoutes },
  { register: labResultRoutes },
  { register: DADRoutes },
  { register: QueueRoutes },
  { register: SettingsRoutes }
]
