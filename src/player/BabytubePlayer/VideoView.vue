<template>
  <div class="VideoView">
    <div class="videoBox" @click="_showControl">
      <!-- <div ref='test' class="test">ssss</div> -->
      <!-- <canvas ref="videoCanvas" v-show="false"></canvas> -->

      <!-- <div class="console" style="position:absolute; top:0; left:0; z-index:200000;color:red; font-weight:bold; font-size:2rem;" v-html="console"></div> -->

      <video
        v-show="true"
        crossOrigin=""
        autoplay
        playsinline
        ref="video"
        @ended="_onVideoPlayEnd"
      ></video>

      <div
        v-show="mShowControl"
        ref="control"
        class="control"
        @click.stop="_closeControl"
      >
        <img
          class="play"
          :src="
            this.mIsPlaying
              ? 'img/babytube/control_pause.png'
              : 'img/babytube/control_play.png'
          "
          @click.stop="_onPlayPauseClicked"
        />

        <div class="closebtn" @click="close()">
          <img src="img/babytube/close.png" />
        </div>

        <div ref="bottombar" class="bottombar" @click.stop="">
          <div class="guage">
            <div class="bg"></div>
            <div class="time">
              <span>{{ mCurrentT }}</span>
              <span class="totalT">{{ mTotalT }}</span>
            </div>
            <div class="cursor" :style="`left: ${mCursorPos}px;`"></div>
            <div class="listener" ref="evtListener"></div>
            <div
              ref="guageBar"
              class="bar"
              :style="`width:calc( (100% - 10rem) * ${mProgress} );`"
            ></div>
          </div>

          <div class="repeatCount" refs="repeatCount" @click="_repeatMode">
            <img
              v-if="!mLoopModeFlag"
              :src="`img/babytube/repeat_${mLoopMode}.png`"
            />
            <img
              v-if="mLoopModeFlag"
              src="img/babytube/repeat_none.png"
              @click="_changeLoopMode('none')"
            />
            <img
              v-if="mLoopModeFlag"
              src="img/babytube/repeat_one.png"
              @click="_changeLoopMode('one')"
            />
            <img
              v-if="mLoopModeFlag"
              src="img/babytube/repeat_all.png"
              @click="_changeLoopMode('all')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$guageHeight: 5px;
.VideoView {
  overflow: hidden;
  position: fixed;
  top: -2px;
  left: 0;
  width: 100%;
  height: 0;
  transform-origin: 50% 50%;
  background-color: #000;
  display: flex;
  flex-direction: column;
  z-index: 200;
  /* animation: start forwards 1s; */
  /* @keyframes start {
        from{height:0;}
        to{height:101%;}
    } */
  .videoBox {
    // width:720px;
    // height:406px;
    position: relative;
    width: 100%;
    height: 100%;
    left: -2px;
    background-color: #000;
    video {
      width: 100%;
    }
  }

  .control {
    position: fixed;
    top: -12px;
    left: -10px;
    width: calc(100% + 10px);
    height: calc(100% + 12px);
    border: 6px black solid;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.5) 20%,
      rgba(0, 0, 0, 0.5) 100%
    );
    /* background-color: rgba(0,0,0,0.5); */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .play {
      cursor: pointer;
      width: 15%;
      transition: width 0.5s;
    }
    .play:hover {
      width: 18%;
    }

    .bottombar {
      position: fixed;
      z-index: 1000;
      bottom: 0;
      width: 100%;
      height: 4rem;
      /* background-color: #333; */
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(0, 0, 0, 0)
      );
      display: flex;
      flex: flex-wrap;
      justify-content: space-between;
      align-items: center;

      .guage {
        cursor: pointer;

        width: 100%;
        position: relative;
        display: flex;

        .time {
          position: absolute;
          top: -0.8rem;
          right: 1rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          span {
            color: #fff;
            font-weight: lighter;
            font-family: "NotoSans";
            font-size: 1rem;
            padding: 0.1rem 0.5rem 0.1rem 0;
          }
          .totalT {
            color: #777;
          }
        }
        .bg {
          position: absolute;
          width: calc(100% - 10rem);
          height: $guageHeight;
          left: 10px;
          border-radius: 10px;
          background-color: #fff;
        }
        .bar {
          cursor: pointer;

          position: absolute;
          left: 10px;
          width: calc((100% - 10rem) * 0);
          height: $guageHeight;
          border-radius: 10px;
          background-color: rgb(199, 10, 10);
        }
        .cursor {
          position: absolute;
          top: -15px;
          left: 10%;
          border-radius: 20px;
          width: 30px;
          height: 30px;
          background-color: rgb(231, 73, 73);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          z-index: 1001;
        }
        .listener {
          // border:1px solid #FFF;
          position: absolute;
          width: calc((100% - 10rem));
          height: 5rem;
          top: -2.5rem;
          left: 1rem;
          // background: rgba(255,255,255,0.3);
          z-index: 2000;
        }
      }
      .repeatCount {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: 1.5rem 1rem 0 0;
        height: 1.6rem;
        transform: translateY(-50%);
        transition: 0.5s all;
        cursor: pointer;
        > img {
          width: 100%;
          height: auto;
        }
      }
    }

    .closebtn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      cursor: pointer;
    }
  }
}

