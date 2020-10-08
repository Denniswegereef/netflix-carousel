<template>
  <li ref="icon" :class="$props.data.icon" class="icon">
    <span ref="test" class="svg-icon" v-html="setIcon" />
  </li>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    setIcon () {
      return require(`~/assets/icons/${this.$props.data.icon}.svg?raw`)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  display: flex;
  align-items: center;
  justify-content: center;

  height: rem(35px);
  width: rem(35px);

  margin-right: rem(10px);

  border-radius: 100%;
  border: rem(2px) solid $color-grey;

  cursor: pointer;
  transition: background 0.3s;
}

.svg-icon {
  height: rem(13px);
  width: rem(13px);
}

.plus {
  .svg-icon {
    transform: translate(0, -1px);
  }
}

.icon {
  &:hover {
    background: $color-grey;
  }
}

.play {
  border-color: $color-primary;

  .svg-icon {
    transform: translate(1px, -1px);
  }

  svg {
    fill: $color-primary;
  }

  &:hover {
    background: $color-primary;

    svg {
      fill: $color-white;
    }
  }
}
</style>
