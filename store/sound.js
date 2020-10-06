export const state = () => ({
  muted: true
})

export const mutations = {
  toggleSound (state) {
    state.muted = !state.muted
  }
}
