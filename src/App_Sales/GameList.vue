<template>
  <div class="ActivityTestModal" >
    <div class="player" v-if="mShowGame">
      <div>
        <!-- <ActivityPlayer :category="mCategory" :alphabet="'a'" :level="mLevel" :bookID="mBookID" :isMobileMode="false" :activityAL="mAlphabetCategory" :activitySB="mStoryCategory"></ActivityPlayer> -->
        <ActivityPlayer
          :category="mCategory"
          :alphabet="mAlphabet"
          :level="mLevel"
          :bookID="mBookID"
          :isMobileMode="false"
          :activityAL="mAlphabetCategory"
          :activitySB="mStoryCategory"
          :isSaleKit="true"
        ></ActivityPlayer>
        <button class="close" @click="_hideGame"></button>
      </div>
    </div>

    <div class="player" v-show="mShowVideo">
      <div>
        <button class="close" @click="_hideGame">X</button>
        <video ref="babyTubeVideo" style="width:100%;" />
      </div>
    </div>

    <div class="wrapBG">
      <div class="dimmed" v-if="mShowLevelBox">
        <div id="levelBox" class="levelBox" ref="levelBox">
          <p><img src="salesKit/level_title.png" alt="" >  </p>
          <div class="selectBox" >
            <div class="valueLevel" v-for="(v, i) in levelList" :key="i" :value="v.level" @click="_clickLevel(v)">
              <img :src="`salesKit/level${i+1}.png`" alt="" >
            </div>
          </div>
        </div>
      </div>

        <h1 class="title" ref="bookCover"><img src="salesKit/book.png" alt="" ></h1>
      <div class="displayBox" id="book" ref="book">
          <BookPanel :data="bookCover" @onClickItem="_clickBookCover" />
          <img src="saleskit/line.png" alt="" > 
      </div>

        <h1 class="title"><img src="salesKit/title01.png" alt="" ></h1>
      <div class="displayBox" id="babytube">
          <BabytubePanel :data="babyTube" @onClickItem="_clickBabyTube" />
      </div>


        <h1 class="title"><img src="salesKit/title02.png" alt="" ></h1>
      <div class="displayBox"  >
          <StoryPanel :data="storyBook" @onClickItem="_clickStoryBook" />
      </div>

        <h1 class="title"><img src="salesKit/title03.png" alt="" ></h1>
      <div class="displayBox"  >
          <AlphabetPanel :data="alphabet" @onClickItem="_clickAlphabet" />
      </div>
    </div>

    <div class="buttonBox">
      <div class="levelButton" ref="levelButton" v-html="this.mlevelGuide" @click="_selectLevel" />
      <div class="reportButton" @click="showReport">
        <img src="salesKit/report.png" alt="" >
      </div>
    </div> 


  </div>
</template>

<style lang="scss" scoped>
.ActivityTestModal {
  overflow: auto;
  position: relative;
  top: 0;
  padding: 1rem;
  width: 100%;
  max-width: 1280px;
  height: 100vh;
  background: white;
  box-sizing: border-box;
  .player {
    display:flex;
    justify-content: center;
    align-items: center;
    
    position: fixed;
    z-index: 1000;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    div {
      overflow: hidden;
      position: relative;
      width: 100%;
      height: auto;
      background-color: black;
      z-index: 1500;
      .close{
            position:fixed;
            top:30px;
            right:30px;
            width:60px;
            height:60px;
            border-radius: 60px;
            background:white;
            cursor:pointer;
            z-index:2000;
            &:before{
                content:"";
                display:block;
                position:absolute;
                top:50%;
                left:50%;
                width:4px; 
                height:30px;
                background:black;
                transform: translate(-50%,-50%) rotate(45deg);
            }
            &:after{
                content:"";
                display:block;
                position:absolute;
                top:50%;
                left:50%;
                width:4px; 
                height:30px;
                background:black;
                transform: translate(-50%,-50%) rotate(-45deg);
            }
        }
    }
  }
}

.wrapBG {
  position: relative;
  padding: 0 0 1rem;
  .dimmed {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    .levelBox {
      overflow: hidden;
      margin: 0 auto;
      > p {
        display: block;
        width: 100%;
        >img{
          width:60%;
          margin:5% 20% 50px;
        }
      }
      .selectBox {
        overflow:hidden;
        .valueLevel {
          float:left;
          position:relative;
          width:calc(100% /3);
          box-sizing:border-box;
          cursor:pointer;
          >img{
            width:80%;
            margin:0 10%;
          }
        }
      }
    }
  }
  
  .selectLevel {
    float: right;
    margin: 0 0 0 1rem;
    padding: 0;
    width: 5rem;
    height: 2rem;
    line-height: 2rem;
    > select {
      line-height: 3rem;
    }
  }
  .title {
    &:first-child{
      width:10rem;
      margin: 1rem auto 2rem;
    }
    float: left;
    display: block;
    margin: 1rem auto 2rem;
    width:12rem;
  }
  #book{
      padding:0;
      height:12rem;
      >img{
        position:absolute;
        left:0;
        bottom:0;
        max-width:1200px;
        height:1px;
    }
  }
  #babytube{
    height:8rem;
  }
  .displayBox {
    overflow: hidden;
    overflow-x: scroll;
    position: relative;
    padding-left:1rem;
    width: 100%;
    max-width:1280px;
    height:10rem;
    box-sizing: border-box;
    text-align: center;
    &:last-child{
      margin-bottom:5rem;
    }
  }
}

