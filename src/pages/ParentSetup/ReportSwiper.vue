<template>
  <swiper class="mySwiper" ref="mySwiper" :options="swiperOptions" >
    <swiper-slide class="slideBox" >  <ReportSummary />  </swiper-slide>
    <swiper-slide class="slideBox" >  
      <ReportSB @_showDetail="openDetail" @swiperFlag="_swiperFlag" @_onOffSwiper="_onOffSwiper" />  
    </swiper-slide>
    <swiper-slide class="slideBox" >  
      <ReportAL @_showDetail="openDetail" @swiperFlag="_swiperFlag" @_onOffSwiper="_onOffSwiper" />  
    </swiper-slide>
  </swiper>
</template>

<style lang="scss" scoped>
.mySwiper {
  // mobile 생성시 수정
  height: 720px;
  .slideBox {
    height:720px;
    z-index:1;
    padding-bottom:50px;
  }
}
</style>

<script>
import ReportSummary from "@/pages/ParentSetup/report/ReportSummary.vue"
import ReportSB from "@/pages/ParentSetup/report/ReportSB.vue"
import ReportAL from "@/pages/ParentSetup/report/ReportAL.vue"

import AppVue from '@/App.vue';

import Util from '@/Util'
import gsap from 'gsap';
export default {
  name: "mySwiper",
  methods: {
      
    goTabScene() {
        if(this.subMenu == "ReportSummary"){this.pageIDX=0;}
        if(this.subMenu == "ReportSB"){this.pageIDX=1;}
        if(this.subMenu == "ReportAL"){this.pageIDX=2;}
        this.swiper.slideTo(this.pageIDX, 500, false)
    },
    onTabToSlide(){
      if(this.swiper.activeIndex==undefined){
        window.document.onpointerup=()=>{ null;}
        return;
      }
      gsap.delayedCall(0.25,()=>{
        this.$emit("onTabToSlide",this.swiper.activeIndex)
      })
    },
    
    openDetail(flag){
      this.$emit('openDetail',flag);
    },

    _swiperFlag(flag){
        this.$refs.mySwiper.swiper.allowClick = !flag;
        this.$refs.mySwiper.swiper.allowTouchMove = !flag;
    },
    _onOffSwiper(flag){
        this.$refs.mySwiper.swiper.allowClick = flag;
        this.$refs.mySwiper.swiper.allowTouchMove = flag;
    },
  },
  data() {
    return {
      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 0,
        autoHeight: true,
        // freeMode: true,
        // centeredSlides: true,
        // loop:true,

        // autoplay: {
        // //   delay: 3000,
        // //   disableOnInteraction: true,
        // },
      },
      pageIDX: 0,
    }
  },
  computed: {
    swiper() {
      console.log(this.$refs.mySwiper.swiper)
      return this.$refs.mySwiper.swiper;
    },
  },
  mounted() {
    console.log('Current Swiper instance object', this.swiper)
    window.document.onpointerup=()=>{ this.onTabToSlide(); }
    this.goTabScene();
  },
  components: {
    ReportSummary,
    ReportSB,
    ReportAL,
  },
  watch : {
    subMenu: function(newValue, oldValue) {
      if (newValue != oldValue) {
        this.goTabScene();
      }
    }
  },
  props: {
    subMenu: String,
  },
};
</script>
