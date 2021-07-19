<template>
  <div class="report">
    <button class="close" @click="showGameList">X</button>
    <button class="left" v-if="mLeftButton" @click="_leftClick">
      <span />
    </button>
    <button class="right" v-if="mRightButton" @click="_rightClick">
      <span />
    </button>
    <div class="pageContainer">
      <div class="movePage" ref="movePage">
        <div class="page"><ReportSummary /></div>
        <div class="page"><ReportSB /></div>
        <div class="page"><ReportAL /></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.report {
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  padding: 2rem;
  box-sizing: border-box;
  background: white;
  .pageContainer {
    padding: 0 1rem;
    overflow: hidden;
    height: 90vh;
    border: 1px black solid;
    .movePage {
      width: 1300vw;
      .page {
        float: left;
        width: calc(270vw / 3);
        height: 80vh;
        margin-right: 10vw;
      }
    }
  }

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 5rem;
    border: 1px black solid;
    background: white;
    cursor: pointer;
    z-index: 100;
  }
  .left {
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 2rem;
    width: 4rem;
    height: 13.5rem;
    transform: translate(-50%, -50%);
    border-right: 3px gray solid;
    z-index: 100;
    cursor: pointer;
    ::before {
      content: "";
      display: block;
      width: 8rem;
      height: 8rem;
      transform-origin: center;
      transform: rotate(-45deg) skew(-20deg, -20deg);
      border: 3px gray solid;
      background: pink;
    }
  }
  .right {
    overflow: hidden;
    position: fixed;
    top: 50%;
    right: -2rem;
    width: 4rem;
    height: 13.5rem;
    transform: translate(-50%, -50%) rotate(180deg);
    border-right: 3px gray solid;
    z-index: 100;
    cursor: pointer;
    ::before {
      content: "";
      display: block;
      width: 8rem;
      height: 8rem;
      transform-origin: center;
      transform: rotate(-45deg) skew(-20deg, -20deg);
      border: 3px gray solid;
      background: pink;
    }
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ReportSummary from "@/pages/ParentSetup/report/ReportSummary.vue";
import ReportSB from "@/pages/ParentSetup/report/ReportSB.vue";
import ReportAL from "@/pages/ParentSetup/report/ReportAL.vue";

import gsap from "gsap";
import Util from "@/Util";

@Component({
  components: {
    ReportSummary,
    ReportSB,
    ReportAL,
  },
})
export default class Report extends Vue {
  private test = "";
  private testNum = 0;
  private mLeftButton = false;
  private mRightButton = true;
  private mBackUpX = 0;

  private mPageList = [
    { label: "page1", src: `${Util.Config.packageURL}` },
    { label: "page2", src: ".png" },
    { label: "page3", src: ".png" },
  ];
  mounted() {
    this.test = this.mPageList[this.testNum].label;
    console.log(`REPORT!!!`);
  }
  showGameList() {
    this.$emit("showGameList");
  }
  _rightClick() {
    // this.test = this.mPageList[this.testNum+= 1].label;
    if (this.mBackUpX == -(window.innerWidth * (this.mPageList.length - 2))) {
      this.mLeftButton = true;
      this.mRightButton = false;
    } else {
      this.mLeftButton = true;
      this.mRightButton = true;
    }
    this.mBackUpX -= window.innerWidth;
    gsap.to(this.$refs.movePage, { x: this.mBackUpX, duration: 0.5 });

    console.log(`현재X값=>${this.mBackUpX}`);
  }

  _leftClick() {
    // this.test = this.mPageList[this.testNum+= 1].label;
    if (this.mBackUpX == -window.innerWidth) {
      this.mLeftButton = false;
      this.mRightButton = true;
    } else {
      this.mLeftButton = true;
      this.mRightButton = true;
    }
    this.mBackUpX += window.innerWidth;
    gsap.to(this.$refs.movePage, { x: this.mBackUpX, duration: 0.5 });

    console.log(`현재X값=>${this.mBackUpX}`);
  }
}
</script>
