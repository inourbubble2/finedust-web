<template>
  <div class="graph">
    <div id="graph-wrapper"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import axios from "axios";

export default {
  name: "Graph",
  mounted() {
    this.drawGraph();
  },
  methods: {
    async getTodayFineDust() {
      const API_KEY = process.env.VUE_APP_API_KEY;
      const url = 'http://openAPI.seoul.go.kr:8088/' + API_KEY + '/json/ListAirQualityByDistrictService/1/30';

      const data = await axios.get(url);
      return data['data']['ListAirQualityByDistrictService']['row'];
    },

    async responseToData(response) {
      let data = {};
      for (let i = 0; i < response.length; i++) {
        const city = response[i];
        const location = city['MSRSTENAME'];
        const pm = city['PM10'];
        if (pm != '점검중')
          data[location] = pm;
      }
      return data;
    },

    async drawGraph() {
      const response = await this.getTodayFineDust();
      let data = await this.responseToData(response);
      data = Object.values(data);

      const divWidth = document.getElementById("graph-wrapper").clientWidth;
      const width = (divWidth < 800) ? divWidth * 0.9 : divWidth;
      const scaleFactor = 5;
      const barHeight = 20;

      const graph = d3.select("#graph-wrapper")
          .append("svg")
          .attr("width", width)
          .attr("height", barHeight * data.length);

      const bar = graph.selectAll("g")
          .data(data)
          .enter()
          .append("g")
          .attr("transform", function (d, i) {
            return "translate(0," + i * barHeight + ")";
          });

      bar.append("rect").attr("width", function (d) {
        return d * scaleFactor;
      }).attr("height", barHeight - 3);

      bar.append("text")
          .attr("x", function (d) {
            return (d * scaleFactor);
          })
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .text(function (d) {
            return d;
          });
    }
  }
}
</script>

<style lang="scss" scoped>
.graph {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;

  & > #graph-wrapper {
    width: 100%;
  }
}
</style>
