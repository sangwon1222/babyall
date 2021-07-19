<template>
  <swiper class="mySwiper" ref="mySwiper" :options="swiperOptions" >
    <swiper-slide class="slideBox" > 
        <Home 
            @onShowBabyTube="this.showTubePlayer"
            @onShowAlphabetSchool="onShowAlphabetSchool"
            @onSelectHomeMenu="onSelectHomeMenu"
            @onShowStoryBook="onShowStoryBook"
        /> 

    </swiper-slide>
    <swiper-slide class="slideBox" > 
        <BabyTube 
            @onShowBabyTube="this.showTubePlayer"
            @onShowAlphabetSchool="onShowAlphabetSchool"
            @onSelectHomeMenu="onSelectHomeMenu"
            @onShowStoryBook="onShowStoryBook"
            @_onOffSwiper="_onOffSwiper"
        /> 
        
    </swiper-slide>
    <swiper-slide class="slideBox" > 
        <StoryBook  
            @onShowBabyTube="this.showTubePlayer"
            @onShowAlphabetSchool="onShowAlphabetSchool"
            @onSelectHomeMenu="onSelectHomeMenu"
            @onShowStoryBook="onShowStoryBook"
            @_onOffSwiper="_onOffSwiper"
        /> 
        
    </swiper-slide>
    <swiper-slide class="slideBox" > 
        <AlphabetSchool 
            @onShowBabyTube="this.showTubePlayer"
            @onShowAlphabetSchool="onShowAlphabetSchool"
            @onSelectHomeMenu="onSelectHomeMenu"
            @onShowStoryBook="onShowStoryBook"
        /> 
    </swiper-slide>
  </swiper>
</template>

<style lang="scss" scoped>
.mySwiper {
  margin-top:90px;
  .slideBox {
    overflow: hidden;
    position:relative;
    max-width:1280px;
    box-sizing: border-box;
    z-index:1;
  }
}
</style>

<script>
import Home from "./Home.vue";
import StoryBook from "./StoryBook.vue";
import AlphabetSchool from "./AlphabetSchool.vue";
import BabyTube from "./BabyTube.vue";
import AppVue from '@/App.vue';

import Util from '@/Util'
import gsap from 'gsap';
export default {
  name: "mySwiper",
  methods: {
    showTubePlayer( filter ){
        this.$emit("onShowBabyTube",filter)
    },
    onShowAlphabetSchool( alphabet ){
        this.$emit("onShowAlphabetSchool",alphabet)
    },
    onSelectHomeMenu( label){
        console.log(label)
        this.$emit("onSelectHomeMenu",label)
    },
    onShowStoryBook( bookID, startActivity="catch" ){
        this.$emit("onShowStoryBook",bookID,startActivity)
    },
    goTabScene() {
        if(this.currentPage == "Home"){this.pageIDX=0;}
        if(this.currentPage == "BabyTube"){this.pageIDX=1;}
        if(this.currentPage == "StoryBook"){this.pageIDX=2;}
        if(this.currentPage == "AlphabetSchool"){this.pageIDX=3;}
        this.swiper.slideTo(this.pageIDX, 500, false)
    },
    onTabToSlide(){
      gsap.delayedCall(0.25,()=>{
        this.$emit("onTabToSlide",this.swiper.activeIndex)
      })
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
        // direction: 'vertical',
        // height:'auto',
        // direction: horizontal,

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
    Home,
    StoryBook,
    AlphabetSchool,
    BabyTube
  },
  watch : {
    currentPage: function(newValue, oldValue) {
      if (newValue != oldValue) {
        this.goTabScene();
      }
    }
  },
  props: {
    currentPage: String,
  },
};
</script>
