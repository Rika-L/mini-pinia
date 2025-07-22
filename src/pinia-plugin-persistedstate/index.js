function piniaPluginPersistedstate() {
  return ({ store, id }) => {
    const oldState = JSON.parse(localStorage.getItem(id) || '{}')
    store.$state = oldState
    store.$subscribe((mutation, state) => {
      localStorage.setItem(id, JSON.stringify(state))
    })
  }
}

export default piniaPluginPersistedstate
