<template>
  <div v-if="mShowFlag" class="ParentCheckPopup" @click="_onClose()">
    <div class="popup-body" @click.stop="">
      <img class="title" src="img/parent/checkpopup_head.png" />
      <div class="head">
        <div class="quiz">{{ mArg1 }} X {{ mArg2 }}</div>
        <div class="answer">{{ mInputNumberValue }}</div>
      </div>
      <div class="inputpad">
        <div class="inputrow">
          <div class="numbtn" @click.stop="_onClickNum(1)">1</div>
          <div class="numbtn" @click.stop="_onClickNum(2)">2</div>
          <div class="numbtn" @click.stop="_onClickNum(3)">3</div>
        </div>
        <div class="inputrow">
          <div class="numbtn" @click.stop="_onClickNum(4)">4</div>
          <div class="numbtn" @click.stop="_onClickNum(5)">5</div>
          <div class="numbtn" @click.stop="_onClickNum(6)">6</div>
        </div>
        <div class="inputrow">
          <div class="numbtn" @click.stop="_onClickNum(7)">7</div>
          <div class="numbtn" @click.stop="_onClickNum(8)">8</div>
          <div class="numbtn" @click.stop="_onClickNum(9)">9</div>
        </div>

        <div class="inputrow">
          <div
            class="numbtn"
            style="width: 9.9rem"
            @click.stop="_onClickNum(0)"
          >
            0
          </div>
          <div class="numbtn" @click.stop="_onClickNum(-1)">
            <img src="img/parent/backspace.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ParentCheckPopup {
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  position: fixed;
  top: -2px;
  left: -2px;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .popup-body {
    position: relative;
    display: flex;
    flex-direction: row;

    width: 34rem;
    height: 22.5rem;
    .title {
      position: absolute;
      top: -3rem;
      left: 50%;

      width: 18.8rem;
      transform: translateX(-50%);
    }
    .head {
      display: flex;
      flex-direction: column;
      align-items: center;

      padding-top: 150px;
      width: 15.7rem;

      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      background-color: #cbeaff;

      .quiz {
        font-size: 2.4rem;
        padding-top: 0.5rem 0;
        color: #0a314c;
        letter-spacing: -0.096rem;
        font-weight: bold;
        font-family: BPreplay;
      }

      .answer {
        border: 0.1rem solid #97daff;
        border-radius: 20px;
        background-color: #fff;
        width: 10.5rem;
        height: 3.1rem;

        line-height: 3.1rem;
        text-align: center;
        font-size: 2.4rem;
        font-weight: bold;
        font-family: BPreplay;
        color: #ff2d4b;

        padding: 0.25rem 0;

        margin-top: 1rem;
      }
    }
    .inputpad {
      background-color: #fff;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      display: flex;
      flex-direction: column;
      padding: 2rem;
      width: 16rem;

      .inputrow {
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        flex-direction: flex-start;
        margin-top: 0.5rem;
      }
      .numbtn {
        border: 0.1rem solid #e5e5e5;
        border-radius: 0.5rem;

        position: relative;
        margin: 0 0.5rem 0 0;

        width: 4.7rem;
        height: 3.85rem;
        box-sizing: border-box;
        line-height: 3.85rem;

        font-size: 2rem;
        font-weight: normal;
        font-family: monospace;
        color: #626e74;
        text-align: center;

        background-color: #fff;
        &:last-child {
          margin: 0;
          > img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
      .numbtn:hover {
        cursor: pointer;
        border: 1px solid #3da8f4;
        background-color: #cbeaff;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { gsap } from "gsap";
import { ParentSetupModule } from "@/store/ParentSetup";
@Component
export default class ParentCheckPopup extends Vue {
  private mArg1 = 1;
  private mArg2 = 1;
  private mInputNumberValue = "";
  private mShowFlag = false;

  private mCorrectCB: () => void;

  mounted() {
    // 곱하기 숫자가 2의자리수가 나오도록 조정
    this.init();
  }

  init() {
    this.mInputNumberValue = "";
    this.mArg1 = Math.floor(Math.random() * 8) + 2;
    do {
      this.mArg2 = Math.floor(Math.random() * 9) + 1;
    } while (this.mArg1 * this.mArg2 < 10);
  }
  show(correctCB: () => void) {
    this.init();
    this.mShowFlag = true;
    this.mCorrectCB = correctCB;
  }

  close() {
    this.mShowFlag = false;
    this.mCorrectCB = null;
  }

  private _onClose() {
    console.log("CLOSE");
    this.close();
    // this.$emit("onCloseParentCheckPopup")
  }

  // 번호판을 눌렀을때
  private async _onClickNum(v: number) {
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
          // gsap.delayedCall(2, () => {
          if (this.mCorrectCB) {
            await this.mCorrectCB();
          }
          this.close();
          // });
        } else {
          console.log("wrong", answer);
        }
      }
    }
  }
}
</script>
