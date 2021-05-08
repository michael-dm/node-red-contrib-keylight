import { EditorNodeProperties, EditorRED } from 'node-red'
import { KeylightServerOptions } from '../types'

declare const RED: EditorRED

RED.nodes.registerType<EditorNodeProperties & KeylightServerOptions>(
  'keylight-server',
  {
    category: 'config',
    defaults: {
      name: { value: '' },
    },
    label: function () {
      return this.name || 'keylight server'
    },
  }
)
