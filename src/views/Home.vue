<template>
  <div class="home">
    <p>{{ date.getFullYear() }}년
      {{ date.getMonth()+1 }}월
      {{ date.getDate() }}일
      {{ date.getHours()}}시의 구별 미세먼지 농도 </p>
    <Map v-bind:type="type" />
    <Graph v-bind:type="type" />
  </div>
</template>

<script>
import Map from '@/components/Map'
import Graph from "../components/Graph";

export default {
  name: "Home",
  components: {
    Graph,
    Map
  },
  data() {
    return {
      type: 'now',
      date: new Date()
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  & > p {
      background-color: white;
      margin: 0px;
      padding-bottom: 3px;
  }
}
</style>
