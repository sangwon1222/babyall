<template>
    <div class="reportSummary">
        <div class="contentsPanel">
            <h1 style="letter-spacing:-0.1rem;">활동 누적</h1>
            <span class="subTitle" >현재까지 누적된 학습 데이터 입니다.</span>
            <div style="background-color:#ccc; width: 100%;height:2px; " />
            <ul class="first">
                <li><span class="title">학습 시간</span><span class="value">{{lrngTime}}</span></li>
                <li><span class="title">평균학습 시간</span><span class="value">{{avgLrngTime}}</span></li>
                <li><span class="title">활동 횟수</span><span class="value">{{lrngActTcnt}}</span></li>
            </ul>

            <div style="background-color:#ccc; width: 100%;height:2px; margin-bottom:20px; " />
            
            <!-- <div class="row"><img src="img/parent/acon.png" style="margin-right: 20px;"/><span>현재 도토리 {{acornCnt}}</span> <span class="btn">충전</span></div> -->
            <div class="acornRow">
                <img class="acorn" src="img/parent/acon.png" @click="_showAcornGuidePopUp" />
                <span style="letter-spacing:-0.1rem; margin:0 10px;">현재 도토리 {{acornCnt}}</span> 
                <!-- <span class="btn"
                    @click="_chargingAcornPopUp"
                >충전</span> -->
                <span class="btn" @click="_chargingAcornPopUp">
                    <img src="img/parent/btn_charge_sub.png" style="width:100%;" alt="">
                </span>
            </div>
            
        </div>

        <div class="contentsPanel">
            <h1>학습누적</h1>
            <span class="subTitle">반복 학습까지 누적된 학습 데이터 입니다.</span>
            <div style="background-color:#ccc; width: 100%;height:2px; margin-bottom:20px; " />
            <ul>
                <li><span class="title">접한  단어</span><span class="value">{{lrngWrdEcnt}}</span></li>
                <li><span class="title">접한  표현</span><span class="value">{{lrngXprsEcnt}}</span></li>
            </ul>
            <ul style="margin:20px 0">
                <li><span class="title">액티비티</span><span class="value">{{lrngAcvtEcnt}}</span></li>
                <li><span class="title">푼  문제  수</span><span class="value">{{lrntQstPrcsEcnt}}</span></li>
            </ul>
            <ul>
                <li><span class="title">미디어  청취</span><span class="value">{{mdaLsngTcnt}}</span></li>
                <li><span class="title">미디어  활용</span><span class="value">{{mdaPtkEcnt}}</span></li>
            </ul>
            <div class="row" style="margin-top:10px;">
                <Graph 
                    ref="graph"
                    :value="mdaPtkEcntPercent"
                    height="34"
                    color="#f44336"
                    bgcolor="#FFF"
                    labelcolor="#FFF"
                    style="width:100%"
                    />
            </div>
        </div>

        <div class="contentsPanel">
            <h1>레벨별</h1>
            <SummaryLevelInfo labelImage="lv1.png" :info="this.summaryLevelInfo1" />
            <SummaryLevelInfo labelImage="lv2.png" :info="this.summaryLevelInfo2" />
            <SummaryLevelInfo labelImage="lv3.png" :info="this.summaryLevelInfo3" />
        </div>
        
    </div>
</template>

