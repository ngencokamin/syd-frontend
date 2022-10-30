<template>
  <div id="loading">
    <img
      id="loadingImg"
      src="../images/loading.svg"
      alt="loading..."
      width="200"
    />

    <p id="loadingText">Loading</p>
  </div>
</template>

<style>
#loading {
  position: absolute;
  z-index: 1000;
  background-color: #44475a;
  height: 100vh;
  width: 100%;
  text-align: center;
}
#loadingImg {
  position: relative;
  margin-top: 50%;
  height: auto;
}

#loadingText {
  font-family: Cattedrale;
  margin-top: 0;
  padding-top: 0;
  font-size: 3em;
  padding-bottom: 0;
}
</style>

<script>
module.exports = {};
</script>
