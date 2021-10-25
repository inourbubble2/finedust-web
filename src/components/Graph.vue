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
  props: [
    "type", "year", "month", "day", "hour"
  ],
  data() {
    return {
      is_first_drawing: true,
      loading: true,
    }
  },
  watch: {
    year() {
      this.drawGraph();
    },
    month() {
      this.drawGraph();
    },
    day() {
      this.drawGraph();
    },
    hour() {
      this.drawGraph();
    }
  },
  mounted() {
    this.drawGraph();
  },
  methods: {
    async getPastFineDust(year, month, day, hour) {
      const url = 'http://localhost:5000/pm?' + 'year=' + year + '&month=' + month + '&day=' + day + '&hour=' + hour;
      const data = await axios.get(url);
      return data.data;
    },

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

    async sortData(data) {
      const sortable = Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
      return sortable
    },

    async drawGraph() {
      let data;
      if (this.type == 'now') {
        const response = await this.getTodayFineDust();
        data = await this.responseToData(response);
        data = await this.sortData(data);
      } else {
        const response = await this.getPastFineDust(this.year, this.month, this.day, this.hour);
        data = response['pm_result'];
        data = await this.sortData(data);
      }

      // const divWidth = document.getElementById("graph-wrapper").clientWidth;
      // const width = (divWidth < 800) ? divWidth * 0.9 : divWidth / 3;
      const width = 700;
      const scaleFactor = 3;
      const barHeight = 30;

      let graph;
      if (this.is_first_drawing) {
        graph = d3.select("#graph-wrapper")
            .append("svg")
            .attr("width", width)
            .attr("height", barHeight * Object.values(data).length);
        this.is_first_drawing = false;
      } else {
        graph = d3.select("#graph-wrapper")
            .select("svg")
            .attr("width", width)
            .attr("height", barHeight * Object.values(data).length);
      }

      const bar = graph.selectAll("g")
          .data(Object.values(data))
          .enter()
          .append("g")
          .attr("transform", function (d, i) {
            return "translate(0," + i * barHeight + ")";
          });

      function pmToColor(pm) {
        if (pm <= 15) {
          return '#6ba5e3';
        } else if (pm <= 80) {
          return '#67e073';
        } else if (pm <= 150) {
          return '#e3c764';
        } else if (pm <= 300) {
          return '#e36464';
        } else {
          return '#FFFFFF';
        }
      }

      bar.append("rect").attr("width", function (d) {
        return d * scaleFactor;
      }).attr("height", barHeight - 3)
          .attr("fill", function (d) {
            return pmToColor(d);
          });

      bar.append("text")
          .attr("x", 3)
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .attr("fill", "#FFFFFF")
          .text(function (d, i) {
            return " " + Object.keys(data)[i] + " " + Object.values(data)[i];
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
  padding: 30px;
  background-color: white;

  & > #graph-wrapper {
    width: 100%;
  }
}
</style>