.buttonBox{
  position: absolute;
  top:1rem;
  right:1rem;
  z-index: 1;
  .levelButton{
    float:left;
    padding:12px ;
    margin-right:20px;
    background-color:#56c29b;
    cursor: pointer;
    text-align:center;
    color:#FFFFFF;
    border-radius:5rem;
  }
  .reportButton {
    float:left;
    width:10rem;
    min-width: 100px;
    cursor: pointer;
  }

  
}


img{width:100%;}
::-webkit-scrollbar {
  display: none;
}

@media (min-width: 1400px){
  #book{
    height:20rem;
  }
}
</style>

<script lang = "ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { App } from "@/Activity/Core";
import gsap from "gsap";
import PIXISound from "pixi-sound";
import * as PIXI from "pixi.js"
import BookPanel from "@/App_Sales/bookcoverPanel .vue";
import BabytubePanel from "@/App_Sales/babytubePanel.vue";
import AlphabetPanel from "@/App_Sales/alphabetPanel.vue";
import StoryPanel from "@/App_Sales/storyPanel.vue";
import Report from "@/App_Sales/Report.vue";

import ActivityPlayer from "@/player/ActivityPlayer.vue";
import BabyTubePlayer from "@/player/BabyTubePlayer.vue";

import { GestureManager } from "@/Util/GestureManager";
import Util from "@/Util";
import { BabyTubeModule } from "@/store/Babytube";
import { MediaPlayer, MediaPlayerClass } from "dashjs";
// import {DemoData} from '@/store/App_Demo_Store'

@Component({
  components: {
    ActivityPlayer,
    BookPanel,
    BabytubePanel,
    AlphabetPanel,
    StoryPanel,

    BabyTubePlayer,
    Report
  }
})
export default class GameList extends Vue {
  private mCategory = "";
  private mAlphabet = "A";
  private mAlphabetCategory = "";
  private mLevel = 0;

  private mStoryCategory = "";
  private mBookID = 1001;

  private mShowGame = false;
  private mShowVideo = false;

  private mShowLevelBox = true;
  private mlevelGuide = "";

  private mDashPlayer: MediaPlayerClass;
  private mVideoSRC = "";


  private mXPos = 0;

  private ABC = ["a","b","c","d","e","f","g","h","i","j","k","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  private levelList = [
    { guide: "Level 1 ", subGuide:"0~24개월 권장", level: 1 },
    { guide: "Level 2 ", subGuide:"24~48개월 권장", level: 2 },
    { guide: "Level 3 ", subGuide:"48개월 이상 권장", level: 3 }
  ];

  $refs: {
    selectBookID: HTMLDivElement;
    bookCover: HTMLDivElement;
    bookActivity: HTMLDivElement;
    alphabet: HTMLDivElement;
    levelBox: HTMLDivElement;
    babyTubeVideo: HTMLVideoElement;
    book: HTMLDivElement;
    levelButton: HTMLDivElement;
  };

async mounted() {
    gsap.to(this.$refs.book,{height:innerWidth*0.22,duration:0.5})
    
    window.addEventListener('resize',()=>{ 
      gsap.to(this.$refs.book,{height:innerWidth*0.22,duration:0.5}) 
      })

    PIXISound.stopAll();
    this.mXPos = 0;
    await BabyTubeModule.requestItemList({ filter: "bookID", bookID: 1001 });

    const video: HTMLVideoElement = this.$refs.babyTubeVideo as HTMLVideoElement;
    this.mDashPlayer = MediaPlayer().create();
    this.mDashPlayer.initialize(video, null, true);
  }

  getLabel(label: string) {
    switch (label) {
      case "BEDTIME STORY":
        return "BedTime Story";
      case "PLAYTIME STORY":
        return "PlayTime Story";
      case "PLAYTIME SONG":
        return "PlayTime Song";
      case "SOLO VERSION SONG":
        return "Solo Song";
      case "INSTRUMENTAL VERSION SONG":
        return "Mew";
      case "DADDY VERSION STORY":
        return "Daddy Story";
      default:
        "--";
    }
  }

  get bookCover() {
    const result = [];
    const bID = [1001,1019,2004]    
      for (let i =0; i<bID.length; i++ ) {
        result.push({
          category: "" + bID[i],
          thumb: `${Util.Config.packageURL}/bookcover/${bID[i]}_cover.png`,
          label: ""
        });
      }
    return result;
  }

