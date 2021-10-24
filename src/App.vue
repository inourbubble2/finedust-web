<template>
  <div id="app">
    <div id="header">
      <h2>서울시 미세먼지 예측과 조회</h2>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/future">미래 데이터 예측</router-link> |
        <router-link to="/past">과거 데이터 보기</router-link>
      </div>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">

html, body {
  margin: 0;
  background-color: #e9eef3;
}

#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  flex-direction: column;
  justify-content: center;

  & > #header {
    margin: 0;
    color: #6ba5e3;
    background-color: white;
    & > #nav {
      padding-bottom: 12px;
      a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
          color: #6ba5e3;
        }
      }
    }
  }
  & > #content {
    display: flex;
    justify-content: center;
  }
}




</style>
