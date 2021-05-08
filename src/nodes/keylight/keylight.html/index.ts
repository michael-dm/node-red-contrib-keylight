import { KeyLight } from 'elgato-light-api'
import { EditorRED } from 'node-red'

declare const RED: EditorRED

RED.nodes.registerType('keylight', {
  category: 'function',
  color: '#a6bbcf',
  defaults: {
    name: { value: '' },
    server: { value: '', type: 'keylight-server' },
    light: { value: '' },
  },
  inputs: 1,
  outputs: 1,
  icon: 'transform-text.png',
  paletteLabel: 'keylight',
  label: function () {
    return this.name || 'keylight'
  },
  oneditprepare: async function () {
    const inputLight = document.getElementById(
      'node-input-light'
    ) as HTMLSelectElement

    if (inputLight && this.server) {
      const serverConfig = RED.nodes.node(this.server) as any
      if (serverConfig && serverConfig.id) {
        const res = await fetch(
          'node-keylight/lights?' +
            new URLSearchParams({ server: serverConfig.id })
        )
        if (res.status !== 200) console.error(await res.text())
        const lights: KeyLight[] = await res.json()

        console.log(lights)
        // lights.forEach(light => {

        // })
        // inputLight.append(`<option value="${}">${}</option>`)
        // inputLight.value = this.light
      }
    }
  },
})
