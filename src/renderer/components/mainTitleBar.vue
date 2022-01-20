<template>
  <div class="main-title-bar h-7 fixed">
    <div class="inner electron-titlebar"></div>
    <div class="leading text-white electron-titlebar">
      {{ title }}
    </div>
    <div class="left text-white">
      <div class="system-buttons-container">
        <div class="system-button" @click="reduce()">
          <i class="ri-subtract-line"></i>
        </div>
        <div class="system-button" v-if="fullscreen" @click="minimize()">
          <i class="ri-checkbox-multiple-blank-line"></i>
        </div>
        <div class="system-button" v-if="!fullscreen" @click="maximize()">
          <i class="ri-checkbox-blank-line"></i>
        </div>
        <div class="system-button hover:bg-red-700" @click="close()">
          <i class="ri-close-line"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { remote } from "electron";
export default {
  name: "mainTitleBar",
  props: {
    title: {
      type: String,
      default: "TimeKeeper"
    }
  },
  data() {
    return {
      fullscreen: false
    };
  },
  mounted() {
    this.fullscreen = false;
  },
  methods: {
    reduce() {
      remote.getCurrentWindow().minimize();
      this.fullscreen = !this.fullscreen;
    },
    minimize() {
      remote.getCurrentWindow().restore();
      this.fullscreen = !this.fullscreen;
    },
    maximize() {
      remote.getCurrentWindow().maximize();
      this.fullscreen = !this.fullscreen;
    },
    close() {
      remote.getCurrentWindow().minimize();
      remote.getCurrentWindow().setSkipTaskbar(true);
    }
  },
  computed: {
    // fullscreen() {
    //   return remote.getCurrentWindow().isMaximizable();
    // }
  }
};
</script>

<style lang="scss" scoped>
.main-title-bar {
  display: flex;
  justify-content: space-between;
  top: 0;
  left: 0;
  // height: 30px;
  font-size: 12px;
  padding: 0px 0px;
  background: #78157a;
  width: 100%;
  text-align: left;
  .leading {
    display: flex;
    margin-left: 10px;
    align-items: center;
  }

  .inner {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
  }

  .left {
    display: flex;
    z-index: 5;
    position: absolute;
    right: 0;
    height: 100%;
    .system-buttons-container {
      -webkit-app-region: no-drag;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      height: 100%;
      .system-button {
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        &:hover {
          background: #bb34bb;
        }
      }
    }
  }
}

.electron-titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
</style>
