export const state = () => ({
  currentIndex: 0,
  dragging: false
})

export const mutations = {
  setIndex (state, newIndex) {
    state.currentIndex = newIndex
  },

  setDrag (state, boolean) {
    state.dragging = boolean
  }
}
