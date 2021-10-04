<template>
  <div id="map-wrapper" class="map-wrapper">

  </div>
</template>

<script>
import * as d3 from 'd3'
const MAP_GEOJSON = require('../../seoul.geo.json')

export default {
  name: "Map",
  props: {

  },
  data() {
    return {

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
    drawMap() {
      const geojson = MAP_GEOJSON;

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

      // 배경 그리기
      // const background = svg.append('rect')
      //     .attr('class', 'background')
      //     .attr('width', width)
      //     .attr('height', height);

      // 지도가 그려지는 그래픽 노드(g) 생성
      const g = svg.append('g');
      // const effectLayer = g.append('g').classed('effect-layer', true);
      // 지도가 그려지는 그래픽 노드
      const mapLayer = g.append('g').classed('map-layer', true);
      // // 아이콘이 그려지는 그래픽 노드
      // const iconsLayer = g.append('g').classed('icons-layer', true);

      // 지도의 출력 방법을 선택(메로카토르)
      let projection = d3.geoMercator()
          .scale(1)
          .translate([0, 0]);

      // svg 그림의 크기에 따라 출력될 지도의 크기를 다시 계산
      const path = d3.geoPath().projection(projection);
      const bounds = path.bounds(geojson);
      const widthScale = (bounds[1][0] - bounds[0][0]) / width;
      const heightScale = (bounds[1][1] - bounds[0][1]) / height;
      const scale = 0.95 / Math.max(widthScale, heightScale);
      const xoffset = width/2 - scale * (bounds[1][0] + bounds[0][0]) /2 + 0;
      const yoffset = height/2 - scale * (bounds[1][1] + bounds[0][1])/2 + 0;
      const offset = [xoffset, yoffset];
      projection.scale(scale).translate(offset);

      const color = d3.scaleLinear()
          .domain([1, 20])
          .clamp(true)
          .range(['#595959', '#595959']);

      // Get province color
      function fillFn(){
        return color(0);
      }

      mapLayer
          .selectAll('path')
          .data(geojson.features)
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
