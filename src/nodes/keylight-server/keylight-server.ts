import { NodeDef, NodeInitializer } from 'node-red'
import { KeylightServerNode, KeylightServerOptions } from './types'
import { ElgatoLightAPI, KeyLight } from 'elgato-light-api'

const nodeInit: NodeInitializer = (RED): void => {
  const keylightServers: { [key: string]: KeylightServerNode } = {}

  function KeylightServerNodeConstructor(
    this: KeylightServerNode,
    config: NodeDef & KeylightServerOptions
  ): void {
    RED.nodes.createNode(this, config)

    const lightApi = new ElgatoLightAPI()
    console.log('Looking for elgato lights.')

    lightApi.on('newLight', (light: KeyLight) => {
      console.log(light, 'New light detected')
    })

    this.getLights = () => lightApi.keyLights

    keylightServers[this.id] = this

    this.on('close', () => {
      delete keylightServers[this.id]
    })
  }

  RED.nodes.registerType('keylight-server', KeylightServerNodeConstructor)

  RED.httpAdmin.get('/node-keylight/lights', (req, res) => {
    if (!req.query.server) return res.status(500).send('Missing arguments')

    const serverId = req.query.server.toString()

    if (keylightServers.hasOwnProperty(serverId)) {
      res.set({ 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify(keylightServers[serverId].getLights()))
    }

    return res.status(500).send('Server not found or not activated')
  })
}

export = nodeInit
