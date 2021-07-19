<template>
  <div class="Home">
    <img
      src="img/home/babytube_bg.png"
      alt=""
      style="position:absolute;width:100%;top:-4.5rem;left:0;"
    />
    <h1>홈화면 메인</h1>
    <div class="tubeShortCut" @click="_selectMenu('BabyTube')">
      <div class="holder">
        <video ref="babytube" muted autoplay playsinline loop />
      </div>
      <img class="videotitle" src="img/home/babytube_text.png" />
    </div>

    <div class="rowV">
      <StoryBook
        :bookID="this.bookID"
        :title="this.bookTitle"
        :starCount="this.startCount"
        :startActivity="this.startActivity"
        @onSelectItem="_onSelectStoryBook"
      />
      <Alphabet
        :symbol="this.alphabetSymbol"
        @onSelectItem="_onSelectAlphabetSchool"
      />
      <MyRoom @onClick="_selectMenu('MyRoom')" />
      <MyPet @onClick="_selectMenu('MyPet')" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Home {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-content: center;
  max-width: 1280px;
  max-height: 640px;
  background-color: #fff;
  h1 {
    display: none;
    width: inherit;
    color: #fff;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    text-align: center;
  }

  .tubeShortCut {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;

    margin-top: 15rem;
    padding: 0 0 1.5rem 0.62rem;

    width: 32rem;
    height: 100%;

    box-sizing: border-box;

    .holder {
      overflow: hidden;
      position: relative;

      left: 0.62rem;

      width: 32.9rem;
      height: 16rem;

      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      border-radius: 35px;
      z-index: 1;
      &::before {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;

        width: 100%;
        height: 17rem;

        border: 2px black solid;
        background: rgba(0, 0, 0, 1);
        transform: translate(-50%, -50%);
        animation: startVideo forwards 2s 1.2s;
        z-index: 1;
      }

      video {
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        width: 100%;
        z-index: 0;
      }
      @keyframes startVideo {
        0% {
          height: 100%;
        }
        20% {
          background-color: #000;
          height: 100%;
        }
        30% {
          background-color: #606060;
          height: 100%;
        }
        40% {
          background-color: #000;
          height: 100%;
        }
        50% {
          background-color: #606060;
          height: 100%;
        }
        60% {
          background-color: #000;
          height: 100%;
        }
        70% {
          height: 100%;
          border: 4px black solid;
        }
        80% {
          height: 0;
          border: 2px black solid;
        }
        100% {
          height: 0;
          border: none;
        }
      }
    }

    .videotitle {
      position: absolute;
      top: 40px;
      left: -50rem;
      z-index: 2;
      transform: translateY(-50%);
      animation: videotitle forwards 1s 2s;
    }
    @keyframes videotitle {
      from {
        left: -50rem;
      }
      to {
        left: 0.62rem;
      }
    }
  }

  .rowV {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;

    margin-top: 1.5rem;
    width: 31.5rem;
    height: 30rem;
    padding-right: 1rem;

    box-sizing: border-box;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import StoryBook from "./home/StoryBook.vue";
import Alphabet from "./home/Alphabet.vue";
import MyRoom from "./home/MyRoom.vue";
import MyPet from "./home/MyPet.vue";
import { UserModule } from "@/store/UserStore";
import { Home as HomeStore } from "@/store/Define";
import { BabyTubeModule } from "@/store/Babytube";

import { MediaPlayer, MediaPlayerFactory, MediaPlayerClass } from "dashjs";
import { SystemModule } from "@/store/System";
import Swal from "sweetalert2";
import { isIOS } from "@/Util/Platform";
import gsap from "gsap/all";

@Component({
  components: {
    StoryBook,
    Alphabet,
    MyRoom,
    MyPet,
  },
})
export default class Home extends Vue {
  private mMovieURL = "";
  private mDashPlayer: MediaPlayerClass;
  $refs: {
    babytube: HTMLVideoElement;
  };

  get homeData(): HomeStore.HomeData {
    return UserModule.homeData;
  }
  get bookID(): number {
    if (UserModule.homeData == null) return 2004;
    return UserModule.homeData.storybookInfo.bookID;
  }
  get bookTitle(): string {
    if (UserModule.homeData == null) return "";
    return UserModule.homeData.storybookInfo.bookTitle;
  }
  get alphabetSymbol(): string {
    if (UserModule.homeData == null) return "a";
    return UserModule.homeData.alphabetInfo.symbol;
  }
  get startCount() {
    if (SystemModule.isDemoMode == true) return 3;
    if (this.homeData === null) return 0;
    if (this.homeData.storybookInfo.cpltAcvtCnt < 2) return 0;
    else if (this.homeData.storybookInfo.cpltAcvtCnt < 5) return 1;
    else if (this.homeData.storybookInfo.cpltAcvtCnt < 7) return 2;
    else if (this.homeData.storybookInfo.cpltAcvtCnt == 7) return 3;
    return 0;
  }
  get startActivity(): string {
    if (this.homeData === null) return "movie";
    return this.homeData.storybookInfo.currentAcvt;
  }
  @Watch("homeData")
  onChageHomeData(changed, old) {
    //
    // console.log("CHANGED HOMEDATA");
  }
  async mounted() {
    await UserModule.getHomeData();

    if (BabyTubeModule.tubeItemList.length == 0) {
      await BabyTubeModule.requestItemList({ filter: "bs" });
    }

    if (isIOS()) {
      // alert(`IOS`)
      const rand = Math.floor(
        Math.random() * BabyTubeModule.tubeItemList.length
      );
      const url = BabyTubeModule.tubeItemList[rand].movie;
      this.$refs.babytube.src = url;
      // this.$refs.babytube.src = "https://contents.arambookclub.com/contents/babytube/movie/1002_song_play720p.mp4";
    } else {
      // alert(`Not IOS`)
      this.mDashPlayer = MediaPlayer().create();
      const rand = Math.floor(
        Math.random() * BabyTubeModule.tubeItemList.length
      );
      const url = BabyTubeModule.tubeItemList[rand].movie;
      // const url = "https://contents.arambookclub.com/contents/babytube/movie/1002_song_play720p/1002_song_play720p.mpd";
      this.mDashPlayer.initialize(this.$refs.babytube, url, true);
      this.mDashPlayer.attachView(this.$refs.babytube);
      this.mDashPlayer.setAutoPlay(true);
      this.mDashPlayer.attachSource(url);
      this.mDashPlayer.on("canPlay", () => {
        this.$refs.babytube.play();
      });
    }

    // console.warn( BabyTubeModule.tubeItemList[rand].movie );

    // this.mMovieURL = ;
    // return "http://www.imestudy.co.kr:8080/package/product/babytube/movie/2016_im_going_to_grandmas_house_bed720p.mp4"
  }

  _onSelectMyPet() {
    console.log("selectMyPet");
    this.$emit("onShowMyPet");
  }

  playSnd(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (window["clickSnd"]) {
        window["clickSnd"].play();
        gsap.delayedCall(1, () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  async _selectMenu(menuLabel: string) {
    await this.playSnd();
    if (SystemModule.isDemoMode == true) {
      Swal.fire({
        // icon: 'error',
        // title: 'GameBase getResource',
        text: `체험판에서는 사용할 수 없습니다.`,
      });
      return;
    }
    this.$emit("onSelectHomeMenu", menuLabel);
  }

  _onSelectStoryBook(bookID: string, startActivity: string) {
    console.log("onShowStoryBook", bookID, startActivity);
    this.$emit("onShowStoryBook", bookID, startActivity);
  }
  _onSelectAlphabetSchool(symbol: string) {
    console.log("_onSelectAlphabetSchool", symbol);
    this.$emit("onShowAlphabetSchool", symbol);
  }
}
</script>
