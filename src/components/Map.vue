<template>
  <div class="map">
    <div id="loading" v-if="loading">
      Loading...
    </div>
    <div id="map-wrapper" class="map-wrapper">

    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import axios from 'axios';
const MAP_GEO_JSON = require('../../seoul.geo.json')

export default {
  name: "Map",
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
      this.drawMap();
    },
    month() {
      this.drawMap();
    },
    day() {
      this.drawMap();
    },
    hour() {
      this.drawMap();
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
        data[location] = pm;
      }
      return data;
    },
    async drawMap() {
      this.loading = true;

      let data;
      if (this.type == 'now') {
        const response = await this.getTodayFineDust();
        data = await this.responseToData(response);
      } else {
        const response = await this.getPastFineDust(this.year, this.month, this.day, this.hour);
        data = response['pm_result'];
      }

      const geo_json = MAP_GEO_JSON;

      // 현재 브라우저의 크기 계산
      const divWidth = document.getElementById("map-wrapper").clientWidth;
      const width = (divWidth < 1000) ? divWidth * 0.6 : divWidth * 0.7;
      const height = width * 0.8;

      // 지도를 그리기 위한 svg 생성
      let svg
      if (this.is_first_drawing) {
        svg = d3
            .select('.map-wrapper')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        this.is_first_drawing = false;
      } else {
        svg = d3
            .select('.map-wrapper')
            .select('svg')
            .attr('width', width)
            .attr('height', height);
      }


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

      function nameToPm(d) {
        return data[d.properties.name];
      }

      // Get province color
      function fillFn(d) {
        const pm = nameToPm(d);
        return pmToColor(pm);
      }

      console.log(data);
      mapLayer
        .selectAll('path')
        .data(geo_json.features)
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', fillFn);
      this.loading = false;
    }
  }
}
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  & > #loading {
    font-size: 24px;
    font-family: Helvetica, Arial, sans-serif;
    padding: 12px;
  }
  & > #map-wrapper {

  }
  @media screen and (max-width:512px) {
    #map-wrapper{width: 100%};
  }
  @media screen and (min-width:512px) and (max-width:1024px) {
    #map-wrapper{width: 80%};
  }
  @media screen and (min-width:1024px) {
    #map-wrapper{width: 48%};
  }
}

</style>
