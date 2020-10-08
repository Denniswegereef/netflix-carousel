<template>
  <div class="noise">
    <canvas ref="canvas" class="canvas" />
  </div>
</template>

<script>
import { gsap } from 'gsap'
import debounce from 'lodash.debounce'

export default {
  data () {
    return {
      canvas: {
        ctx: null,
        noiseData: [],
        frame: 0
      }
    }
  },

  watch: {
    '$store.state.preloader.loaded': {
      handler () {
        gsap.to(this.$refs.canvas, { opacity: 0.4, duration: 0.5 })
      }
    }
  },

  mounted () {
    this._setupEventListeners()
    this._setCanvas()
  },

  methods: {
    _setupEventListeners () {
      this._tickHandler()
      this._resizeHandler()
    },

    _setCanvas () {
      this.$refs.canvas.width = window.innerWidth
      this.$refs.canvas.height = window.innerHeight

      this.canvas.ctx = this.$refs.canvas.getContext('2d')

      this.canvas.noiseData = []
      for (let i = 0; i < 10; i++) this._createNoise()
    },

    _createNoise () {
      const idata = this.canvas.ctx.createImageData(window.innerWidth, window.innerHeight)
      const buffer32 = new Uint32Array(idata.data.buffer)
      const len = buffer32.length

      for (let i = 0; i < len; i++) if (Math.random() < 0.5) buffer32[i] = 0xFF000000

      this.canvas.noiseData.push(idata)
    },

    _paintNoise () {
      this.canvas.frame++
      if (this.canvas.frame === 9) this.canvas.frame = 0

      this.canvas.ctx.putImageData(this.canvas.noiseData[this.canvas.frame], 0, 0)
    },

    _drawCanvas () {
      this._paintNoise(this.canvas.frame)
    },

    _resizePage () {
      this._setCanvas()
    },

    // Handlers
    _resizeHandler () {
      window.addEventListener('resize', debounce(this._resizePage.bind(this), 250))
    },

    _tickHandler () {
      gsap.ticker.add(this._drawCanvas)
    }
  }
}
</script>

<style lang="scss" scoped>
.noise {
  position: fixed;
  top: 0;
  left: 0;

  height: 100vh;
  width: 100vw;

  background: $color-background;
  z-index: -1;
}

.canvas {
  opacity: 0.0;
}
</style>
