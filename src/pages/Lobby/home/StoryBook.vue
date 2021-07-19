<template>
  <div class="BookThumb" @click="_selectItem">
    <img src="img/home/btn_box_storybooks.png" />
    <!-- <div class="idx">{{this.getBookNumber()}}</div> -->
    <!-- <div class="desc">{{this.title}}</div> -->
    <div class="thumb">
      <img :src="getThumbImage()" />
    </div>
    <!-- <img class="img-button" :src="'img/bookcover/book_' + bookid + 'c.png'" /> -->
    <div class="star-group">
      <img
        class="star"
        v-for="idx in [0, 1, 2]"
        :key="idx"
        :src="
          idx < starCount ? 'img/home/star_on.png' : 'img/home/star_off.png'
        "
        :style="idx < starCount ? 'opacity:1' : 'opacity:0.5'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.BookThumb {
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

  .thumb {
    overflow: hidden;
    position: absolute;
    top: 58%;
    left: 50%;
    width: 150px;
    height: 150px;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 500px;
    img {
      height: 100%;
    }
  }

  .star-group {
    display: flex;
    justify-content: space-around;
    align-items: center;

    position: absolute;
    bottom: 1.3rem;
    left: 50%;
    padding: 0.2rem 0.4rem;

    width: 120px;
    height: 30px;

    transform: translateX(-50%) scale(0.8);
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 50px;
  }
}
</style>

<script lang="ts">
import gsap from "gsap/all";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class BookThumb extends Vue {
  @Prop({ default: 1001 }) private bookID: number;
  @Prop({ default: "" }) private title: string;
  @Prop({ default: 0 }) private starCount: number;
  @Prop({ default: "catch" }) private startActivity: string;

  private state = [true, true, false];

  private getBookNumber() {
    console.log(this.bookID);
    const label = `${Math.floor(this.bookID / 1000)}-${this.bookID % 1000}`;
    return label;
  }
  private getThumbImage() {
    return `img/home/cover/${this.bookID}_home_cover.png`;
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

  private async _selectItem() {
    await this.playSnd();
    this.$emit("onSelectItem", this.bookID, this.startActivity);
  }
}
</script>
