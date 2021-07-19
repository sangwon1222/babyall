import Vue from "vue";
//main
import router from "./router";
import App from "./App.vue";
import AppDemo from "./App_Demo.vue";
import { check } from "./version";
import VueAwesomeSwiper from "vue-awesome-swiper";

import "@/assets/swiper.css";

//main
check();

//체험판
import ActivitySalesKit from "./App_SalesKit.vue";

import { GestureManager } from "./Util/GestureManager";
//체험판

import store from "./store";
Vue.config.productionTip = false;
import "./assets/global.scss";
import "sweetalert2/dist/sweetalert2.min.css";
import Util from "./Util";
import Config from "./Util/Config";

Vue.use(VueAwesomeSwiper);

if (Util.Config.devMode == true) {
  // alert("개발용 실행 입니다.")
}

window.oncontextmenu = () => {
  //   alert(`복사방지`)
  return false;
};

if (Util.Config.excuteMode == "saleskit") {
  GestureManager.Handle.init();
  new Vue({
    store,
    render: (h) => h(ActivitySalesKit),
  }).$mount("#app");
} else {
  window["aram"] = {
    play: (id) => {
      Util.Config.excuteMode = "main";
      new Vue({
        store,
        router,
        render: (h) => h(App),
      }).$mount(id);
    },
    playDemo: (id) => {
      Util.Config.excuteMode = "demo";
      GestureManager.Handle.init();
      new Vue({
        store,
        render: (h) => h(AppDemo),
      }).$mount(id);
    },
  };
  if (window["onReadyBabyAll"]) {
    window["onReadyBabyAll"]();
  } else {
    window["aram"].play("#app");
  }
}

let mode = "";
Config.devMode == true ? (mode = "개발용") : (mode = "상용");
window["aramversion"] += [mode];
