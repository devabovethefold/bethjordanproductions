(() => {
  const storageKey = 'theme'

  const getPreference = () => {
    const preference = localStorage.getItem(storageKey)
    if (preference) {
      try {
        return JSON.parse(preference)
      } catch (e) {
        return preference.replace(/^"|"$/g, '')
      }
    }
  }

  const getStorage = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setStorage = (theme) => {
    localStorage.setItem(storageKey, JSON.stringify(theme))
  }

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  const initTheme = () => {
    const theme = getPreference() || getStorage()
    setTheme(theme)
    setStorage(theme)
  }

  initTheme()
})()