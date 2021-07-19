<template>
  <swiper class="mySwiper" ref="mySwiper" :options="swiperOptions" >
    <swiper-slide v-for="(v, i) in step02" :key="i" class="slideBox" >
        <img :src="getBookCoverImagePath(1000+(i+1))" @click="_showTube( {filter:'bookID', id:1000+(i+1)} )"/>
    </swiper-slide>
  </swiper>
</template>

<style lang="scss" scoped>
.mySwiper {
    position:relative;
    z-index:1;
    
  .slideBox {
    position:relative;
    min-width: 200px;
    height: 240px;
    padding:0;
    
    >img{
      position:absolute;
      transform:translate(-50%,-50%);
      top:50%;
      left:50%;
      width:90%;
      border-radius: 15px;
      box-shadow: 4px 4px 6px rgba(0,0,0,0.3);
      cursor:pointer;
    }
  }
}
</style>

<script>
import Util from '@/Util'
export default {
  name: "mySwiper",
  methods: {
    // onSwipe(index) {
    //   this.$emit(`onSwipe` , index );
    // },
    getBookCoverImagePath(bookid){
        return `${Util.Config.packageURL}/bookcover/${bookid}_cover.png`
    },
    _showTube( info ){
        this.$emit('_showTube',info)
    }
  },
  data() {
    return {
      step02: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
      swiperOptions: {
        slidesPerView: 6,
        spaceBetween: 0,
        // freeMode: true,
        // centeredSlides: true,
        // loop:true,

        autoplay: {
          delay: 3000,
          disableOnInteraction: true,
        },
        
      },
    }
  },
  computed: {
    swiper() {
      console.warm(this.$refs.mySwiper.swiper)
      return this.$refs.mySwiper.swiper;
    },
  },
  mounted() {
    //
  },
  props: {
  },
};
</script>
