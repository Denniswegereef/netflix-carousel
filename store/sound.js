export const state = () => ({
  muted: false
})

export const mutations = {
  toggleSound (state) {
    state.muted = !state.muted
  }
}
