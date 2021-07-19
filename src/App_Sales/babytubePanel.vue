<template>
  <div class="viewBox" >
    <div
      class="selectBox"
      ref="selectBox"
      v-for="(v, i) in this.data"
      :key="i"
      @click="_click(v)"
    > 
      <img :src="`salesKit/tube0${i+1}.png`" width="100%" />
    </div> 
  </div>
</template>

<style lang="scss" scoped>
.viewBox {
  overflow: hidden;
  display: flex;
  position: absolute;
  height: 100%;
  .selectBox {
    position: relative;
    float: left;
    width:6rem;
    min-width:100px;
    cursor:pointer;
  }
}

</style>

<script lang = "ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GestureManager } from "@/Util/GestureManager";
import gsap from "gsap";

export interface DataInfo {
  thumb: string;
  label?: string;
  category?: string;
  movieURL?: string;
  bookID?: number;
}

@Component({
  components: {}
})
export default class ActivityDemo extends Vue {
  @Prop({
    default: () => {
      return [];
    }
  })
  private data: Array<DataInfo>;

  private mXPos: number;
  private mBackUpXPos: number;
  private mDimmed = false;
  private flag = false;

private mSwipe: any;

  mounted() {
    gsap.delayedCall(1, () => {
      this.flag = true;
    });

    this.mXPos = 0;
    const el = this.$el as HTMLDivElement;
    this.mBackUpXPos = el.scrollLeft;
    const parent = el.parentElement;

    /**리사이즈 */
    window.addEventListener("resize", () => {
      this.mXPos = 0;
      GestureManager.Handle.backUpX = 0;
      gsap.to(el, { left: 0, duration: 0.5 });
    });

    GestureManager.Handle.on(el, "drag", (deltaX: number) => {
      const parent = el.parentElement;
      if (el.offsetWidth > parent.offsetWidth) {
        if (deltaX > 0) {
          gsap.to(el, { left: 0, duration: 0.5 });
          GestureManager.Handle.backUpX = 0;
        } else if (deltaX < -el.offsetWidth + parent.offsetWidth - 40) {
          gsap.to(el, {
            left: -el.offsetWidth + parent.offsetWidth - 40,
            duration: 0.5
          });
          GestureManager.Handle.backUpX =
            -el.offsetWidth + parent.offsetWidth - 40;
        } else {
          this.mXPos = deltaX;
          gsap.to(el, { left: this.mXPos, duration: 0 });
        }
      } else {
        GestureManager.Handle.backUpX = 0;
      }
    });

    GestureManager.Handle.on(el, "stop", deltaX => {
      GestureManager.Handle.backUpX = this.mXPos;
      if (this.mSwipe) this.mSwipe.kill();
    });

    GestureManager.Handle.on(el, "swipe", (deltaX: number) => {
      const parent = el.parentElement;

      if (el.offsetWidth > parent.offsetWidth) {
        if (this.mXPos + deltaX > 0) {
          gsap.to(el, { left: 0, duration: 0.5 });
          this.mXPos = 0;
        } else if (
          this.mXPos + deltaX <
          -el.offsetWidth + parent.offsetWidth - 40
        ) {
          gsap.to(el, {
            left: -el.offsetWidth + parent.offsetWidth - 40,
            duration: 0.5
          });
          this.mXPos = -el.offsetWidth + parent.offsetWidth - 40;
        } else {
          /**SWIPE 가동 */
          this.mXPos += deltaX;

          this.mSwipe = gsap.to(el, { left: this.mXPos, duration: 0.5 });
          GestureManager.Handle.backUpX = this.mXPos;
        }
      } else {
        this.mXPos = 0;
        gsap.to(el, { left: 0, duration: 0.5 });
      }
    });
  }


  private _click(info: DataInfo) {
    if (this.flag) {

      this.$emit("onClickItem", info);
        this.flag = true;
    }
  }

    
}
</script>