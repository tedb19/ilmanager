import Lout from 'lout'
import Vision from 'vision'
import Inert from 'inert'

export const loutPluginObj = [Vision, Inert, {
  register: Lout,
  options: { endpoint: '/api/docs' }
}]

export const InertPluginObj = { register: Inert }
