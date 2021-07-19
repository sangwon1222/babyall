<template>
  <div class="viewBox" ref="viewBox" >
      <div class="selectBox" ref="selectBox" v-for="(v, i) in this.data" :key="i" @pointerdown="_click(i,v)" >
        <img :src="v.thumb" width="100%" />
      </div>

  </div>
</template>

<style lang="scss" scoped>
.viewBox {
  overflow: hidden;
  position: absolute;
  display: flex;
  justify-content: space-around;
  left:50%;
  transform:translateX(-50%);
  padding-bottom:1rem;
    .selectBox {
      float: left;
      margin-right:2rem;
      width:0;
      cursor:pointer;
      &:last-child{
        margin-right:0;
      }
    }
}

@media (max-width: 1050px){
  
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
  private mSelectedBookIndex = 0;
  private mXPos: number;
  private mBackUpXPos: number;
  private mDimmed = false;
  private flag = false;

  private mSwipe: any;

  mounted() {

    window.addEventListener('keydown',(evt)=>{
        if(evt.keyCode == 37){
          if(this.mSelectedBookIndex==0)this.mSelectedBookIndex=2;
          else this.mSelectedBookIndex -=1;
        }
        if(evt.keyCode == 39){
          if(this.mSelectedBookIndex==2)this.mSelectedBookIndex=0;
          else this.mSelectedBookIndex +=1;
        }
        const selectBox = this.$refs.selectBox as HTMLDivElement;
        gsap.to(selectBox,{ width: innerWidth/5 ,alpha:0.4, duration:0.5})
        gsap.to(selectBox[this.mSelectedBookIndex],{ width: innerWidth/4 ,alpha:1 , duration:0.5})
    })

    gsap.delayedCall(1, () => { this.flag = true; });
    const selectBox = this.$refs.selectBox as HTMLDivElement;
    gsap.to(selectBox,{ width: innerWidth/5 ,alpha:0.4, duration:0.5})
    gsap.to(selectBox[this.mSelectedBookIndex],{ width: innerWidth/4 ,alpha:1 , duration:0.5})
    window.addEventListener('resize',()=>{ 
      gsap.to(selectBox,{ width: innerWidth/5 ,alpha:0.4, duration:0.5})
      gsap.to(selectBox[this.mSelectedBookIndex],{ width: innerWidth/4 ,alpha:1 , duration:0.5})
    })
  }

  private _click(index,info: DataInfo) {
    if (this.flag) {
      this.mSelectedBookIndex = index;
      this.$emit("onClickItem",info);

      const selectBox = this.$refs.selectBox as HTMLDivElement;
      
      gsap.to(selectBox,{ width: innerWidth/5 ,alpha:0.4, duration:0.5})
      gsap.to(selectBox[this.mSelectedBookIndex],{ width: innerWidth/4 ,alpha:1 , duration:0.5})
      
      this.flag = true; 
    }
  }

}
</script>