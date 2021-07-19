<template>
    <div class="reportAL">
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
                <div class="al-group" 
                    v-for="(info,idx) in this.actSlotReport" 
                    :key="idx" 
                    @click="_selectAL(idx, info)"
                    >
                    <img :src="info.cpltType==0?'img/parent/btn_alphabet_1.png':'img/parent/btn_alphabet_2.png'"/>
                    <span :style="info.cpltType==0?'color:#000':'color:#FFF'">{{info.createdDate}}</span>
                </div>
                <div class="group">
                    <span class="comment">13개 코스를 완료하면 <br/>리포트가 발행됩니다.</span>
                </div>
            </div>
        </div>
        
        <ReportALDetail 
            v-if="this.mIsShowDetail" 
            :level="this.mCurrentLevel" 
            :idx="this.mCurrentSelectIDX" 
            :slotInfo="this.currentALReportSlot"
            @onClose="_showDetail(false)"/>
    </div>
</template>

<style lang="scss" scoped>
.reportAL{
    overflow-y: scroll;
    position: relative;
    width:100%;
    height:calc(720px - 90px);
    padding-bottom:100px;
    box-sizing: border-box;
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
    font-size: 1.5rem;
    text-align: center;
}
.col{
    width:100%;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.group{
    width: 620px;
    padding: 20px;
    background-color: #FFF;
    border-radius: 20px;
    box-shadow: 2px 4px 6px rgba(0,0,0,0.3);
    margin-top: 40px;   
    position:relative;
}

.al-group{
    overflow:hidden;
    position: relative;
    margin-top: 20px;   
    padding: 0px;
    width: 660px;
    height:454px;
    border-radius: 20px;
    box-shadow: 2px 4px 6px rgba(0,0,0,0.3);
    cursor: pointer;
    
    span{
        // z-index: 1000;
        position: absolute;
        top:-2px;
        left: 20px;
        font-family: 'Noto sans';
        color: #FFF;
        font-size: 1.2rem;
    }
}
.select-group {
    position: relative;
    margin-top: 40px;
    margin-bottom: 20px;
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
import ReportALDetail from './ReportALDetail.vue'
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
        ReportALDetail,
        // Slider,
        // Graph,
        // CircleGraph,
        // DirGraph,
        // LineGraph,
        // StarGraph,
    }
})
export default class ReportAL extends Vue {
    private mCurrentLevel = 1;
    get currentLevel(){ 
        return this.mCurrentLevel 
    }
    get actSlotReport(): Array< ParentInfo.ALReportSlot >{
        if( ParentSetupModule.actSlotReport == null ) return [];
        if( ParentSetupModule.actSlotReport.alphabet == null ) return [];
        if( this.mCurrentLevel == 1){
            if( ParentSetupModule.actSlotReport.alphabet.lv1 == null ) return [];
            return ParentSetupModule.actSlotReport.alphabet.lv1;
        }
        else if( this.mCurrentLevel == 2){
            if( ParentSetupModule.actSlotReport.alphabet.lv2 == null ) return [];
            return ParentSetupModule.actSlotReport.alphabet.lv2;
        }
        else if( this.mCurrentLevel == 3){
            if( ParentSetupModule.actSlotReport.alphabet.lv3 == null ) return [];
            return ParentSetupModule.actSlotReport.alphabet.lv3;
        }        
        return [];
    }

    get currentALReportSlot(): ParentInfo.ALReportSlot{
        return this.mCurrentALReportSlot;
    }
    private mCurrentALReportSlot = null;
    private mCurrentSelectIDX = 0;
    private mIsShowDetail = false;

    async mounted(){
        //
        if( ParentSetupModule.actSlotReport == null ){
            await ParentSetupModule.getActSlotReport();
        }

        console.log(ParentSetupModule.actSlotReport)
    }

    _selectLevel( lv: number) {
        this.mCurrentLevel = lv;
    }

    _selectAL( n: number, info: ParentInfo.ALReportSlot ){
        this.mCurrentSelectIDX = n+1;
        this.mCurrentALReportSlot = info
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
 