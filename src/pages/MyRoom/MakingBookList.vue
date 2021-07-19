<!-- 부모 설정화면 -->
<template>
<div class="BadgeList">
    <MakingBookThumb 
        v-for="(info,idx) in mOutputPathList" 
        :key="idx" 
        :info="info" 
        @onShowDetail="_showDetail"/>
    <MakingBookDetail 
        v-if="mDetailShowFlag" 
        @onClose="_closeDetail" 
        :imagePath="this.mDetailShowImagePath" 
        :date="this.createDate"
        />
</div>
</template>

<style lang="scss" scoped>
.BadgeList{
    padding: 7rem 4rem 3rem;
    height: 100% ;
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content:flex-start;
    box-sizing:border-box;
}
.BadgeList::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MakingBookThumb from './MakingBookThumb.vue'
import MakingBookDetail from './MakingBookDetail.vue'
import Axios from 'axios';
import Util from '@/Util';

@Component({
    components:{
        MakingBookThumb,
        MakingBookDetail
    }
})
export default class MakingBookList extends Vue {
    private mOutputPathList = [
        // "http://www.imestudy.co.kr:8080/package/bookcover/2001_cover.png",
        // "http://www.imestudy.co.kr:8080/package/bookcover/2002_cover.png",
        // "http://www.imestudy.co.kr:8080/package/bookcover/2003_cover.png",
    ]
    private mDetailShowFlag = false;
    private mDetailShowImagePath = "http://www.imestudy.co.kr:8080/package/bookcover/1001_cover.png";
    private createDate = "";
    async mounted(){
        //
        const response = await Axios.get(
            `${ Util.Config.restAPIProd }/learning/child/myroom/makingbook`
        );
        this.mOutputPathList = response.data.infolist;
    }

    _showDetail( info: {galleryUrl: ""; createdDate: "" }){
        this.mDetailShowFlag = true;
        this.mDetailShowImagePath = info.galleryUrl;
        this.createDate = info.createdDate;
        console.log(info)
        // console.log( "_showDetail:", imagepath);
    }

    _closeDetail(){
        this.mDetailShowFlag = false;        
    }

}
</script>
