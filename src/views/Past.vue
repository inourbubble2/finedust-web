<template>
  <div class="past">
    <div class="inputs">
      <select class="form-control" v-model="year">
        <option :key="i" :value="d" v-for="(d, i) in years">{{ d }}</option>
      </select>
      <select class="form-control" v-model="month">
        <option :key="i" :value="d" v-for="(d, i) in months">{{ d }}</option>
      </select>
      <select class="form-control" v-model="day">
        <option :key="i" :value="d" v-for="(d, i) in days">{{ d }}</option>
      </select>
      <select class="form-control" v-model="hour">
        <option :key="i" :value="d" v-for="(d, i) in hours">{{ d }}</option>
      </select>
    </div>
    <Map v-bind:type="type" v-bind:year="year" v-bind:month="month" v-bind:day="day" v-bind:hour="hour" />
  </div>
</template>

<script>
import Map from '@/components/Map'

export default {
  name: "Past",
  components: {
    Map
  },
  data() {
    return {
      type: 'past',
      year: 2010,
      month: 10,
      day: 10,
      hour: 3,
      years: Array.from({length:11}, (v, i)=> i+2010),
      months: Array.from({length:12}, (v, i)=> i+1),
      days: Array.from({length:31}, (v, i)=> i+1),
      hours: Array.from({length:24}, (v, i)=> i+1)
    }
  }
}
</script>

<style lang="scss" scoped>
.past {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > .inputs {
    padding: 12px;
    & > input {
      width: 32px;
    }
  }
}

</style>
