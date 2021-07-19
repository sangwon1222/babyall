<template>
  <div class="ParentCheckPopup" @click="_onClose()">
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
          <div class="numbtn" style="width: 314px" @click.stop="_onClickNum(0)">
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
  width: 100%;
  height: clac(100% + 10px);
  position: absolute;
  top: -10px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .popup-body {
    position: relative;
    display: flex;
    flex-direction: column;
    title {
      position: absolute;
      top: -110px;
      border: 10px red solid;
    }
    .head {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      padding-top: 50px;
      background-color: #cbeaff;
      width: 589px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .quiz {
        font-size: 4rem;
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .answer {
        border: 2px solid #97daff;
        border-radius: 20px;
        background-color: #fff;
        width: 370px;
        height: calc(4rem + 10px);
        text-align: center;
        font-size: 4rem;
        color: #ff2d4b;
        padding-top: 5px;
        padding-bottom: 5px;

        margin-bottom: 15px;
      }
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
      .numbtn {
        border: 1px solid #e5e5e5;
        border-radius: 10px;

        font-size: 3.5rem;
        font-weight: normal;
        font-family: monospace;

        color: #626e74;
        width: 146px;
        height: 120px;
        text-align: center;
        line-height: 120px;
        background-color: #fff;
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { gsap } from "gsap";

@Component
export default class ParentCheckPopup extends Vue {
  private mArg1 = 1;
  private mArg2 = 1;
  private mInputNumberValue = "";

  mounted() {
    // 곱하기 숫자가 2의자리수가 나오도록 조정
    this.mArg1 = Math.floor(Math.random() * 8) + 2;
    do {
      this.mArg2 = Math.floor(Math.random() * 9) + 1;
      console.log(this.mArg1, this.mArg2);
    } while (this.mArg1 * this.mArg2 < 10);
  }
  private _onClose() {
    console.log("CLOSE");
    this.$emit("onCloseParentCheckPopup");
  }

  // 번호판을 눌렀을때
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
