import { Node, NodeDef, NodeInitializer } from 'node-red'
import { KeylightServerNode } from '../keylight-server/types'
import { KeylightOptions } from './types'

const nodeInit: NodeInitializer = (RED): void => {
  function KeylightNodeConstructor(
    this: Node,
    config: NodeDef & KeylightOptions
  ): void {
    RED.nodes.createNode(this, config)

    const server = RED.nodes.getNode(config.server) as KeylightServerNode

    this.on('input', async (msg, send, done) => {
      if (!server) return console.warn('Server not configured')

      const lights = server.getLights()
      const light = lights.find((l) => l.ip === config.light)
      if (!light || !light.options)
        return console.warn('Light or light options not found.')

      light.options.lights[0].on = !!msg.payload ? 1 : 0

      await server.setLight(light)
      done()
    })
  }

  RED.nodes.registerType('keylight', KeylightNodeConstructor)
}

export = nodeInit