.video-fullscreen {
  position: absolute;
  // transform: translate( -280px, 279px) rotate(90deg);
  z-index: 1000;
  // width:1280px;
  // height:720px;
  transform: rotate(90deg);
  .videoBox {
    position: absolute;
    // -webkit-transform:rotate(90deg);
  }
}

.video-fullscreen-pc {
  position: absolute;
  top: auto !important;
  left: auto !important;
  width: auto !important;
  height: auto !important;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  BabyTubeItemInfo,
  BabyTubeModule,
  PlayMode,
} from "../../store/Babytube";

import gsap from "gsap";
import { isIOS, isMobilePlatform } from "@/Util/Platform";
import AppVue from "@/App.vue";
import { MediaPlayer, MediaPlayerClass } from "dashjs";
import { Buffer } from "pixi.js";
import Loading from "@/components/Loading.vue";

let sParent = null;
@Component({
  components: {},
})
export default class VideoView extends Vue {
  @Prop({ required: true }) private videoInfo!: BabyTubeItemInfo;

  private mDashPlayer: MediaPlayerClass;

  private mIsFullScreen = false;
  private mShowControl = false;
  private mIsPlaying = false;
  private mTotalT = "--:--";
  private mCurrentT = "--:--";

  private mProgress = 0;
  private mCursorPos = 0;
  private mCursorDowned = false;

  private console = "";
  private mTouchEndX = 0;

  private mLoopModeFlag = false;
  private mLoopMode = "all";

  $refs: {
    // videoCanvas: HTMLCanvasElement;
    video: HTMLVideoElement;
    evtListener: HTMLDivElement;
    bottombar: HTMLDivElement;
    control: HTMLDivElement;
    guageBar: HTMLDivElement;
    test: HTMLDivElement;
    repeatCount: HTMLDivElement;
  };

  get video(): HTMLVideoElement {
    return this.$refs.video;
  }

  @Watch("videoInfo")
  onChangeVideoURL(curr, old) {
    gsap.to(document.getElementsByClassName("videoBox"), {
      opacity: 0,
      duration: 0,
    });
    console.log("---->", curr, old);

    if (this.mDashPlayer) {
      this.mDashPlayer.reset();
    }

    if (isIOS()) {
      this.$refs.video.src = this.videoInfo.mp4;
      this.$refs.video.autoplay = true;
      gsap.to(document.getElementsByClassName("videoBox"), {
        delay: 1,
        opacity: 1,
        duration: 0.5,
      });
    } else {
      const url = this.videoInfo.movie;
      this.mDashPlayer = MediaPlayer().create();
      this.mDashPlayer.initialize();
      this.mDashPlayer.attachView(this.$refs.video);
      this.mDashPlayer.setAutoPlay(true);
      this.mDashPlayer.attachSource(url);
      this.mDashPlayer.on("canPlay", () => {
        this.$refs.video.play();
        gsap.to(document.getElementsByClassName("videoBox"), {
          delay: 1,
          opacity: 1,
          duration: 0.5,
        });
      });
    }
  }

