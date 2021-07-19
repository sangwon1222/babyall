<template>
  <div
    v-if="mShowFlag && !showRestartPopupFlag"
    class="dimmed"
    @click="_onClose()"
  >
    <div class="popup-body">
      <div class="head">
        <div class="stat">
          <div class="row">
            <div class="title">이름</div>
            <div class="text">{{ name }}</div>
          </div>
          <div class="row">
            <div class="title">레벨</div>
            <div class="text">{{ level }}</div>
          </div>
          <div class="row">
            <div class="title">완독도서</div>
            <div class="text">{{ completeCount }}</div>
          </div>
        </div>
        <div class="profile">
          <img width="100%" :src="this.thumbURL" />
        </div>
      </div>
      <div class="inputpad">
        <div class="inputrow">
          <img src="img/lobby/img_time.png" />
          <span class="remainT" v-if="!unlimitMode">{{ remainTString }}</span>
          <span class="remainT" style="color:#CCC" v-if="unlimitMode"
            >무제한</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dimmed {
  width: 100%;
  height: 100%;
  position: absolute;
  top: -2px;
  left: -2px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 5px rgba(0, 0, 0, 0.4) solid;
  /* z-index: 2; */
  z-index: 100;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.popup-body {
  display: flex;
  flex-direction: column;
  position: relative;
  transform: scale(0.8);
  .remainT {
    position: absolute;
    bottom: 160px;
    font-family: "Noto sans";
    font-size: 80px;
    color: #ff2d4b;
  }
  .profile {
    overflow: hidden;
    width: 150px;
    height: 150px;
    border-radius: 20px;
    border: 5px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stat {
    // border: 1px solid #F00;
    margin-right: 20px;
    .row {
      // border: 1px solid #F00;
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
    }
    .title {
      background-color: #f0f0f0;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      width: 140px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;

      font-family: "Noto sans";
      font-size: 25px;
    }

    .text {
      background-color: #fff;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      width: 200px;
      display: flex;

      padding-left: 10px;
      justify-content: flex-start;
      align-items: center;

      font-family: "Noto sans";
      font-size: 25px;
    }
  }
  .head {
    padding-top: 50px;
    padding-bottom: 50px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: #addeff;
    width: 589px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .inputpad {
    background-color: #fff;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    padding-bottom: 20px;
    .inputrow {
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: center;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { gsap } from "gsap";
import { UserModule } from "@/store/UserStore";
import { PlayLevel } from "@/store/Define";
import { ParentSetupModule } from "@/store/ParentSetup";

@Component
export default class ActiveTimePopup extends Vue {
  private mShowFlag = false;

  private mArg1 = 1;
  private mArg2 = 1;
  private mInputNumberValue = "";

  get name() {
    if (UserModule.homeData == null) return "---";
    return UserModule.homeData.userInfo.childNm;
  }
  get level() {
    if (UserModule.homeData == null) return "--";

    if (UserModule.homeData.userInfo.lrngChoLvlCd == PlayLevel.easy)
      return "Lev.1";
    else if (UserModule.homeData.userInfo.lrngChoLvlCd == PlayLevel.normal)
      return "Lev.2";
    else if (UserModule.homeData.userInfo.lrngChoLvlCd == PlayLevel.hard)
      return "Lev.3";
    return "--";
  }
  get completeCount() {
    if (UserModule.homeData == null) return "0권";
    return `${UserModule.homeData.userInfo.cpltBookCnt}권`;
  }

  get thumbURL(): string {
    if (UserModule.homeData == null) {
      // return UserModule.userInfoJWT.childThumbnail;
      return "img/lobby/nouser.png";
    } else {
      return UserModule.homeData.userInfo.profileUrl;
    }
  }

  get showRestartPopupFlag() {
    return UserModule.remainTime <= 0;
  }

  get remainTString() {
    const hour = Math.floor(UserModule.remainTime / 3600);
    const min = Math.floor((UserModule.remainTime % 3600) / 60);
    const sec = Math.floor(UserModule.remainTime % 60);
    return `${("0" + hour).substr(-2)}:${("0" + min).substr(-2)}:${(
      "0" + sec
    ).substr(-2)}`;
  }

  get unlimitMode() {
    if (UserModule.childSetting == null) return true;
    return UserModule.childSetting.isNonLimitToPlay;
  }
  show() {
    this.mShowFlag = true;
  }

  close() {
    ParentSetupModule.updateRemainByCurrent();
    // ParentSetupModule.updateRemainTime(10);
    this.mShowFlag = false;
  }

  mounted() {
    // 곱하기 숫자가 2의자리수가 나오도록 조정
    this.mArg1 = Math.floor(Math.random() * 8) + 2;
    do {
      this.mArg2 = Math.floor(Math.random() * 9) + 1;
      // console.log( this.mArg1 , this.mArg2 );
    } while (this.mArg1 * this.mArg2 < 10);
  }

  private _onClose() {
    this.close();
  }

  private _onClickNum(v: number) {
    const answer = `${this.mArg1 * this.mArg2}`;
    if (v == -1) {
      if (this.mInputNumberValue.length > 0) {
        this.mInputNumberValue = this.mInputNumberValue.slice(0, -1);
      }
    } else {
      this.mInputNumberValue += v.toString();

      if (this.mInputNumberValue.length >= 2) {
        this.mInputNumberValue = this.mInputNumberValue.slice(0, 2);
        if (this.mInputNumberValue == answer) {
          console.log("correct", answer);
          gsap.delayedCall(0.2, () => {
            this.$emit("onPassParentCheck");
          });
        } else {
          console.log("wrong", answer);
        }
      }
    }
  }
}
</script>
