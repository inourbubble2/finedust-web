<template>
  <div id="app">
    <div id="header">
      서울시 미세먼지 예측 & 조회
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/future">미래 데이터 예측</router-link> |
      <router-link to="/past">과거 데이터 보기</router-link>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#header {
  font-size: 24px;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#content {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
