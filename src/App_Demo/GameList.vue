<template>
  <div class="ActivityTestModal" @click="_selectLevel">

  <div id="hideBox">
    <div v-html="mlevelGuide" @click="_clickLevel(levelList[mLevel-1])" class="topBTN" style="left:0; right:auto;" />
    <div id="reportButton" class="topBTN" @click="showReport">활동 리포트</div>
  </div>    
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
        <button class="close" @click="_hideGame"></button>
        <video ref="babyTubeVideo" playsinline controls ></video>
      
      </div>
    </div>

    <div class="wrapBG">
      <div class="dimmed" v-if="mShowLevelBox">
        <div id="levelBox" class="levelBox" ref="levelBox">
          <p>연령 선택 (난이도)</p>
          <div class="labelBox">
            <label v-for="(v, i) in levelList" :key="i" :value="v.level">
              <input type="radio" name="level" @click="_clickLevel(v)" />
              {{ v.guide }}
            </label>
          </div>
        </div>
      </div>

      <h1 class="title" ref="bookCover">StoryBooks 책 표지</h1>
      <div class="displayBox">
        <DragPanel :data="bookCover" @onClickItem="_clickBookCover" />
      </div>

      <h1 class="title">
        StoryBooks Activities <span>(각 책에 해당하는 액티비티)</span>
      </h1>
      <div class="displayBox">
        <DragPanel :data="storyBook" @onClickItem="_clickStoryBook" />
      </div>

      <h1 class="title">BabyTube 영상</h1>
      <div class="displayBox">
        <DragPanel :data="babyTube" @onClickItem="_clickBabyTube" />
      </div>

      <h1 class="title">
        Alphabet School
        <span>(A만 탑재)</span>
        <select name="alphabet" v-model="mAlphabet" class="selectLevel">
          <option v-for="(v, i) in ABC" :key="i" :value="v">{{
            v.toUpperCase()
          }}</option>
        </select>
        <p class="selectLevel">{{ mAlphabet.toUpperCase() }} 선택</p>
      </h1>

      <div class="displayBox">
        <DragPanel :data="alphabet" @onClickItem="_clickAlphabet" />
      </div>
    </div>

    
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.ActivityTestModal {
  overflow: scroll;
  box-sizing: border-box;
}
@media (min-width: 784px) {
.ActivityTestModal {
  overflow: hidden;
  position: relative;
  top: 0;
  width: 100%;
  padding:1rem 0 ;
  background: #FFF;
  box-sizing: border-box;
  .player {
    position: fixed;
    z-index: 1000;
    display:flex;
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
      margin:auto;
      background-color: black;
      z-index: 1500;
      > video {
        width: 100%;
      }
      .close{
            position:fixed;
            top:1rem;
            right:1rem;
            width:2.5rem;
            height:2.5rem;
            border-radius: 2rem;
            background:white;
            cursor:pointer;
            z-index:2000;
            &:before{
                content:"";
                display:block;
                position:absolute;
                top:50%;
                left:50%;
                width:0.2rem; 
                height:2rem;
                background:black;
                transform: translate(-50%,-50%) rotate(45deg);
            }
            &:after{
                content:"";
                display:block;
                position:absolute;
                top:50%;
                left:50%;
                width:0.2rem;
                height:2rem;
                background:black;
                transform: translate(-50%,-50%) rotate(-45deg);
            }
        }
    }
  }
}
#hideBox{
  overflow: hidden;
  position:relative;
  top:0;
  left:50%;
  width:80%;
  height:3rem;
  transform:translateX(-50%);
  .topBTN {
    position: absolute;
    overflow:hidden;
    width: 30%;
    top:1rem;
    left:auto;
    right:0;
    color: black;
    text-align: center;
    font-weight: bold;
    border:2px rgba(0,0,0,0.4) solid;
    color:darkblue;
    border-radius: 1rem;
    z-index: 100;
    cursor: pointer;
  }
}


