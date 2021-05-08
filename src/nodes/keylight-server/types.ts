import { KeyLight, KeyLightOptions } from 'elgato-light-api'
import { Node } from 'node-red'

export interface KeylightServerOptions {
  // node options
}

export interface KeylightServerNode extends Node {
  getLights: () => KeyLight[]
  setLight: (light: KeyLight) => Promise<void>
}
