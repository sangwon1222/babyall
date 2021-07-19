<template>
  <div class="viewBox" @mouseover="_initXValue">
    <div
      class="selectBox"
      ref="selectBox"
      v-for="(v, i) in this.data"
      :key="i"
      @pointerup="_click(i, v)"
    >
      <img :src="v.thumb" width="100%"/>
      <div class="dimmed" ref="dimmed"></div>
      <p class="label" ref="label">{{ _getLabel(v) }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 784px) {
  .viewBox {
    overflow: hidden;
    display: flex;
    position: absolute;
    margin: auto;
    height: 100%;
    background:rgba(255,255,255,0.8);
    .selectBox {
      position: relative;
      float: left;
      margin-left: 1rem;
      width: 6rem;
      height: 6rem;
      line-height: 3rem;
      text-align: center;
      border: 1px silver solid;
      cursor: pointer;
      -webkit-tap:none;
      &:last-child{
        margin-right:1rem;
      }
      .label {
        position: absolute;
        left: 0;
        bottom: -1rem;
        width: 100%;
        background: none;
        color: white;
        line-height: 1rem;
        font-weight: bold;
        box-sizing: border-box;
      }
      .dimmed {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.7);
        z-index: 100;
      }
    }
  }
}

@media (max-width: 783px) {
   .viewBox {
    overflow: hidden;
    display: flex;
    position: absolute;
    margin: auto;
    height: 100%;
    background:rgba(255,255,255,0.8);
    .selectBox {
      position: relative;
      float: left;
      margin-left: 1rem;
      width: 6rem;
      height: 6rem;
      line-height: 3rem;
      text-align: center;
      border: 1px silver solid;
      cursor: pointer;
      -webkit-tap:none;
      &:last-child{
        margin-right:1rem;
      }
      .label {
        position: absolute;
        left: 0;
        bottom: -1rem;
        width: 100%;
        background: none;
        color: white;
        line-height: 1rem;
        font-weight: bold;
        box-sizing: border-box;
      }
      .dimmed {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.7);
        z-index: 100;
      }
    }
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
  @Prop({required: true}) private data!: Array<DataInfo>;

  private mXPos: number;
  private mBackUpXPos: number;
  private mDimmed = false;
  private mFlag= true;

  private mSwipe: any;

  mounted() {
    // window.onkeydown = (evt) =>{
    //   if( evt.key == 'F12'){
    //     evt.preventDefault();
    //     evt.returnValue = false;
    //   }
    // }
 window.onpointerdown=(evt)=>{ 
      if(evt.button == 0){this.mFlag=true;} 
      else{this.mFlag=false;}
    }
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

  private _click(n: number, info: DataInfo) {
    if (this.mFlag) {
      this.$emit("onClickItem", n, info);
      gsap.to(this.$refs.dimmed, { alpha: 1, height: "100%", duration: 0 });
      gsap.to(this.$refs.label, { color: "white", duration: 0 });

      gsap.to(this.$refs.dimmed[n], { alpha: 0, height: 0, duration: 0.2 });
      gsap.to(this.$refs.label[n], {
        color: "black",
        background: "rgba(255,255,255,0.6)",
        duration: 0.2
      });
    }
  }

  private _initXValue() {
    const el = this.$el as HTMLDivElement;
    const parent = el.parentElement;

    if (el.offsetWidth < parent.offsetWidth) {
      gsap.to(el, { left: 0, duration: 0.5 });
    }
  }
}
</script>