import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'

import type { Alpine as AlpineType } from 'alpinejs'

interface ThemeStore {
  mode: 'light' | 'dark'
  label: string
  init(): void
  getSystem(): void
  toggle(): void
}

interface DrawerStore {
  open: boolean
  toggle(): void
}

export default (Alpine: AlpineType) => {
  Alpine.plugin(persist)

  Alpine.store('theme', {
    mode: (Alpine as any).$persist('light').as('theme'),

    get label(this: ThemeStore) {
      return `Switch to ${this.mode === 'light' ? 'dark' : 'light'} theme`
    },

    init(this: ThemeStore) {
      Alpine.effect(() => {
        document.documentElement.setAttribute('data-theme', this.mode)
      })
    },

    getSystem(this: ThemeStore) {
      this.mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    },

    toggle(this: ThemeStore) {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
    },
  })

  Alpine.store('drawer', {
    open: false,

    toggle(this: DrawerStore) {
      this.open = !this.open
    },
  })
}
