<template>
  <div class="babytubeplayer">
    <!-- <div class="closebtn" @click="_close">
        <img src="img/babytube/close.png" />
    </div>
    -->
    <VideoView
      ref="video"
      class="video"
      :videoInfo="currentPlayInfo"
      @onVideoPlayEnd="_onVideoPlayEnd"
      @close="startVideo"
      v-if="mIsVisible"
    ></VideoView>

    <div class="closebtn">
      <img src="img/babytube/header_close.png" class="close" @click="_close" />
      <img :src="getBabyTubeIMG()" class="background" alt="" />
    </div>

    <div ref="playlist" class="playlist">
      <div class="containerCase">
        <div
          class="container"
          style="overflow-y:auto; height: `(${this.playList.length}) *196`"
        >
          <BabytubeListItem
            v-for="(item, idx) in playlist"
            :info="item"
            :key="idx"
            @toggleFavorite="_onToggleFavorite"
            @onSelectVideo="_onSelectVideo"
          ></BabytubeListItem>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* .video {
    position: absolute;
    top:0px;
    left:0px;
    z-index: 200;
    transform-origin: 50% 50%;
    
    video{ 
        -moz-transform:rotate(0.01deg);
        -webkit-transform:rotate(0.01deg);
        -o-transform:rotate(0.01deg);
        -ms-transform:rotate(0.01deg);
        transform:rotate(0.01deg);
        // object-fit: cover;
        width:100%;
    }
} */
.video-fullscreen {
  /* transform:rotate(90deg); */
  /* transform: translate( -50%, -50%) rotate(90deg); */
  top: 0;
  left: 0;
  /* top:0; */
  /* left:0; */
  z-index: 100;
  width: 1282px;
  height: 724px;
}
.babytubeplayer {
  position: absolute;
  z-index: 1000;
  top: 2px;
  width: inherit;
  height: inherit;
  background-color: #fff;
  .closebtn {
    position: relative;
    top: -4.5rem;
    left: 0;

    width: 100%;
    height: 4.5rem;

    z-index: 100;
    font-size: 1.5em;
    /* transition: color 0.5s; */
    cursor: pointer;
    animation: startHead 0.5s forwards;
    @keyframes startHead {
      from {
        top: -4.5rem;
      }
      to {
        top: -2px;
      }
    }
    > img.close {
      position: absolute;
      top: 50%;
      left: 1rem;
      transform: translateY(-50%);
      z-index: 100;
    }
    > img.background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4);
    }
  }
  .control {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  /* .closebtn:hover {
        color: rgb(117, 177, 255);
    } */
  .title {
    padding: 1rem;
    font-size: 1.5rem;
  }

  video {
    width: 100%;
  }
}

.playlist {
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;

  top: 50rem;
  padding: 0 1.5rem 2.5rem;
  box-sizing: border-box;
  background-color: #efefef;

  width: 100%;
  height: 680px;

  box-sizing: border-box;
  animation: start forwards 0.5s 0.5s;
  // -ms-overflow-style: none; /* IE and Edge */
  // scrollbar-width: none; /* Firefox */
  .containerCase {
    overflow-y: auto;
    position: relative;
    padding-top: 2.5rem;
    .container {
      overflow-y: auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;
      /* height: 1440px; */
    }
  }
  @keyframes start {
    from {
      top: 50rem;
    }
    to {
      top: -2px;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Axios from "axios";
import gsap from "gsap";

import BabytubeListItem from "./BabytubePlayer/ListItem.vue";
import VideoView from "./BabytubePlayer/VideoView.vue";

import Util from "../Util";
import { BabyTubeModule, BabyTubeItemInfo } from "../store/Babytube";
import { UserModule } from "../store/UserStore";
import { ParentSetupModule } from "@/store/ParentSetup";
import { isIOS } from "@/Util/Platform";

//https://blog.addpipe.com/10-advanced-features-in-html5-video-player/

//http://www.imestudy.co.kr:8080/package/product/babytube/movie/1_02%20Song%20Play720P.mp4
//const pathroot = "http://www.imestudy.co.kr:8080/package/product/babytube";

interface FilterData {
  filter: string;
  id: number;
}
@Component({
  components: {
    BabytubeListItem,
    VideoView,
  },
})
export default class BabyTubePlayer extends Vue {
  // 동영상 목록을 리스팅하기위한 필터 정보
  @Prop() private filterData!: FilterData;

  $refs: {
    video: HTMLVideoElement;
    playList: HTMLDivElement;
  };
  private mIsVisible = false;
  private mFullscreen: boolean;
  private mCurrentItem: BabyTubeItemInfo | null = null;
  private mPlayStartT: number;

  get currentPlayInfo(): BabyTubeItemInfo | null {
    if (BabyTubeModule.currentItemData == null) {
      return {
        idx: -1,
        bookID: 0,
        subject: "",
        category: "",
        titleColor: "",
        thumb: "",
        mp4: "",
        movie: "",
        favoriteFlag: false,
        selected: false,
      };
    }
    return BabyTubeModule.currentItemData;
  }
  get playlist(): Array<BabyTubeItemInfo> {
    console.log("+>", BabyTubeModule.tubeItemList);
    return BabyTubeModule.tubeItemList;
  }

  //-----------------------------------------

  constructor() {
    super();
    this.mFullscreen = false;
  }

  async mounted() {
    // 서버에 해당 필터로 질의한다.
    const userIDX = 1;
    // console.error(this.filterData.filter)
    await BabyTubeModule.requestItemList({
      filter: this.filterData.filter,
      bookID: this.filterData.id,
    });
    BabyTubeModule.selectItem(BabyTubeModule.tubeItemList[0]);
    // this.$refs.video.play();

    this.mPlayStartT = Date.now();
  }

  async destroyed() {
    const t = Math.floor((Date.now() - this.mPlayStartT) / 1000);
    console.log("TUBE end", (Date.now() - this.mPlayStartT) / 1000);
    await ParentSetupModule.updatePlayTime(t);
  }

  private getBabyTubeIMG() {
    if (this.filterData.filter == "bookID") {
      if (this.filterData.id < 2001) {
        return `img/babytube/header_step1.png`;
      } else {
        return `img/babytube/header_step2.png`;
      }
    } else {
      return `img/babytube/header_${this.filterData.filter}.png`;
    }
  }

  //현재 비디오의 플레이가 종료되었음.
  private async _onVideoPlayEnd() {
    console.log(BabyTubeModule.currentItemData);
    if (BabyTubeModule.currentItemData.idx != -1) {
      BabyTubeModule.finish({ itemData: BabyTubeModule.currentItemData });
    }
    // const flag = await BabyTubeModule.selectNext();
    // console.warn("flag", flag);
    // if (flag) {
    //   this.$refs.video.play();
    // } else {
    //   this.$refs.video.pause;
    // }
  }

  private _onSelectVideo(itemInfo: BabyTubeItemInfo) {
    // https://greensock.com/forums/topic/8053-scrolltop-in-greensock/
    BabyTubeModule.selectItem(itemInfo);
    this.startVideo();
    // this.$refs.video.play();
  }

  startVideo() {
    this.mIsVisible = !this.mIsVisible;
  }

  private _onToggleFavorite(itemInfo: BabyTubeItemInfo) {
    console.log("onToggleFavorite ->", itemInfo);
    if (itemInfo) {
      BabyTubeModule.toggleFavorite({
        itemData: itemInfo,
      });
    }
  }

  private _close() {
    this.$emit("onClose");
  }
}
</script>