<style lang="scss" scoped>
.reportSummary{
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
    width:100%;
    max-height: 630px;
    box-sizing: border-box;
    padding: 24px 0 ;
    
    &::-webkit-scrollbar{display:none;}
}
.contentsPanel{
    margin: 20px 0 ;
    padding: 50px 50px 40px 50px;
    min-width:620px;
    width:620px;

    box-sizing:border-box;
    border-radius: 30px;
    box-shadow: 0px 0px 20px rgba(0,0,0,0.3);
    background-color: #FFF;
    color: #000;
    .subTitle{
        display:block;
        letter-spacing: -0.1rem;
        padding:1rem 0;
        color: #848484;
    }
    .acornRow{
        display:flex;
        align-items: center;
         >.acorn{
            cursor:pointer;
        }
        .btn{
            /* background-color: #fdc13f; */
            /* color:#712f0f; */
            /* letter-spacing: -0.1rem; */
            position:relative;
            overflow: hidden;
            cursor: pointer;
            display: block;
            width:120px;
            height:60px;
            text-align: center;
            font-family: 'Noto sans';
            /* font-weight: bold; */
            margin: 0 40px;
            > img{
                position:absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%);
            }
        }
    }
    .row{
        // border: 1px solid #0F0;
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
       
    }
    .col{
        // border: 1px solid #F00;
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 10px;
    }
    .subContents{
        margin-top: 20px;
        padding: 20px;
        border-radius: 20px;
        border: 5px solid #EEE;

    }
    h1{
        font-family: 'Noto sans';
        font-size: 28px;
        font-weight: bold;
    }
    span{
        font-family: 'Noto sans';
        font-size: 25px;
        color: #000;
    }
    hr{
        // border: 1px solid #848484;
        height:1px;
    }
    .roundTitle{
        background-color: #EEE;
        display: inline-block;
        padding: 10px;
        min-width: 100px;
        text-align: center;
        border-radius: 40px;
        padding-left: 40px;
        padding-right: 40px;
        color: #000;
        font-family: 'Noto sans';
        // font-weight: bold;
        margin: 10px;
    }
    ul.first{
        padding:1rem 0;
    }
    li{
        display:flex;
        flex-direction: row;
        align-items: center;
        
        padding: 0 0 10px;

        width: 90%;

        .title{
            color: #000;
            letter-spacing: -0.15rem;
        }
        .value{
            flex:1;
            text-align: right;
            color: #000;
            font-weight: 600;
        }
    }
    li:before {
        content: "";
        display:block;
        // margin-left: -1.3em; /* same as padding-left set on li */
        width: 10px;
        margin-right: 0.5rem;
        height: 10px;
        border-radius: 20px;
        /* background-color: #f05574; */
        border:6px #f05574 solid;
        box-sizing: border-box;
    }
    .li2:before{
        background-color:#153d8f;
    }

    
}
</style>

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import Axios from "axios"
// import Slider from "../components/Slider.vue"
import Graph from "../components/Graph.vue"
import CircleGraph from "../components/CircleGraph.vue"
// import DirGraph from "../components/DirGraph.vue"
// import LineGraph from "../components/LineGraph.vue"
import StarGraph from "../components/StarGraph.vue"

import { ParentSetupModule } from '@/store/ParentSetup';
import Util from '@/Util';
import SummaryLevelInfo from "./ReportSummary/SummaryLevelInfo.vue"
import { ParentInfo } from '@/store/Define';
import { SystemModule } from '@/store/System';

@Component({
    components:{
        // Slider,
        Graph,
        CircleGraph,
        // DirGraph,
        // LineGraph,
        StarGraph,
        SummaryLevelInfo,
    }
})
export default class ReportSummary extends Vue {
    

    get lrngTime(): string{
        if( ParentSetupModule.actSummaryReport != null && ParentSetupModule.actSummaryReport.lrngTime!== undefined){
            return Util.numberWithCommas( ParentSetupModule.actSummaryReport.lrngTime ) + "분";
        }
        return "0분";
    }
    
    get avgLrngTime(): string{
        if( ParentSetupModule.actSummaryReport != null && ParentSetupModule.actSummaryReport.avgLrngTime!== undefined){
            return Util.numberWithCommas( ParentSetupModule.actSummaryReport.avgLrngTime ) + "분";
        }
        return "0분";
    }
    
    get lrngActTcnt(): string{
        if( ParentSetupModule.actSummaryReport != null && ParentSetupModule.actSummaryReport.lrngActTcnt!== undefined){
            return Util.numberWithCommas( ParentSetupModule.actSummaryReport.lrngActTcnt ) + "회";
        }
        return "0회";
    }

