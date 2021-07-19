<template>
  <div class="viewBox">
    <div class="selectBox" ref="selectBox" v-for="(v, i) in this.data" :key="i" @click="_click( v)" >
      <img :src="`salesKit/al0${i+1}.png`" width="100%" />
      <span class="arrow"></span>
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
    float: left;
    width:6rem;
    min-width:146px;
    margin-right:1rem;
    cursor:pointer;
    &:last-child > .arrow{
      display:none;
    }
    .arrow{
      overflow:hidden;
      position: relative;
      display:block;
      width:2rem;
      height:2rem;
      top:-6.5rem;
      left:7rem;
      &::after{
        content:"";
        display:block;
        position:absolute;
        top:50%;
        left:50%;
        width:1rem;
        height:1rem;
        border-top:4px #e4e4e4 solid;
        border-right:4px #e4e4e4 solid;
        box-sizing:border-box;
        transform: translate(-50%,-50%) rotate(45deg);
        animation: arrowMotion infinite 2s;
      }
    }
  }
}
@keyframes arrowMotion {
  from{left:-30%;}
  to{left:30%;}
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

  private _getTitle(info: DataInfo) {
    console.log(info);
    // return info['title'];
  }

  private _getLabel(info: DataInfo) {
    if (info["label"] === "") return info["category"];
    return info["label"];
  }

  private _click( info: DataInfo) {
    if (this.flag) {
      this.$emit("onClickItem", info);
    }
  }

}
</script>