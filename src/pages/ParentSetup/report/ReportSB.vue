<template>
    <div class="reportSB">
        <div class="totalMenu">
            <div class="row">
                <div class="select-group"  @pointerover="_onOffSwiper(false)" @pointerleave="_onOffSwiper(true)">
                    <img class="bg" src="img/parent/level_bar.png">
                    <img class="btn" style="left:-5px" src="img/parent/btn_level1.png" :style="currentLevel == 1?'opacity:1':'opacity:0'"   @click="_selectLevel(1)" />
                    <img class="btn" style="left:214px" src="img/parent/btn_level2.png" :style="currentLevel == 2?'opacity:1':'opacity:0'" @click="_selectLevel(2)"/>
                    <img class="btn" style="left:434px" src="img/parent/btn_level3.png" :style="currentLevel == 3?'opacity:1':'opacity:0'" @click="_selectLevel(3)"/>
                </div>
            </div>
            <div class="col">
                <div class="sb-group" 
                    v-for="(info,idx) in this.actSlotReport" :key="idx" 
                    @click="_selectSB( idx, info)"
                >
                    <span>{{info.createdDate}}</span>
                    <div class="pic-container"> 
                        <img :src="getBookCoverImagePath(info.cpltBookList[0])" />
                        <img :src="getBookCoverImagePath(info.cpltBookList[1])"/>
                        <img :src="getBookCoverImagePath(info.cpltBookList[2])"/>
                        <img :src="getBookCoverImagePath(info.cpltBookList[3])"/>
                    </div>
                </div>
                <div class="sb-group" v-if="this.actSlotReport.length<9">
                    <span class="comment">4개 코스를 완료하면 <br/>리포트가 발행됩니다.</span>
                </div>
            </div>
        </div>
        <ReportSBDetail 
            v-if="this.mIsShowDetail" 
            :level="this.mCurrentLevel" 
            :idx="this.mCurrentSelectIDX" 
            :slotInfo="this.currentSBReportSlot" 
            @onClose="_showDetail(false)"
        />
    </div>
</template>

<style lang="scss" scoped>
.reportSB{
    overflow-y: scroll;
    position: relative;
    width:100%;
    height:calc(720px - 90px);
    box-sizing: border-box;
    padding: 40px 0 100px;
    &::-webkit-scrollbar{display:none;}
}
.row{
    width:100%;
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.comment{
    padding: 30px;
    display:flex;
    justify-content: center;
    font-family: 'Noto sans';
    color: #666;
    font-size: 1.5rem !important;
    text-align: center;
}
.col{
    width:100%;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.sb-group{
    background-color: #FFF;
    width: 660px;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 2px 4px 6px rgba(0,0,0,0.3);
    margin-bottom: 20px;
    cursor: pointer;
    span{
        font-family: 'Noto sans';
        color: #666;
        font-size: 1.2rem;
    }
    .pic-container{
        margin-top: 10px;
        padding:20px 0;
        height:110px;
        display:flex;
        justify-content: space-between;
        img{
            height:100%;
            border-radius: 20px;
            box-shadow: rgba(0,0,0,0.5) 0px 0px 5px;
        }
    }
}
.select-group {
    // border: 1px solid #F00;
    position: relative;
    margin-bottom: 30px;
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
</style>

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";

import Util from '@/Util'

import ReportSBDetail from './ReportSBDetail.vue'
import { ParentSetupModule } from '@/store/ParentSetup';
import { ParentInfo } from '@/store/Define';
import gsap from 'gsap';

// import Axios from "axios"
// import Slider from "./components/Slider.vue"
// import Graph from "./components/Graph.vue"
// import CircleGraph from "./components/CircleGraph.vue"
// import DirGraph from "./components/DirGraph.vue"
// import LineGraph from "./components/LineGraph.vue"
// import StarGraph from "./components/StarGraph.vue"

@Component({
    components:{
        ReportSBDetail,
        // Slider,
        // Graph,
        // CircleGraph,
        // DirGraph,
        // LineGraph,
        // StarGraph,
    }
})
export default class ReportSB extends Vue {
    private mCurrentLevel = 1;
    get currentLevel(){ 
        return this.mCurrentLevel 
    }

    get actSlotReport(): Array< ParentInfo.SBReportSlot >{
        if( ParentSetupModule.actSlotReport == null ) return [];
        if( ParentSetupModule.actSlotReport.storybook == null ) return [];
        if( this.mCurrentLevel == 1){
            if( ParentSetupModule.actSlotReport.storybook.lv1 == null ) return [];
            return ParentSetupModule.actSlotReport.storybook.lv1;
        }
        else if( this.mCurrentLevel == 2){
            if( ParentSetupModule.actSlotReport.storybook.lv2 == null ) return [];
            return ParentSetupModule.actSlotReport.storybook.lv2;
        }
        else if( this.mCurrentLevel == 3){
            if( ParentSetupModule.actSlotReport.storybook.lv3 == null ) return [];
            return ParentSetupModule.actSlotReport.storybook.lv3;
        }
        
        return [];
    }

    get currentSBReportSlot(): ParentInfo.SBReportSlot{
        return this.mCurrentSBReportSlot;
    }

    private mCurrentSBReportSlot = null;
    private mCurrentSelectIDX = "";
    private mIsShowDetail = false;
    async mounted(){
        //
        if( ParentSetupModule.actSlotReport == null ){
            await ParentSetupModule.getActSlotReport();
        }

        console.log(ParentSetupModule.actSlotReport)
    }

    getBookCoverImagePath( bookid: number){
        return `${Util.Config.packageURL}/bookcover/${bookid}_cover.png`
    }

    _selectLevel( lv: number) {
        // console.log( lv);
        this.mCurrentLevel = lv;
    }

    _selectSB( n: number, info: ParentInfo.SBReportSlot ){
        n = (this.actSlotReport.length-1) - n;
        if( n==0 ){ this.mCurrentSelectIDX = `1st`;}
        else if( n==1 ){ this.mCurrentSelectIDX = `2nd`;}
        else if( n==2 ){ this.mCurrentSelectIDX = `3rd`;}
        else{ this.mCurrentSelectIDX = `${n+1}th`;}
        
        this.mCurrentSBReportSlot = info
        this._showDetail( true );
    }

    _showDetail( flag: boolean){
        if(flag){
            this.$el.scrollTo(0,0)
            this.$el.setAttribute('style','overflow:hidden; height:720px;')
        }else{
            this.$el.setAttribute('style','overflow-y: scroll;  height:calc(720px - 90px);')
        }
        this.$emit('swiperFlag',flag);
        this.$emit('_showDetail',flag)
        this.mIsShowDetail = flag;
    }

    _onOffSwiper(flag){
        this.$emit("_onOffSwiper",flag)
    }
}
</script>
 