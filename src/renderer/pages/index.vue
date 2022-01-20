<template>
  <div class="flex flex-col bg-white h-full">
    <div class="toolbar flex flex-wrap flex-col-reverse justify-between px-4 ">
      <div class="timeframes flex flex-wrap items-center gap-2 py-4 text-xs">
        <div
          class="
            timeframe
            flex
            items-center
            justify-center
            p-0
            cursor-pointer
            hover:shadow-2xl 
            
          "
          :class="{
            selected: selectedTF && timeframe.name === selectedTF.name
          }"
          v-for="timeframe in timeframes"
          :key="JSON.stringify(timeframe)"
          @click="selectTF(timeframe.name)"
        >
          {{ timeframe.name }}
        </div>
      </div>
      <div class="flex grow items-center justify-center pt-2">
        <div class="border-2 rounded-md p-2">
          {{ new Date().toLocaleTimeString() + "" }}
        </div>
      </div>
    </div>
    <div class="body grid grow sm:p-2  h-full">
      <div
        v-if="selectedTF"
        class="flex h-full p-0 m-0 items-center justify-center"
      >
        <div
          class="
            timers
            flex 
            gap-4
            border-white
            items-center
            justify-center
          "
        >
          <div class="ellipse">
            <vue-ellipse-progress
              :color="'#aaff00'"
              emptyColor="#5f7b21"
              :legendFormatter="({ currentValue }) => selectedTF.name"
              legendClass="legend-custom-style text-white"
              :progress="progressValues[selectedTF.name]"
              :size="100"
              animation="rs 700 400"
            />
          </div>
          <div class="icon-bar cursor-pointer text-xl text-white">
            <i
              class="ri-notification-line"
              v-if="!enableNotification"
              @click="enableNotification = !enableNotification"
            ></i>
            <i
              class="ri-notification-off-line"
              v-if="enableNotification"
              @click="enableNotification = !enableNotification"
            ></i>
          </div>
        </div>
      </div>
      <div class="timers hidden sm:flex flex-wrap justify-center gap-8 p-7 ">
        <div
          class="
            timers
            flex flex-col
            gap-2
            border-white
            items-center
            justify-center
          "
          v-for="(timeframe, index) in timeframes"
          :key="JSON.stringify(timeframe) + index"
        >
          <div class="ellipse">
            <vue-ellipse-progress
              :color="'#aaff00'"
              emptyColor="#5f7b21"
              :legendFormatter="({ currentValue }) => timeframe.name"
              legendClass="legend-custom-style text-white"
              :progress="progressValues[index]"
              :size="100"
            />
            <!-- <Progress
              :transitionDuration="0"
              :radius="50"
              :strokeWidth="10"
              :value="progress"
            >
              <template v-slot:footer>
                <b>Slow One</b>
              </template>
            </Progress> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import mainTitleBar from "~/components/mainTitleBar";
import { remote, BrowserWindow } from "electron";
import { mapMutations, mapGetters } from "vuex";
import { VueEllipseProgress } from "vue-ellipse-progress";
const notificationSound1 = require("../assets/audios/tic_tic_msg.mp3").default;
const notificationSound2 = require("../assets/audios/msg_tone_new_day.mp3")
  .default;
export default {
  asyncData({ store, redirect }) {
    let selectedTF = undefined;
    let enableNotification = true;
    let snooze = false;
    try {
      selectedTF = JSON.parse(localStorage.getItem("selectedTF"));
    } catch (error) {}
    try {
      enableNotification = JSON.parse(
        localStorage.getItem("enableNotification")
      );
    } catch (error) {}
    try {
      snooze = JSON.parse(localStorage.getItem("snooze"));
    } catch (error) {}
    return { selectedTF, enableNotification, snooze };
  },
  components: { mainTitleBar, VueEllipseProgress },
  data: function() {
    return {
      // notificationSound,
      enableNotification: true,
      snooze: false,
      audio: new Audio(notificationSound2),
      date: new Date(),
      time: 0,
      anchor: 5 * 60 * 1000,
      timeframes: {
        "5S": {
          isSelected: false,
          name: "5S",
          description: "1 Minute",
          anchor: 5 * 1000,
          progress: 0
        },
        "1M": {
          isSelected: false,
          name: "1M",
          description: "1 Minute",
          anchor: 60000,
          progress: 0
        },
        "5M": {
          isSelected: false,
          name: "5M",
          description: "5 Minutes",
          anchor: 300000,
          progress: 0
        },
        "15M": {
          isSelected: false,
          name: "15M",
          description: "15 Minutes",
          anchor: 900000,
          progress: 0
        },
        "1H": {
          isSelected: false,
          name: "1H",
          description: "1 Heures",
          anchor: 3600000,
          progress: 0
        },
        "4H": {
          isSelected: false,
          name: "4H",
          description: "4 Heures",
          anchor: 14400000,
          progress: 0
        },
        D: {
          isSelected: false,
          name: "D",
          description: "Daily",
          anchor: 86400000,
          progress: 0
        }
      },
      progressValues: {
        "5S": 0,
        "1M": 0,
        "5M": 0,
        "15M": 0,
        "1H": 0,
        "4H": 0,
        D: 0
      },
      progress: 0
    };
  },
  watch: {
    progressValues: {
      deep: true,
      handler: function(val, oldValue) {
        // console.log(val[this.selectedTF.name]);
        if (val[this.selectedTF.name] >= 80 && this.enableNotification) {
          this.playNotification();
        } else {
          // this.audio.stop();
        }
      }
    },
    enableNotification: {
      handler: (val, old) => {
        localStorage.setItem("enableNotification", val);
      }
    },
    snooze: {
      handler: (val, old) => {
        localStorage.setItem("snooze", val);
      }
    }
  },
  methods: {
    selectTF(name) {
      localStorage.setItem("selectedTF", JSON.stringify(this.timeframes[name]));
      this.selectedTF = this.timeframes[name];
    },
    playNotification() {
      this.audio.play();
    },
    getTimeFrameProgress(anchor) {
      const currentDate = new Date().getTime();
      const toMinutes = val => {
        return val / 60 / 1000;
      };
      const toMs = val => {
        return val * 60 * 1000;
      };
      return (100 * (currentDate % anchor)) / anchor;
    }
  },
  beforeMount() {},
  mounted() {
    // console
    //   .log
    // Object.keys(this.timeframes).reduce((p, c) => {
    //   return { ...p, [c]: 0 };
    // }, {})
    // ();
    document.addEventListener("resize", e => {
      console.log(document.body.width);
    });
    for (const key in this.timeframes) {
      const item = this.timeframes[key];
      setInterval(() => {
        const progress = this.getTimeFrameProgress(item.anchor);
        this.progressValues[key] = Math.abs(progress);
      }, 500);
    }
  },
  computed: {
    windowsSize() {
      const { height, width } = remote
        .getCurrentWindow()
        .webContents.getOwnerBrowserWindow()
        .getBounds();
      return height;
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  background: #78157a;
  color: white;
  .timeframe {
    &.selected {
      border-color: #ed64e2;
    }
    border-bottom: 2px solid;
    margin-right: 10px;
  }
}
img {
  background-color: rgba(0, 0, 0, 0.521);
  opacity: 1;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.body {
  align-items: center;
  width: 100%;
  background: #3e423a;
}

.rotate {
  animation: rotate 1s infinite;
}
.input {
  position: absolute;
  top: 50px;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
}
input {
  outline: none;
  font-family: "Poppins";
  padding: 5px;
  border-radius: 4px;
}
@keyframes rotate {
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}
</style>
