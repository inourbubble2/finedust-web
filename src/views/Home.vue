<template>
  <Map v-bind:type="type" />
</template>

<script>
import Map from '@/components/Map'

export default {
  name: "Home",
  components: {
    Map
  },
  data() {
    return {
      type: 'now'
    }
  }
}
</script>

<style scoped>

</style>
