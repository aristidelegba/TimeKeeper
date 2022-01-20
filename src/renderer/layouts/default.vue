<template>
  <div class="app-container">
    <mainTitleBar />
    <div class="body mt-7 h-full">
      <nuxt />
    </div>
  </div>
</template>

<script>
import appHeader from "@/components/header";
import mainTitleBar from "~/components/mainTitleBar";

export default {
  components: { appHeader, mainTitleBar }
};
</script>

<style lang="scss">
::v-deep .ellipse {
  svg,
  circle {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
    animation: none;
  }
}
body {
  /* display: flex;
  align-items: center;
  justify-content: center; */
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  /* background-repeat: no-repeat;
  background-size: cover;
  color: white; */
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}

html {
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.app-container {
  width: 100vw;
  position: relative;
  height: 100vh;
}
</style>