  get storyBook() {
    const result = [];
    for (let i = 0; i < Util.Config.storyBookList.category.length; i++) {
      const story = Util.Config.storyBookList.category[i];
      const label = Util.Config.storyBookList.label[i];

      result.push({
        category: "" + story,
      });
    }
    return result;
  }

  get alphabet() {
    const result = [];
    for (let i = 0; i < Util.Config.alphabetList.category.length; i++) {
      const category = Util.Config.alphabetList.category[i];
      const label = Util.Config.alphabetList.label[i];

      result.push({
        category: "" + category,
        thumb: `${
          Util.Config.packageURL
        }/cover/title_${category.toLowerCase()}.png`,
        label: "" + label
      });
    }
    return result;
  }

  get babyTube() {
    const result = [];
    for (const info of BabyTubeModule.tubeItemList) {
      result.push({
        category: "",
        label: this.getLabel(info.category) ,
        movieURL: info.movie,
        bookID: info.bookID
      });
    }
    return result;
  }

  private async _clickBookCover(e) {
    if (this.mLevel === 0) { return; }
    if (typeof e.category == "string") { this.mBookID = parseInt(e.category);
    }else{ this.mBookID = e.category; }
    console.log(`LABEL: [${e.label}] , 책번호 : [${this.mBookID}]`);
    await BabyTubeModule.requestItemList({
      filter: "bookID",
      bookID: this.mBookID
    });
  }

  private async _clickBabyTube(e) {
    if (this.mLevel === 0) {
      return;
    }
    if (this.mBookID === 0) {
      alert(`책표지를 선택해 주세요 !`);
      window.scrollTo(0, 0);
      gsap.to(this.$refs.bookCover, { color: "red", duration: 0.3 }).repeat(1).yoyo(true);
      return;
    }
    console.log("_clickBookCover", e, this.mBookID);

    this.mVideoSRC = e.movieURL;

    console.log(`%c video`,"background:yellow;font-weight:bold;",` : [${this.mVideoSRC}]`);
    console.log(`%c book`,"background: yellow;font-weight:bold;",` : [${this.mBookID}]`);
    //쇼 하이드
    gsap.delayedCall(0.5, () => {   
      this.mShowVideo = true;
      this.mDashPlayer.attachSource(this.mVideoSRC);
      this.$refs.babyTubeVideo.currentTime=0;
      this.$refs.babyTubeVideo.pause();
    });
    document.body.setAttribute("style", "overflow:hidden");
  }

  private _clickStoryBook(e) {
    if (this.mLevel === 0) {  return;  }
    this.mCategory = "storybooks";
    console.log(e)
    this.mStoryCategory = e.category;
    console.log(
      `책번호: [${this.mBookID}] , 카테고리: [${this.mStoryCategory}]`
    );
    if (this.mBookID == 0) {
      alert(`책표지를 선택해 주세요 !`);
      window.scrollTo(0, 0);
      gsap
        .to(this.$refs.bookCover, { color: "red", duration: 0.3 })
        .repeat(3)
        .yoyo(true);
    } else {
        this._showGame();
    }
  }

  private _clickAlphabet(e) {
    if (this.mLevel === 0) {
      return;
    }
    this.mCategory = "alphabet";
    this.mAlphabetCategory = e.category;
    this._showGame();
  }

  private _clickLevel(e) {
    this.mLevel = e.level;
    this.mlevelGuide = `${e.guide}`;
    gsap.delayedCall(0.3, () => {
      this.mShowLevelBox = false;
      const levelButton = this.$refs.levelButton as HTMLDivElement;
      gsap.from(levelButton ,{marginTop:-30,duration:0.5,ease:"bounce"})
    });
  }

  private _selectLevel() {
    if (this.mShowLevelBox == false) {
      this.mShowLevelBox = true;
    }
  }

  private _showGame() {
    // console.error(document.body)
    this.mShowGame = true;
    document.body.setAttribute("style", "overflow:hidden");
  }

  private _hideGame() {
    gsap.globalTimeline.clear();
    PIXISound.stopAll();

    if (this.mShowGame) {
      gsap.globalTimeline.clear();
      PIXISound.stopAll();
      App.Handle.forceExit();
      this.mShowGame = false;
    }
    if (this.mShowVideo) {
      this.$refs.babyTubeVideo.currentTime=0;
      this.$refs.babyTubeVideo.pause();
        this.mShowVideo = false;
      }

    document.body.setAttribute("style", "overflow:normal");
  }

  _selectAlphabet(e: string) {
    this.mAlphabet = e.toUpperCase();
    console.error(this.mAlphabet);
    return this.mAlphabet;
  }
 
  showReport() {
    if (this.mLevel !== 0) {
      console.log(`REPORT`);
      this.$emit("showReport");
    }
  }
}
</script>