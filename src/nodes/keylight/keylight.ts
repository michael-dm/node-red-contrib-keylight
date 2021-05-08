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

    if (server) {
    } else {
      console.error('Server not configured')
    }

    this.on('input', (msg, send, done) => {
      msg.payload = 'yo'
      send(msg)
      done()
    })
  }

  RED.nodes.registerType('keylight', KeylightNodeConstructor)
}

export = nodeInit
