<template>
  <swiper class="mySwiper" ref="mySwiper" :options="swiperOptions" >
    <swiper-slide class="slideBox" > 
        <AlphabetSelectBoard1 @onSelectItem="_onSelectItem" />
    </swiper-slide>
    <swiper-slide class="slideBox" > 
        <AlphabetSelectBoard2 @onSelectItem="_onSelectItem" />
    </swiper-slide>
    <swiper-slide class="slideBox" > 
        <AlphabetSelectBoard3 @onSelectItem="_onSelectItem" />
    </swiper-slide>
  </swiper>
</template>

<style lang="scss" scoped>
.mySwiper {
  .slideBox {
    overflow: hidden;
    position:relative;
    width:100%;
    box-sizing: border-box;
    z-index:1;
  }
}
</style>

<script>
import AlphabetSelectBoard1 from "./AlphabetSelectBoard1.vue";
import AlphabetSelectBoard2 from "./AlphabetSelectBoard2.vue";
import AlphabetSelectBoard3 from "./AlphabetSelectBoard3.vue";
import AppVue from '@/App.vue';

import Util from '@/Util'
import gsap from 'gsap';
export default {
  name: "mySwiper",
  methods: {
    _onSelectItem(alphabet){
        this.$emit( "_onSelectItem", alphabet );
    },
  },
  data() {
    return {
      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 0,

        // slideToClickedSlide: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
        // direction: 'vertical',
        // height:'auto',
        // direction: 'horizontal',

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
    console.error('Current Swiper instance object', this.swiper)
  },
  components: {
    AlphabetSelectBoard1,
    AlphabetSelectBoard2,
    AlphabetSelectBoard3,
  },
  props: {
  },
};
</script>
