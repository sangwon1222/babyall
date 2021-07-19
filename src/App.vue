<template>
  <!-- 전체 화면사이즈 -->
  <div id="app" class="app" @click="_goFullscreen">
    <BrowserCheck v-if="mBrowserCheck" @IosPopClose="IosPopClose" />

    <!-- 가상 app본체 720x1280이 화면에 맞춰서 transform scale 처리됨-->
    <div
      class="app-case"
      ref="app"
      v-show="!isShowActivityPlayer && !isShowTubePlayer"
    >
      <component v-bind:is="currentPage"></component>
      <Popup />
      <LoginErrorCheck />
    </div>

    <div class="wrap" v-if="isShowActivityPlayer">
      <ActivityPlayer
        :category="mCurrentCategory"
        :level="currentLevel"
        :alphabet="mCurrentSymbol"
        :bookID="mCurrentBookID"
        :activitySB="this.mCurrentActivitySB"
        :isMobileMode="mIsMobileMode"
        class="activityViewPC"
        @onClose="_closeActivityView"
      />
    </div>

    <div
      ref="videoCase"
      style="display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center; width:100%; height:100%; background-color:#000;
            position: fixed;"
      v-show="isShowTubePlayer"
    ></div>
    <!-- <FullscreenAlert 
      v-if="!isFullscreen" 
      @goFullscreen="_goFullscreen"
    /> -->
  </div>
</template>

