export const state = () => ({
  sound_muted: true
})

export const mutations = {
  toggleSound (state) {
    state.sound_muted = !state.sound_muted
  }
}
