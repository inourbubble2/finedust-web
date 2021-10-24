<template>
  <Map v-bind:type="type" />
</template>

<script>
import Map from '@/components/Map'

export default {
  name: "Future",
  components: {
    Map
  },
  data() {
    return {
      type: 'future'
    }
  }
}
</script>

<style scoped>

</style>
