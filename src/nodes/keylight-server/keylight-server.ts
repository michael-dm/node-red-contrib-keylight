import { NodeDef, NodeInitializer } from 'node-red'
import { KeylightServerNode, KeylightServerOptions } from './types'
import { ElgatoLightAPI, KeyLight, KeyLightOptions } from 'elgato-light-api'

const nodeInit: NodeInitializer = (RED): void => {
  const keylightServers: { [key: string]: KeylightServerNode } = {}

  function KeylightServerNodeConstructor(
    this: KeylightServerNode,
    config: NodeDef & KeylightServerOptions
  ): void {
    RED.nodes.createNode(this, config)

    const lightApi = new ElgatoLightAPI()

    this.getLights = () => lightApi.keyLights

    this.setLight = async (light) => {
      if (light.options) await lightApi.updateLightOptions(light, light.options)
      else throw Error('Options property not found in light.')
    }

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