    get acornCnt(): string{
        if( ParentSetupModule.actSummaryReport != null && ParentSetupModule.actSummaryReport.acornCnt!== undefined){
            return Util.numberWithCommas( ParentSetupModule.actSummaryReport.acornCnt ) + "개";
        }
        return "0개";
    }
    //-------------------------------------
    get lrngWrdEcnt(): string{
        if( ParentSetupModule.actSummaryReport != null && 
            ParentSetupModule.actSummaryReport.lrngWrdEcnt!== undefined){
            return Util.numberWithCommas( ParentSetupModule.actSummaryReport.lrngWrdEcnt ) + "개";
        }
        return "0개";    
    }
    get lrngXprsEcnt(): string{
        if( ParentSetupModule.actSummaryReport != null && 
            ParentSetupModule.actSummaryReport.lrngXprsEcnt!== undefined){
            return Util.numberWithCommas( ParentSetupModule.actSummaryReport.lrngXprsEcnt ) + "개";
        }
        return "0개";    
    }
    get lrngAcvtEcnt(): string{
        if( ParentSetupModule.actSummaryReport != null && 
            ParentSetupModule.actSummaryReport.lrngAcvtEcnt!== undefined){
            return Util.numberWithCommas( ParentSetupModule.actSummaryReport.lrngAcvtEcnt ) + "개";
        }
        return "0개";    
    }
    get lrntQstPrcsEcnt(): string{
        if( ParentSetupModule.actSummaryReport != null && 
            ParentSetupModule.actSummaryReport.lrngQstPrcsEcnt!== undefined){
            return Util.numberWithCommas( ParentSetupModule.actSummaryReport.lrngQstPrcsEcnt ) + "개";
        }
        return "0개";    
    }
    //-------------------------------------
    get mdaLsngTcnt(): string{
        if( ParentSetupModule.actSummaryReport != null && ParentSetupModule.actSummaryReport.mdaLsngTcnt!== undefined){
            return Util.numberWithCommas( ParentSetupModule.actSummaryReport.mdaLsngTcnt ) + "회";
        }
        return "0회";    
    }
    
    get mdaPtkEcnt(): string{
        if( ParentSetupModule.actSummaryReport != null && 
            ParentSetupModule.actSummaryReport.mdaPtkEcnt !== undefined){
            return `${Util.numberWithCommas( 
                ParentSetupModule.actSummaryReport.mdaPtkEcnt[0] 
                )}개 / ${Util.numberWithCommas( 
                ParentSetupModule.actSummaryReport.mdaPtkEcnt[1] 
                )}개`;
        }
        return "(0개 / 0개)";    
    }

    get mdaPtkEcntPercent(): number{
        if( ParentSetupModule.actSummaryReport != null && 
            ParentSetupModule.actSummaryReport.mdaPtkEcnt !== undefined){
            return Math.floor(
                (ParentSetupModule.actSummaryReport.mdaPtkEcnt[0]/ParentSetupModule.actSummaryReport.mdaPtkEcnt[1])  * 100
            );
        }
        return 0;    
    }
    //-------------------------------------

    get summaryLevelInfo1(): ParentInfo.ActSummaryLevelInfo{
        if( 
            ParentSetupModule.actSummaryReport == null ||
            ParentSetupModule.actSummaryReport.sttcByLvl == null ||
            ParentSetupModule.actSummaryReport.sttcByLvl.lv1 == null
            ) return null;
        return ParentSetupModule.actSummaryReport.sttcByLvl.lv1;
    }

    get summaryLevelInfo2(): ParentInfo.ActSummaryLevelInfo{
        if( 
            ParentSetupModule.actSummaryReport == null ||
            ParentSetupModule.actSummaryReport.sttcByLvl == null ||
            ParentSetupModule.actSummaryReport.sttcByLvl.lv2 == null
            ) return null;
        return ParentSetupModule.actSummaryReport.sttcByLvl.lv2;
    }

    get summaryLevelInfo3(): ParentInfo.ActSummaryLevelInfo{
        if( 
            ParentSetupModule.actSummaryReport == null ||
            ParentSetupModule.actSummaryReport.sttcByLvl == null ||
            ParentSetupModule.actSummaryReport.sttcByLvl.lv3 == null
            ) return null;
        return ParentSetupModule.actSummaryReport.sttcByLvl.lv3;
    }


    async mounted(){
        //
        console.log("ReportSummary mounted")
        await ParentSetupModule.getActSummaryReport();
        
    }

    _showAcornGuidePopUp(){
        SystemModule.popup.showMessageHelp( "도토리를 사용하여 펫과 만날 수 있습니다.<br/>도토리는 학습 활동시 제공되며 개수가 모자랄 시 채울 수 있습니다.<br/>한번에 최대 100개까지 충전 가능하고, 충전 횟수에 제한은 없습니다." );
    }

    _chargingAcornPopUp(){
        SystemModule.popup.showAcornCharge();
    }


}
</script>
 