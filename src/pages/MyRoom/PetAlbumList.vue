<!-- 부모 설정화면 -->
<template>
<div class="PetAlbumList">
    <PetAlbumThumb 
        v-for="(info,idx) in mOutputPathList" 
        :key="idx" 
        :info="info" 
        @onShowDetail="_showDetail"/>
    <PetAlbumDetail 
        v-if="mDetailShowFlag" 
        @onClose="_closeDetail" 
        :imagePath="this.mDetailShowImagePath" 
        :date="this.createdDate"
        />
</div>
</template>

<style lang="scss" scoped>
.PetAlbumList{
    padding: 7rem 7rem 3rem;
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
.PetAlbumList::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PetAlbumThumb from './PetAlbumThumb.vue'
import PetAlbumDetail from './PetAlbumDetail.vue'
import Axios from 'axios';
import Util from '@/Util';

@Component({
    components:{
        PetAlbumThumb,
        PetAlbumDetail
    }
})
export default class PetAlbumList extends Vue {
    private mOutputPathList = [
       //"img/capture.png",
    ]
    private mDetailShowFlag = false;
    private mDetailShowImagePath = "img/capture.png";
    private createdDate = "" ;

    async mounted(){
        //
        const response = await Axios.get(
            `${ Util.Config.restAPIProd }/learning/child/myroom/album`
        );
        // { galleryUrl:"img/capture.png", createdDate:'2020.08.11'}
        
        this.mOutputPathList = response.data.infolist;
        
    }

    _showDetail( info: { galleryUrl: string; createdDate: string } ){
        this.mDetailShowFlag = true;
        this.mDetailShowImagePath = info.galleryUrl;
        this.createdDate = info.createdDate;
        // console.log( "_showDetail:", imagepath);
    }

    _closeDetail(){
        this.mDetailShowFlag = false;        
    }

}
</script>
