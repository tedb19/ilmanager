import { goodPluginObj } from './good.utils'
import { blippPluginObj } from './blipp.utils'
import { loutPluginObj, InertPluginObj } from './lout.utils'
import { labbablePluginObj } from './labbable.utils'

export const utilsPlugins = [goodPluginObj, labbablePluginObj, blippPluginObj, InertPluginObj, ...loutPluginObj]