<style scoped>
#app {
  /* overflow: hidden; */
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  /* border:2px red solid;
  box-sizing: border-box; */
}
.app-case {
  overflow: hidden;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1280px;
  height: 720px;
  box-sizing: border-box;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* width: calc( 100vh * (9/18.5) ); */
  /* height: 100vh; */
  /* transform-origin: center; */
  /* background-image: url("./assets/img/bg_portrait.png"); */
}
.wrap {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.activityViewPC {
  width: 100vw !important;
  height: calc(100vw * 0.5625) !important;
}
@media (min-aspect-ratio: 16/9) {
  .activityViewPC {
    width: calc(100vh * 1.7777) !important;
    /* height: calc(100vw * 0.5625) !important; */
    height: 100vh !important;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import ConnectPage from "./pages/ConnectPage.vue";
import Lobby from "./pages/Lobby.vue";
import FirstPage from "./pages/FirstPage.vue";
import ParentSetup from "./pages/ParentSetup.vue";
import MyRoom from "./pages/MyRoom.vue";
import FullscreenAlert from "./components/FullscreenAlert.vue";
import Util from "./Util";

import { SystemModule } from "./store/System";
import { UserModule } from "./store/UserStore";

import ActivityPlayer from "./player/ActivityPlayer.vue";
import { isIOS, isMobilePlatform } from "./Util/Platform";
import { PlayLevel } from "./store/Define";
import Popup from "@/components/PopUp.vue";
import { ParentSetupModule } from "./store/ParentSetup";
import gsap from "gsap";

import LoginErrorCheck from "./components/LoginErrorCheck.vue";
import BrowserCheck from "./components/BrowserCheck.vue";

import { Home as HomeStore } from "@/store/Define";
import Config from "./Util/Config";
import { ResourceManager } from "./Activity/Core/ResourceManager";
import pixiSound from "pixi-sound";

@Component({
  components: {
    ConnectPage,
    Lobby,
    FirstPage,
    ParentSetup,
    MyRoom,

    ActivityPlayer,
    FullscreenAlert,

    LoginErrorCheck,
    Popup,

    BrowserCheck,
  },
})
export default class App extends Vue {
  isShowTubePlayer = false;
  isShowActivityPlayer = false;
  mCurrentCategory = "mypet";
  mCurrentSymbol = "a";
  mCurrentBookID = "1001";
  mCurrentActivitySB = "movie";
  /* 스크롤락관련 처리 201103
    mIsMobileMode = isMobilePlatform();
    */
  mIsMobileMode = false;
  mMSG = "";
  mBrowserCheck = false;

  // private isFullscreen = false;

  get currentLevel(): number {
    if (SystemModule.isDemoMode == true) {
      return UserModule.demoLevel;
    } else return UserModule.levelIDX;
  }
  get currentPage(): string {
    return SystemModule.currentPage;
  }

  private calcScreen(app): Promise<void> {
    return new Promise((resolve, reject) => {
      window.scrollTo(0, 0);
      // window.scrollTo(window.innerWidth/2,window.innerHeight/2)
      // gsap.to(this.$el,{alpha:0,duration:0})
      if (app === undefined) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      app.style.width = w;
      app.style.height = h;
      const currentRatio = w / h;
      let scale = 1;
      window.scrollTo(0, h / 4);
      if (isMobilePlatform()) {
        // 모바일 이면

        scale = w / 1280;
        if (720 * scale > h) {
          scale = h / 720;
        }

        if (h > w) {
          (window["text"] as HTMLDivElement).setAttribute(
            "style",
            "display:block;"
          );
        } else {
          (window["text"] as HTMLDivElement).setAttribute(
            "style",
            "display:none;"
          );
        }
      } else {
        // PC 이면
        (window["text"] as HTMLDivElement).setAttribute(
          "style",
          "display:none;"
        );
        scale = w / 1280;
        if (720 * scale > h) {
          scale = h / 720;
        }
      }
      app.style.transform = `translate(-50%,-50%) scale(${scale})`;
      resolve();
    });
  }

  IosPopClose() {
    this.mBrowserCheck = false;
  }

  async created() {
    await ResourceManager.Handle.loadViewerResource("alphabet/quiz", {
      sound: ["ab_sfx_3.mp3"],
    });
    window["clickSnd"] = ResourceManager.Handle.getViewerResource(
      "alphabet/quiz/ab_sfx_3.mp3"
    ).sound;
  }

  async mounted() {
    if (Util.Platform.getPlatform() === false) {
      this.mBrowserCheck = true;
    }

    (this.$refs.app as HTMLDivElement).ontouchstart = () => {
      null;
    };
    if (window["video"]) {
      window["video"].pause();
    }

    // if (!Util.Platform.isMobilePlatform() ) {
    //     // this.isFullscreen = true;
    // } else {
    //   if( document.fullscreen != undefined){
    //         document.addEventListener("fullscreenchange", () => {
    //             // this.isFullscreen = document.fullscreen;
    //               // window.dispatchEvent(new Event("resize"));
    //         });
    //     }else{
    //         // this.isFullscreen = true;
    //     }
    // }
    // document.addEventListener("fullscreenchange", () => {
    //   window.dispatchEvent(new Event("resize"));
    // });

    if (window["video"] != undefined) window["video"].pause();

    window.addEventListener("resize", async () => {
      await this.calcScreen(this.$refs.app);
    });
    await this.calcScreen(this.$refs.app);
  }

  async _goFullscreen() {
      pixiSound.resumeAll()

    if (!document.fullscreenElement) {
      if (this.$el.requestFullscreen) {
        this.$el.requestFullscreen(); // W3C spec
      } else if ((this.$el as any).mozRequestFullScreen) {
        (this.$el as any).mozRequestFullScreen(); // Firefox
      } else if ((this.$el as any).webkitRequestFullscreen) {
        (this.$el as any).webkitRequestFullscreen(); // Safari
      } else if ((this.$el as any).msRequestFullscreen) {
        (this.$el as any).msRequestFullscreen(); // IE/Edge
      }
    }
    // else {
    //   if (document.exitFullscreen) {
    //     document.exitFullscreen();
    //   } else if ((document as any).mozCancelFullScreen) {
    //     (document as any).mozCancelFullScreen();
    //   } else if ((document as any).webkitExitFullscreen) {
    //     (document as any).webkitExitFullscreen();
    //   }
    // }
  }

  showActivity(info) {
    this.isShowActivityPlayer = true;
    if (info.category) {
      this.mCurrentCategory = info.category;
      if (info.category == "storybooks") {
        this.mCurrentBookID = info.bookID;
        if (info.startActivity !== undefined)
          this.mCurrentActivitySB = info.startActivity;
      } else if (info.category == "alphabet") {
        this.mCurrentSymbol = info.symbol;
      }
    }
  }
  async _closeActivityView() {
    // console.error(window['video'])
    if (window["video"]) {
      window["video"].pause();
    }
    window["video"] = null;
    await UserModule.getHomeData();
    ParentSetupModule.updateRemainByCurrent();
    this.isShowActivityPlayer = false;
    await this.calcScreen(this.$refs.app);
    location.reload();
  }
}
</script>