.wrapBG {
  position: relative;
  padding: 4rem 3rem 1rem;
  .dimmed {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    .levelBox {
      padding:0 0 5rem;
      margin: 10rem auto;
      width: 40rem;
      /* height: 25rem; */
      background-color: skyblue;
      p {
        display: block;
        padding:1rem 0;
        font-size:1.2rem;
        font-weight:500;
        text-align: center;
        box-sizing:border-box;
      }
      .labelBox {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        label {
          display:block;
          position: relative;
          width:10rem;
          height:10rem;
          line-height:5rem;
          font-size:1.5rem;
          text-align: center;
          box-sizing: border-box;
          background-color: white;
          box-shadow: 0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.2);
          input {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            margin-left: -0.5rem;
            width: 1rem;
            height: 1rem;
          }
        }
      }
    }
  }
  .title {
    float: left;
    display: block;
    padding: 0.8rem 2rem;
    margin: 0;
    width: 100%;
    background:rgba(255,255,255,0.1);
    color: darkblue;
    font-weight: bold;
    text-align: left;
    box-sizing:border-box;
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
  .displayBox {
    overflow: hidden;
    overflow-x: scroll;
    position: relative;
    padding: 0;
    height: 8rem;
    box-sizing: border-box;
    border: 1px black solid;
    .viewBox {
      padding: 1rem 0;
      margin: 0;
      height: 6rem;
    }
  }
}
}

@media (max-width: 783px) {
  .ActivityTestModal{
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    padding:5rem 0 2rem;
    background: #FFF;
    border:1px red solid;
    box-sizing: border-box;
   .player {
    position: fixed;
    z-index: 1000;
    display:flex;
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
      margin:auto;
      background-color: black;
      z-index: 1500;
      > video {
        width: 100%;
      }
      .close{
            position:fixed;
            top:1rem;
            right:1rem;
            width:2.5rem;
            height:2.5rem;
            border-radius: 2rem;
            background:white;
            cursor:pointer;
            z-index:2000;
            &:before{
                content:"";
                display:block;
                position:absolute;
                top:50%;
                left:50%;
                width:0.2rem; 
                height:2rem;
                background:black;
                transform: translate(-50%,-50%) rotate(45deg);
            }
            &:after{
                content:"";
                display:block;
                position:absolute;
                top:50%;
                left:50%;
                width:0.2rem;
                height:2rem;
                background:black;
                transform: translate(-50%,-50%) rotate(-45deg);
            }
        }
    }
  }
}
#hideBox{
  position: absolute;
  top:0;
  left:50%;
  width:80%;
  transform:translateX(-50%);
  #reportButton{
      top:4rem; 
  }
  .topBTN {
    position: absolute;
    overflow:hidden;
    width: 100%;
    top:2rem;
    left:auto;
    right:0;
    color: black;
    text-align: center;
    font-weight: bold;
    border-bottom:2px rgba(0,0,0,0.4) solid;
    color:darkblue;
    border-radius: 0;
    z-index: 1;
    cursor: pointer;
  }
}

.wrapBG {
  position: relative;
  padding: 0 0 1rem;
  .dimmed {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    .levelBox {
      padding:0 0 5rem;
      margin: 10rem auto;
      width: 20rem;
      /* height: 25rem; */
      background-color: skyblue;
      p {
        display: block;
        padding:1rem 0;
        font-size:1.2rem;
        font-weight:500;
        text-align: center;
        box-sizing:border-box;
      }
      .labelBox {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        label {
          display:block;
          position: relative;
          width:5rem;
          height:5rem;
          line-height:3rem;
          font-size:1rem;
          text-align: center;
          box-sizing: border-box;
          background-color: white;
          box-shadow: 0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.2);
          input {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            margin-left: -0.4rem;
            width: 0.8rem;
            height: 0.8rem;
          }
        }
      }
    }
  }
  .title {
    float: left;
    display: block;
    padding: 0.8rem 2rem;
    margin: 0;
    width: 100%;
    background:rgba(255,255,255,0.1);
    color: darkgreen;
    font-weight: bold;
    text-align: center;
    box-sizing:border-box;
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
  .displayBox {
    overflow: hidden;
    overflow-x: scroll;
    position: relative;
    padding: 0;
    height: 8rem;
    box-sizing: border-box;
    border: 1px black solid;
    .viewBox {
      padding: 1rem 0;
      margin: 0;
      height: 6rem;
    }
  }
}
}
</style>