  mounted() {
    this.mLoopMode = "all";
    this.mCursorDowned = false;
    gsap.to(this.$el, { height: 740, duration: 0.5 });
    sParent = this.$el.parentElement;

    this.$refs.video.crossOrigin = "";

    this.$refs.video.src = this.videoInfo.mp4;

    if (isIOS()) {
      this.$refs.video.autoplay = true;
    } else {
      // this.$refs.video.play();
      const url = this.videoInfo.movie;
      this.mDashPlayer = MediaPlayer().create();
      this.mDashPlayer.initialize();
      this.mDashPlayer.attachView(this.$refs.video);
      this.mDashPlayer.setAutoPlay(true);
      this.mDashPlayer.attachSource(url);
      this.mDashPlayer.on("canPlay", () => {
        this.$refs.video.play();
      });
    }
    window["video"] = this.$refs.video;

    this.$emit("onToggleVisible", true);
    this.$nextTick(() => {
      //비디오에 콘트롤 관련 이벤트를 바인딩.

      const video = this.$refs.video;

      video.onloadeddata = () => {
        const date = new Date(video.duration * 1000);
        const m = "0" + date.getMinutes();
        const s = "0" + date.getSeconds();
        this.mTotalT = m.substr(-2) + ":" + s.substr(-2);
      };
      video.ontimeupdate = () => {
        const date = new Date(video.currentTime * 1000);
        const m = "0" + date.getMinutes();
        const s = "0" + date.getSeconds();
        this.mCurrentT = m.substr(-2) + ":" + s.substr(-2);
        this.mProgress = video.currentTime / video.duration;
        if (this.mCursorDowned == false) {
          const bar = this.$refs.guageBar;
          // console.log( bar.clientWidth, this.mCursorPos )
          if (bar) this.mCursorPos = bar.clientWidth;
        }
        // console.log( "PROGRESS", this.mProgress);
      };
      video.onplay = () => {
        this.mIsPlaying = true;
      };
      video.onpause = () => {
        this.mIsPlaying = false;
      };

      // const eventer: HTMLDivElement = this.$refs.evtListener;
      const eventer: HTMLDivElement = this.$refs.evtListener;
      this.$el as HTMLDivElement;

      if (eventer) {
        eventer.onpointerdown = (evt) => {
          evt.stopPropagation();
          this._onGuageDowned(evt.offsetX);
        };
        eventer.onpointermove = (evt) => {
          evt.stopPropagation();
          this._onGuageMoved(evt.offsetX);
        };

        eventer.onpointerout = (evt) => {
          evt.stopPropagation();
          this._onGuageUp(this.mTouchEndX);
        };

        eventer.onpointerup = (evt) => {
          evt.stopPropagation();
          this._onGuageUp(evt.offsetX);
        };

        eventer.onclick = (evt) => {
          evt.stopPropagation();
          this._onGuageUp(evt.offsetX);
        };

        // eventer.ontouchmove = (evt: TouchEvent)=>{
        //     evt.stopPropagation();
        //     const bound = (evt.target as HTMLDivElement).getBoundingClientRect();
        //     const r = (evt.target as HTMLDivElement).getBoundingClientRect();
        //     let mx = evt.touches[0].clientX - bound.x;
        //     if(mx <0) mx = 0;

        //     const ratio = (!this.mIsFullScreen?720:(window.innerWidth-20))/bound.width
        //     // const ratio = (!this.mIsFullScreen?1280:(window.innerWidth-20))/bound.width
        //     mx = ratio * mx;
        //     this._onGuageMoved( mx );
        //     // this.console=`
        //     //     videoW:${this.$refs.video.videoWidth}
        //     //     w:${bound.width}
        //     //     boundx:${bound.x}
        //     //     mx:${mx}
        //     // `
        // }
        // eventer.ontouchend = (evt: TouchEvent)=>{
        //     alert(`END`)
        //     evt.stopPropagation();
        //     this._onGuageUp( this.mTouchEndX  );
        // }
      }
    });
  }

  destroyed() {
    // if(this.mDashPlayer)this.mDashPlayer.reset();
    if (window["video"]) {
      window["video"].pause();
      window["video"] = null;
    }
    console.log("destroyed!");
  }

  private _getLoopImage(): string {
    let ret = "img/babytube/repeat_all.png";
    switch (BabyTubeModule.playMode) {
      case PlayMode.None:
        {
          ret = "img/babytube/repeat_none.png";
        }
        break;
      case PlayMode.LoopOne:
        {
          ret = "img/babytube/repeat_one.png";
        }
        break;
      case PlayMode.LoopAll:
        {
          ret = "img/babytube/repeat_all.png";
        }
        break;
    }
    return ret;
  }

  private _repeatMode() {
    // 반복 버튼 show/hide 기능
    if (this.mLoopModeFlag) {
      gsap.to(document.getElementsByClassName("repeatCount"), {
        height: 100 / 3,
        duration: 0.1,
      });
    } else {
      gsap.to(document.getElementsByClassName("repeatCount"), {
        height: 100,
        duration: 0.1,
      });
    }
    this.mLoopModeFlag = !this.mLoopModeFlag;
  }

  private _changeLoopMode(mode: string) {
    this.mLoopMode = mode;
    BabyTubeModule.selectPlayMode(mode);
  }

