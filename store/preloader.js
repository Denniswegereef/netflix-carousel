export const state = () => ({
  loaded: false
})

export const mutations = {
  toggleLoaded (state, loaded) {
    state.loaded = loaded
  }
}