<script lang = "ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { App } from "@/Activity/Core";
import gsap from "gsap";
import PIXISound from "pixi-sound";
import DragPanel from "@/App_Demo/DragPanel.vue";
import Report from "@/App_Demo/Report.vue";

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
    DragPanel,
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

  private mDisplayWidth = this.$refs.displayBoxWidth as HTMLDivElement;

  private mXPos = 0;

  private ABC = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  private levelList = [
    { guide: "level 1 ", level: 1 },
    { guide: "level 2 ", level: 2 },
    { guide: "level 3 ", level: 3 }
  ];

  $refs: {
    selectBookID: HTMLDivElement;
    bookCover: HTMLDivElement;
    bookActivity: HTMLDivElement;
    alphabet: HTMLDivElement;
    levelBox: HTMLDivElement;
    displayBoxWidth: HTMLDivElement;
    babyTubeVideo: HTMLVideoElement;
  };

  async mounted() {
    if(this.mlevelGuide==""){this.mShowLevelBox=true}
    else{this.mShowLevelBox=false}
    document.body.setAttribute('style','overflow: hidden;')
    PIXISound.stopAll();
    this.mXPos = 0;
    await BabyTubeModule.requestItemList({ filter: "bookID", bookID: 2004 });

    this.mDisplayWidth = this.$refs.displayBoxWidth as HTMLDivElement;

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
    for (const bID of Util.Config.bookList.step1) {
      result.push({
        category: "" + bID,
        thumb: `${Util.Config.packageURL}/bookcover/${bID}_cover.png`,
        label: ""
      });
    }
    for (const bID of Util.Config.bookList.step2) {
      result.push({
        category: "" + bID,
        thumb: `${Util.Config.packageURL}/bookcover/${bID}_cover.png`,
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
        thumb: `${
          Util.Config.packageURL
        }/cover/story_${story.toLowerCase()}.png`,
        label: "" + label
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
        thumb: `${Util.Config.packageURL}/bookcover/${info.bookID}_cover.png`,
        label: this.getLabel(info.category) ,
        movieURL: info.movie,
        bookID: info.bookID
      });
    }
    return result;
  }

  private async _clickBookCover(i, e) {
    if (this.mLevel === 0) {
      return;
    }
    console.log("_clickBookCover", i, e);

    if (typeof e.category == "string") {
      this.mBookID = parseInt(e.category);
    } else {
      this.mBookID = e.category;
    }
    console.log(`LABEL: [${e.label}] , 책번호 : [${this.mBookID}]`);
    await BabyTubeModule.requestItemList({
      filter: "bookID",
      bookID: this.mBookID
    });

    // this.$refs.bookCoverID.style.cssText = "backgroundColor: black; color:white"
    // this.$refs.bookID.setAttribute("style","backgroundColor: black; color:white")
    // this.$refs.selectBookID[i].style.backgroundColor= "#000000";
    // this.$refs.selectBookID[i].style.color= "#ffffff";
  }

  private async _clickBabyTube(i, e) {
    if (this.mLevel === 0) {
      return;
    }
    if (this.mBookID === 0) {
      alert(`책표지를 선택해 주세요 !`);
      window.scrollTo(0, 0);
      return;
    }
    console.log("_clickBookCover", i, e, this.mBookID);

    this.mVideoSRC = e.movieURL;
        
    console.log(`%c video`,"background:yellow;font-weight:bold;",` : [${this.mVideoSRC}]`);
    console.log(`%c book`,"background: yellow;font-weight:bold;",` : [${this.mBookID}]`);
    gsap.delayedCall(0.5, () => {   
      this.mShowVideo = true;    
      this.mDashPlayer.attachSource(this.mVideoSRC);
      this.$refs.babyTubeVideo.currentTime=0;
      this.$refs.babyTubeVideo.pause();
    });
    document.body.setAttribute("style", "overflow:hidden");
  }

  private _clickStoryBook(i, e) {
    if (this.mLevel === 0) {  return;  }
    this.mCategory = "storybooks";
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
      gsap.delayedCall(0.5, () => {
        this._showGame();
      });
    }
  }

  private _clickAlphabet(i, e) {
    if (this.mLevel === 0) {
      return;
    }
    this.mCategory = "alphabet";
    this.mAlphabetCategory = e.category;
    console.log(`카테고리: [${this.mAlphabetCategory}]`);
    // this._goFullScreen();
    gsap.delayedCall(0.5, () => {
      this._showGame();
    });
  }

  private _clickLevel(e) {
    this.mLevel = e.level;
    console.log(`레벨은 ${this.mLevel}을 선택했습니다.`);
    this.mlevelGuide = `${e.guide}을 선택했습니다.`;
    this.mShowLevelBox = !this.mShowLevelBox;
    if(this.mShowLevelBox==true){document.body.setAttribute('style','overflow: hidden;')}
    else{document.body.setAttribute('style','overflow: auto;')}
  }

  private _selectLevel() {
    if (this.mShowLevelBox == false && this.mLevel == 0) {
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
      this.mShowGame = false;
      if( App.Handle.forceExit() !==undefined) App.Handle.forceExit();
      }
    if (this.mShowVideo) {
      this.mShowVideo = false;
      this.$refs.babyTubeVideo.currentTime=0;
      this.$refs.babyTubeVideo.pause();
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