  async _onVideoPlayEnd() {
    if (this.mLoopMode == "one") {
      this.$refs.video.currentTime = 0;
    } else {
      await this.$emit("onVideoPlayEnd");
    }
    const flag = await BabyTubeModule.selectNext();
    if (flag && this.mLoopMode != "none") {
      this.$refs.video.play();
    } else {
      this.$refs.video.pause();
    }
  }

  private _showControl() {
    console.log(`_showControl`);
    // if(this.mIsFullScreen==false){
    //     this.mIsFullScreen = true;
    //     const div = this.$root.$children[0].$refs.videoCase as HTMLDivElement;
    //     this.$el.classList.add( "video-fullscreen-pc");
    //     sParent.removeChild( this.$el );
    //     div.appendChild( this.$el );

    //     const app = this.$root.$children[0] as AppVue;
    //     app.isShowTubePlayer = true;
    //     return;
    // }
    this.mShowControl = true;
    this.$nextTick(() => {
      const control = this.$refs.control as HTMLDivElement;
      control.style.opacity = "0";
      gsap.to(control, { css: { opacity: 1 }, duration: 0.5 });
    });
  }

  private _closeControl() {
    const control = this.$refs.control;
    gsap.to(control, {
      css: { opacity: 0 },
      duration: 0.5,
      onComplete: () => {
        this.mShowControl = false;
      },
    });
  }

  private _onPlayPauseClicked() {
    console.log("play toggled");

    if (this.mIsPlaying) {
      this.$refs.video.pause();
    } else {
      this.$refs.video.play();
    }
    this.mIsPlaying = !this.mIsPlaying;
  }

  private _onGuageDowned(x: number) {
    this.mCursorDowned = true;
  }
  private _onGuageMoved(x: number) {
    if (this.mCursorDowned) {
      this.mCursorPos = x + 10;
      if (this.mCursorPos < 0) this.mCursorPos = 0;
      if (this.mCursorPos > this.$refs.evtListener.clientWidth)
        this.mCursorPos = this.$refs.evtListener.clientWidth - 20;

      this.mTouchEndX = this.mCursorPos;
    }
  }
  private _onGuageUp(x: number) {
    if (this.mCursorDowned === false) {
      return;
    }
    const video: HTMLVideoElement = this.$refs.video as HTMLVideoElement;

    this.mCursorDowned = false;

    this.mCursorPos = x + 10;
    if (this.mCursorPos < 0) this.mCursorPos = 0;
    if (this.mCursorPos > this.$refs.evtListener.clientWidth)
      this.mCursorPos = this.$refs.evtListener.clientWidth - 20;

    let percent = 0;
    percent = this.mCursorPos / this.$refs.evtListener.clientWidth;

    this.$refs.video.currentTime = this.$refs.video.duration * percent;

    if (video.buffered.length > 0) {
      video.buffered.start(0);
      video.buffered.end(0);
    }
  }

  // onFullscreen(){
  //     const bottomBar = this.$refs.bottombar;
  //     const div = this.$root.$children[0].$refs.videoCase as HTMLDivElement;
  //     if( this.mIsFullScreen ){
  //         this.mIsFullScreen = false;
  //         this.$el.classList.remove( "video-fullscreen-pc");
  //         div.removeChild( this.$el );
  //         sParent.appendChild( this.$el );

  //         const app = this.$root.$children[0] as AppVue;
  //         app.isShowTubePlayer = false;

  //     }else{
  //         this.mIsFullScreen = true;
  //         /* 스크롤락관련 처리 201103
  //         if( !isMobilePlatform() ){
  //             this.$el.classList.add( "video-fullscreen-pc");
  //             sParent.removeChild( this.$el );
  //             div.appendChild( this.$el );

  //             const app = this.$root.$children[0] as AppVue;
  //             app.isShowTubePlayer = true;
  //         }else{
  //             this.$el.classList.add( "video-fullscreen");
  //         }
  //         */
  //         this.$el.classList.add( "video-fullscreen-pc");
  //         sParent.removeChild( this.$el );
  //         div.appendChild( this.$el );

  //         const app = this.$root.$children[0] as AppVue;
  //         app.isShowTubePlayer = true;

  //     }

  //     // console.log( this.$el.classList );
  // }
  play() {
    const video: HTMLVideoElement = this.$refs.video;

    video.currentTime = 0;
    if (isIOS()) {
      video.oncanplay = () => {
        video.play();
        video.oncanplay = null;
      };
    } else {
      video.play();
    }
  }

  close() {
    gsap
      .to(this.$el, { height: 0, duration: 0.3 })
      .eventCallback("onComplete", () => {
        this.$emit(`close`);
      });
  }
}
</script>
