<template>
    <div class="ParentMovie">
        <TubeVideoPlayer 
            ref="video" 
            :videoInfo="mCurrentVideoInfo"
            @closePlayer="_closePlayer"
            v-if="selectPlayer"
            @onVideoPlayEnd="_onVideoPlayEnd"
            />
        <div class="row">
            <div class="select-group">
                <img class="bg" src="img/parent/step_bar.png">
                <img class="btn" style="left:0px" src="img/parent/btn_step1.png" :style="currentFilter == 'step1'?'opacity:1':'opacity:0'"   @click="_selectFilter('step1')" />
                <img class="btn" style="left:220px" src="img/parent/btn_step2.png" :style="currentFilter == 'step2'?'opacity:1':'opacity:0'" @click="_selectFilter('step2')"/>
                <img class="btn" style="left:438px" src="img/parent/btn_favorites.png" :style="currentFilter == 'favorite'?'opacity:1':'opacity:0'" @click="_selectFilter('favorite')"/>
            </div>
        </div>

        <div ref="playlist" class="playlist">
            <TubeListItem 
                class="TubeListItem"
                v-for="(item, idx) in playlist"  
                :info='item'
                :idx='idx'
                :key="idx"
                @toggleFavorite="_toggleFavorite"
                @onSelectVideo="_selectVideo"
                ></TubeListItem>
           
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ParentMovie {
    // border:1px solid #F00;
    // position: relative;
    margin-top: 90px;
    background-color: #f0f0f0;
    width: 100%;
    height: calc( 100% - 90px );
    box-sizing: border-box;
    
    overflow-y:scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    .row{
        width:100%;
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        .select-group {
            position: relative;
            margin: 2rem 0 1rem;
            .bg{
                cursor: pointer;
                position: relative;
                justify-self: center;
            }
            .btn{
                position: absolute;
                cursor: pointer;
            }
        }
    }
    .playlist {
        overflow: hidden;
        display: flex;
        flex-direction: row;
        flex-wrap:wrap;
        justify-content: flex-start;
        align-items: center;

        width:1280px;
        height: auto;
        box-sizing:border-box;
        /* overflow-y: scroll; */
        
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/ }
    }
    &::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}
}

/* .videoplayer{
    position: absolute;
    top:90px;
    left:0px;
    transform-origin: 50% 50%;
    
    transition: all 0.5s;
    video{ 
        -moz-transform:rotate(0.01deg);
        -webkit-transform:rotate(0.01deg);
        -o-transform:rotate(0.01deg);
        -ms-transform:rotate(0.01deg);
        transform:rotate(0.01deg);
        // object-fit: cover;
        width:100%;
    }
} */

</style>

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import Axios from "axios"
import AppVue from '@/App.vue';

import TubeVideoPlayer from '@/components/TubeVideoPlayer.vue'
import TubeListItem from '@/components/TubeListItem.vue'
import {ParentSetupModule} from "@/store/ParentSetup"
import gsap from 'gsap';

@Component({
    components:{
        TubeListItem,
        TubeVideoPlayer,
    }
})
export default class ParentMovie extends Vue {

    private mCurrentFilter = 'step1';
    private mClickFlag = true;
    private selectPlayer = false;

    private mCurrentVideoIdx = 0;

    get currentFilter(){ 
        return this.mCurrentFilter; 
    }

    mCurrentVideoInfo = { movie:"", subject:""};
    async mounted(){
        const app = this.$root.$children[0] as AppVue ;

        await ParentSetupModule.requestParentMovieList( this.mCurrentFilter );
    }

    get playlist(): Array<any>{ 
        // console.log( ParentSetupModule.parentMovieList );
        return ParentSetupModule.parentMovieList;
    }

    _onVideoPlayEnd(){
        console.log(ParentSetupModule.parentMovieList[this.mCurrentVideoIdx+1])
        if(ParentSetupModule.parentMovieList[this.mCurrentVideoIdx+1] != undefined){
            this.mCurrentVideoIdx+=1;
        }else{
            this.mCurrentVideoIdx =0;
        }
        this.mCurrentVideoInfo = ParentSetupModule.parentMovieList[this.mCurrentVideoIdx]
    }

    _toggleFavorite(itemInfo: any){
        if( itemInfo ){
            ParentSetupModule.toggleFavorite({ 
                itemData: itemInfo
            })
        }
    }
    _selectFilter( filter: string) {
        this.mCurrentFilter = filter;

        ParentSetupModule.requestParentMovieList( this.mCurrentFilter );
    }

    private _selectVideo( itemInfo: any , idx: number ){
        // https://greensock.com/forums/topic/8053-scrolltop-in-greensock/
        // BabyTubeModule.selectItem( itemInfo );
        if(this.mClickFlag){
            this.mClickFlag = false;
            this.selectPlayer = true;
            this.mCurrentVideoIdx = idx;
            this.mCurrentVideoInfo = itemInfo;
            ParentSetupModule.selectItem( this.mCurrentVideoInfo );
            gsap.delayedCall(1,()=>{ this.mClickFlag = true; })
        }
    }

    _closePlayer(){
        this.selectPlayer = false;
    }
}
</script>
 