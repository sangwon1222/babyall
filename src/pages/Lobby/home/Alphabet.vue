<template>
  <div class="alphabet" @click="_selectItem">
    <img src="img/home/btn_box_alphabet.png" />
    <div class="current">{{ symbol.toUpperCase() }}</div>
  </div>
</template>

<style lang="scss" scoped>
.alphabet {
  overflow: hidden;
  position: relative;

  display: flex;
  justify-content: center;

  width: 13.5rem;
  height: 13.5rem;
  padding: 0.5rem;
  cursor: pointer;

  > img {
    width: 100%;
  }
  .current {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 150px;
    height: 150px;
    transform: translate(-50%, -50%);
    line-height: 235px;
    text-align: center;
    font-size: 140px;
    font-family: "minigate";
    // font-weight: bolder;
    color: #263c47;
  }
}
</style>

<script lang="ts">
import gsap from "gsap/src/gsap-core";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class BookThumb extends Vue {
  @Prop({ default: "a" }) private symbol: string;

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

  private async _selectItem() {
    await this.playSnd();
    this.$emit("onSelectItem", this.symbol);
  }
}
</script>
