<template>
  <div id="map-wrapper" class="map-wrapper">

  </div>
</template>

<script>
import * as d3 from 'd3'
import axios from 'axios';
const MAP_GEO_JSON = require('../../seoul.geo.json')

export default {
  name: "Map",
  props: {

  },
  data() {
    return {
      data: null
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
    this.drawMap();
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
        const gu = city['MSRSTENAME'];
        const pm10 = city['PM10'];
        const grade = city['GRADE'];
        data[gu] = {'pm10':pm10, 'grade':grade};
      }
      return data;
    },

    async drawMap() {
      const response = await this.getTodayFineDust();
      const data = await this.responseToData(response);

      const geo_json = MAP_GEO_JSON;

      // 현재 브라우저의 크기 계산
      const divWidth = document.getElementById("map-wrapper").clientWidth;
      const width = (divWidth < 1000) ? divWidth * 0.9 : 1000;
      const height = width * 1;

      // 지도를 그리기 위한 svg 생성
      const svg = d3
          .select('.map-wrapper')
          .append('svg')
          .attr('width', width)
          .attr('height', height);

      // 지도가 그려지는 그래픽 노드(g) 생성
      const g = svg.append('g');

      // 지도가 그려지는 그래픽 노드
      const mapLayer = g.append('g').classed('map-layer', true);

      // 지도의 출력 방법을 선택(메로카토르)
      let projection = d3.geoMercator()
          .scale(1)
          .translate([0, 0]);

      // svg 그림의 크기에 따라 출력될 지도의 크기를 다시 계산
      const path = d3.geoPath().projection(projection);
      const bounds = path.bounds(geo_json);
      const widthScale = (bounds[1][0] - bounds[0][0]) / width;
      const heightScale = (bounds[1][1] - bounds[0][1]) / height;
      const scale = 0.95 / Math.max(widthScale, heightScale);
      const x_offset = width / 2 - scale * (bounds[1][0] + bounds[0][0]) / 2 + 0;
      const y_offset = height / 2 - scale * (bounds[1][1] + bounds[0][1]) / 2 + 0;
      const offset = [x_offset, y_offset];
      projection.scale(scale).translate(offset);

      function pmToColor(pm) {
        if (pm < 10) {
          return '#6ba5e3';
        } else if (pm < 20) {
          return '#67e073';
        } else if (pm < 30) {
          return '#e3c764';
        } else {
          return '#e36464';
        }
      }

      function nameToPm(d) {
        return data[d.properties.name]['pm10'];
      }

      // Get province color
      function fillFn(d) {
        const pm10 = nameToPm(d);
        return pmToColor(pm10);
      }

      mapLayer
        .selectAll('path')
        .data(geo_json.features)
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', fillFn);
    }
  }
}
</script>

<style scoped>

</style>
