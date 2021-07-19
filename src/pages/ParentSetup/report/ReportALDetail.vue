<template>
    <div class="ReportALDetail">
        <div class="topMenu">
            <div class="row">
                <img class="menuBTN" src="img/parent/btn_pre.png" @click.stop="_close()"/>
                <div class="title">{{this.titleLabel}}</div>
            </div>
        </div>

        <div class="contents">
            <div class="row center">
                <div class="group">
                    <div>
                        <div class="info"><span class="subject">발행일</span> <span class="value">{{this.sttcCreDate}}</span></div>
                        <div class="info" ><span class="subject">나      이</span> <span class="value">{{this.childAge}}세</span> </div>
                        <div class="info"><span class="subject">이      름</span> <span class="value">{{this.childNm}}</span> </div>
                        <div class="info"><span class="subject" >배운 알파벳</span> <span class="value">{{this.studiedAlphabet}}</span> </div>
                    </div>
                </div>
            </div>
        
            <div class="row center">
                <div class="group" style="padding-bottom:0;">
                    <h1 >영역 평가</h1>
                    <div class="user"><img src="img/parent/line_pink.png"/>{{this.childNm}}</div>
                    <div class="theOther"><img src="img/parent/line_grey.png"/>다른 학생들</div>
                    <DirGraph 
                    style="margin:20px 0 0 -20px;"
                    :data="[
                        { color:'#CCCC', data: this.areaInfoAvg },
                        { color:'#F00', data:this.areaInfoSelf },
                        
                    ]"
                    :margin="160"
                    size="600"
                    :labels=" this.areaInfoLevel "
                    />
                </div>
            </div>

            <SectionInfo title="알파벳 글자영역" color="#0fbfbf" fontcolor="#097878"
                :percent=" this.section1.avg "
                :data="[
                    {label:'모양인지', value:this.section1.value[0].score, max: 100, comment:this.section1.value[0].comment},
                    {label:'대소문자 구분', value:this.section1.value[1].score, max: 100, comment:this.section1.value[1].comment},
                ]" 
                />
            <SectionInfo title="알파벳 듣기 및 읽기영역" color="#0fbfbf" fontcolor="#097878"
                :percent=" this.section2.avg "
                :data="[
                    {label:'소리와 글자연결', value:this.section2.value[0].score, max: 100, comment:this.section2.value[0].comment},
                    {label:'글자와 소리 연결', value:this.section2.value[1].score, max: 100, comment:this.section2.value[1].comment},
                ]" 
                />
            <SectionInfo title="알파벳 쓰기 영역" color="#0fbfbf" fontcolor="#097878"
                :percent=" this.section3.avg "
                :data="[
                    {label:'대문자 쓰기 이해', value:this.section3.value[0].score, max: 100, comment:this.section3.value[0].comment},
                    {label:'소문자 쓰기 이해', value:this.section3.value[1].score, max: 100, comment:this.section3.value[1].comment},
                ]" 
                />
            <SectionInfo title="대표 단어 인지 영역" color="#0fbfbf" fontcolor="#097878"
                :percent=" this.section4.avg "
                :data="[
                    {label:'대표 단어 글자인지', value:this.section4.value[0].score, max: 100, comment:this.section4.value[0].comment},
                    {label:'대표 단어 의미 이해', value:this.section4.value[1].score, max: 100, comment:this.section4.value[1].comment},
                ]" 
                />


            <BookInfoAL title="글자" 
                infoThumb="img/parent/alinfo1.png"
                :dataset="[
                    {color:'#0ad7d7', 
                        label: this.getBookinfo(0).progressLabel[0].toString(),
                        start:0,
                        end: ( 360*( this.getBookinfo(0).progressRate[0]/100 ) ), },
                    {color:'#0fbfbf', 
                        label: this.getBookinfo(0).progressLabel[1].toString(), 
                        start:( 360*( this.getBookinfo(0).progressRate[0]/100 ) ),
                        end:( 360*( (
                            this.getBookinfo(0).progressRate[0] + this.getBookinfo(0).progressRate[1]
                            )/100 ) ), },
                    ]"
                :score="this.getBookinfo(0).score"
                :grade="this.getBookinfo(0).grade"
                :notCompleted="this.getBookinfo(0).notCompleted"
                />
            <BookInfoAL title="듣기,읽기" 
                infoThumb="img/parent/alinfo2.png"
                :dataset="[
                    {color:'#be4cff', 
                        label: this.getBookinfo(1).progressLabel[0].toString(),
                        start:0,
                        end: ( 360*( this.getBookinfo(1).progressRate[0]/100 ) ), },
                    {color:'#00c641', 
                        label: this.getBookinfo(1).progressLabel[1].toString(), 
                        start:( 360*( this.getBookinfo(1).progressRate[0]/100 ) ),
                        end:( 360*( (
                            this.getBookinfo(1).progressRate[0] + this.getBookinfo(1).progressRate[1]
                            )/100 ) ), },
                    ]"
                :score="this.getBookinfo(1).score"
                :grade="this.getBookinfo(1).grade"
                :notCompleted="this.getBookinfo(1).notCompleted"
                />
            <BookInfoAL title="쓰기" 
                infoThumb="img/parent/alinfo3.png"
                :dataset="[
                    {color:'#ff4999', 
                        label: this.getBookinfo(2).progressLabel[0].toString(),
                        start:0,
                        end: ( 360*( this.getBookinfo(2).progressRate[0]/100 ) ), },
                    {color:'#ec267d', 
                        label: this.getBookinfo(2).progressLabel[1].toString(), 
                        start:( 360*( this.getBookinfo(2).progressRate[0]/100 ) ),
                        end:( 360*( (
                            this.getBookinfo(2).progressRate[0] + this.getBookinfo(2).progressRate[1]
                            )/100 ) ), },
                    ]"
                :score="this.getBookinfo(2).score"
                :grade="this.getBookinfo(2).grade"
                :notCompleted="this.getBookinfo(2).notCompleted"
                />
            <BookInfoAL title="단어" 
                infoThumb="img/parent/alinfo4.png"
                :dataset="[
                    {color:'#ffc705', 
                        label: this.getBookinfo(3).progressLabel[0].toString(),
                        start:0,
                        end: ( 360*( this.getBookinfo(3).progressRate[0]/100 ) ), },
                    {color:'#ffe505', 
                        label: this.getBookinfo(3).progressLabel[1].toString(), 
                        start:( 360*( this.getBookinfo(3).progressRate[0]/100 ) ),
                        end:( 360*( (
                            this.getBookinfo(3).progressRate[0] + this.getBookinfo(3).progressRate[1]
                            )/100 ) ), },
                    ]"
                :score="this.getBookinfo(3).score"
                :grade="this.getBookinfo(3).grade"
                :notCompleted="this.getBookinfo(3).notCompleted"
                />
            
            <!-- <ALTalentInfo 
                :data="this.talentInfoData"
                :bookIDList="this.bookIDList"
                /> -->
            <ALTalentInfo 
                :labels=" this.talentLabels "
                :name=" this.childNm "
                :selfData=" this.selfData "
                :avgData=" this.avgData "
                :comments=" this.comments "

                />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ReportALDetail{
    position: absolute;
    display: flex;
    flex-direction: column;

    top:90px;
    left:0px;

    width: 100%;
    height:100%;

    box-sizing: border-box;
    background-color: #f0f0f0;
    z-index: 1000;
    h1{
        font-family: 'Noto sans';
        font-size: 28px;
        font-weight: bold;
    }
    .info{
        // border: 1px dashed #fc0;
        .subject{
            background-color: #ddeffd;
            padding: 6px 10px;
            width: 140px;
            // height: 30px;
            border-radius: 26px;
            display:inline-block;
            text-align: center;
            color:#000;
            margin-right: 20px;
            margin-bottom: 5px;
        }
        .value{
            color:#000;
        }
    }
    .topMenu{
        background-color: #FFF;
        box-shadow: 0rem 0rem 1rem rgba(0,0,0,0.2);
        width: inherit;
        min-height: 90px;
        position: fixed;
        top: 0;
        z-index: 100;
    }
    .menuBTN{
        cursor: pointer;
        margin: 15px;
        z-index:1;
    }
    .title{
        position:absolute;
        width:100%;
        text-align: center;
        font-family: 'Noto sans';
        font-weight: bold;
        font-size: 1.5rem;
        color:#328df4;
        z-index:0;
        .cap{
            background-color:#328df4;
            padding-top: 5px;
            padding-bottom: 5px;
            width: 150px;
            display: inline-block;
            text-align: center;
            border-radius: 20px;
            color: #FFF;
            font-family: 'Noto sans';
            font-weight: bold;
            font-size: 1.5rem;
            margin-right: 20px;
        }
    }
    .contents{
       // mobile 생성시 수정
        height: 630px;
        box-sizing:border-box;
        padding: 30px 0;
        overflow-y:scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}
    }

}
.infoUL{
    li{
        // border: 1px solid #F00;
        margin-bottom: 10px;
        width: 90%;
        display:flex;
        flex-direction: row;
        align-items: center;
        .title{
            color: #000;
        }
        .value{
            flex:1;
            text-align: right;
            color: #000;
        
        }
    }
    li:before {
        content: "";
        display:block;
        // margin-left: -1.3em; /* same as padding-left set on li */
        width: 20px;
        margin-right: 32px;
        height: 20px;
        border-radius: 20px;
        background-color: #f05574;
    }
}

.center{
    justify-content: center;
}
.row{
    width:100%;
    display:flex;
    flex-direction: row;
    align-items: center;
    // justify-content: center;
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
    position:relative;
    background-color: #FFF;
    width: 620px;
    padding: 46px 50px;
    border-radius: 20px;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
    box-sizing:border-box;
    margin-top: 20px;
    // cursor: pointer;
    span{
        font-family: 'Noto sans';
        color: #666;
        font-size: 1.2rem;
    }
    .pic-container{
        margin-top: 10px;
        display:flex;
        img{
            margin-right: 20px;
            width: 140px;
            border-radius: 20px;
        }
    }
    .user, .theOther{
        position:absolute;
        top:100px;
        left:50px;
        z-index:1000;
        display:flex;
        align-items: center;
    }
    .theOther{
        top:130px;
    }
}
.select-group {
    // border: 1px solid #F00;
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

import Graph from "../components/Graph.vue"
import DirGraph from "../components/DirGraph.vue"
import SectionInfo from "../components/SectionInfo.vue"
import BookInfoAL from "../components/BookInfoAL.vue"
import ALTalentInfo from "../components/ALTalentInfo.vue"
import { ParentInfo } from '@/store/Define';
import { ParentSetupModule } from '@/store/ParentSetup';
import gsap from 'gsap';

@Component({
    components:{
        Graph,
        DirGraph,
        SectionInfo,
        BookInfoAL,
        ALTalentInfo
    }
})
export default class ReportALDetail extends Vue {
    @Prop( {default:null}) private slotInfo: ParentInfo.ALReportSlot;
    @Prop( {default:0}) private idx: number;
    @Prop( {default:0}) private level: number;
    
    get detailReportAL(): ParentInfo.DetailReportAL{
        return ParentSetupModule.detailReportAL;
    }
    get sttcCreDate(): string{
        if( this.detailReportAL == null ) return "--"
        return this.detailReportAL.sttcCreDate;
    }
    get childAge(): number{
        if( this.detailReportAL == null ) return 0
        return this.detailReportAL.childAge;
    }
    get childNm(): string{
        if( this.detailReportAL == null ) return '--'
        return this.detailReportAL.childNm;
    }

    get titleLabel(): string{
        if( this.slotInfo == null ) return "";
        if( this.slotInfo.cpltType == undefined ) return "--";
        return this.slotInfo.cpltType == 0?"A - M":"N - Z"
    }

    get studiedAlphabet(): string{
        if( this.detailReportAL == null ) return '--'
        return this.detailReportAL.alphabetStep == 1?"A - M (a-m)":"N - Z (n-z)";
    }

    get areaInfoSelf(): Array<number>{
        if( this.detailReportAL == null ) return [0,0,0,0];        
        return [ 
            this.detailReportAL.asesByArea[0].acvtMsmtScore,
            this.detailReportAL.asesByArea[1].acvtMsmtScore,
            this.detailReportAL.asesByArea[2].acvtMsmtScore,
            this.detailReportAL.asesByArea[3].acvtMsmtScore,
        ]
    }
    get areaInfoAvg(): Array<number>{
        if( this.detailReportAL == null ) return [0,0,0,0];        
        return [ 
            this.detailReportAL.asesByArea[0].acvtMsmtAvgScore,
            this.detailReportAL.asesByArea[1].acvtMsmtAvgScore,
            this.detailReportAL.asesByArea[2].acvtMsmtAvgScore,
            this.detailReportAL.asesByArea[3].acvtMsmtAvgScore,
        ]
    }

    get areaInfoLevel(): Array<string>{
        if( this.detailReportAL == null ) return ['','','',''];        
        return [ 
            this.detailReportAL.asesByArea[0].acvtMsmtNm,
            this.detailReportAL.asesByArea[1].acvtMsmtNm,
            this.detailReportAL.asesByArea[2].acvtMsmtNm,
            this.detailReportAL.asesByArea[3].acvtMsmtNm,
        ]
    }
    
    get section1(): {avg: number; value: Array<{score: number; comment: string}> } 
    {
        const result = {
            avg: 0,
            value: [
                {score: 0, comment:"설명 없음"},
                {score: 0, comment:"설명 없음"},
            ]
        }

        if( this.detailReportAL == null ) return result
        if( this.detailReportAL.AM001 === undefined ) return result
        if( this.detailReportAL.AM001.avgScore !== undefined ){
            result.avg = this.detailReportAL.AM001.avgScore;
        }
        if( this.detailReportAL.AM001.AM001001 !== undefined ||
            this.detailReportAL.AM001.AM001001.msmtScore !== undefined ||
            this.detailReportAL.AM001.AM001001.asesCtt !== undefined ){
               result.value[0].score =  this.detailReportAL.AM001.AM001001.msmtScore;
               result.value[0].comment =  this.detailReportAL.AM001.AM001001.asesCtt;
        }
        if( this.detailReportAL.AM001.AM001002 !== undefined ||
            this.detailReportAL.AM001.AM001002.msmtScore !== undefined ||
            this.detailReportAL.AM001.AM001002.asesCtt !== undefined ){
               result.value[1].score =  this.detailReportAL.AM001.AM001002.msmtScore;
               result.value[1].comment =  this.detailReportAL.AM001.AM001002.asesCtt;
        }
        return result;
    }
    get section2(): {avg: number; value: Array<{score: number; comment: string}> } 
    {
        const result = {
            avg: 0,
            value: [
                {score: 0, comment:"설명 없음"},
                {score: 0, comment:"설명 없음"},
            ]
        }

        if( this.detailReportAL == null ) return result
        if( this.detailReportAL.AM002 === undefined ) return result
        if( this.detailReportAL.AM002.avgScore !== undefined ){
            result.avg = this.detailReportAL.AM002.avgScore;
        }
        if( this.detailReportAL.AM002.AM002001 !== undefined ||
            this.detailReportAL.AM002.AM002001.msmtScore !== undefined ||
            this.detailReportAL.AM002.AM002001.asesCtt !== undefined ){
               result.value[0].score =  this.detailReportAL.AM002.AM002001.msmtScore;
               result.value[0].comment =  this.detailReportAL.AM002.AM002001.asesCtt;
        }
        if( this.detailReportAL.AM002.AM002002 !== undefined ||
            this.detailReportAL.AM002.AM002002.msmtScore !== undefined ||
            this.detailReportAL.AM002.AM002002.asesCtt !== undefined ){
               result.value[1].score =  this.detailReportAL.AM002.AM002002.msmtScore;
               result.value[1].comment =  this.detailReportAL.AM002.AM002002.asesCtt;
        }
        return result;
    }
    get section3(): {avg: number; value: Array<{score: number; comment: string}> } 
    {
        const result = {
            avg: 0,
            value: [
                {score: 0, comment:"설명 없음"},
                {score: 0, comment:"설명 없음"},
            ]
        }

        if( this.detailReportAL == null ) return result
        if( this.detailReportAL.AM003 === undefined ) return result
        if( this.detailReportAL.AM003.avgScore !== undefined ){
            result.avg = this.detailReportAL.AM003.avgScore;
        }
        if( this.detailReportAL.AM003.AM003001 !== undefined ||
            this.detailReportAL.AM003.AM003001.msmtScore !== undefined ||
            this.detailReportAL.AM003.AM003001.asesCtt !== undefined ){
               result.value[0].score =  this.detailReportAL.AM003.AM003001.msmtScore;
               result.value[0].comment =  this.detailReportAL.AM003.AM003001.asesCtt;
        }
        if( this.detailReportAL.AM003.AM003002 !== undefined ||
            this.detailReportAL.AM003.AM003002.msmtScore !== undefined ||
            this.detailReportAL.AM003.AM003002.asesCtt !== undefined ){
               result.value[1].score =  this.detailReportAL.AM003.AM003002.msmtScore;
               result.value[1].comment =  this.detailReportAL.AM003.AM003002.asesCtt;
        }
        return result;
    }
    get section4(): {avg: number; value: Array<{score: number; comment: string}> } 
    {
        const result = {
            avg: 0,
            value: [
                {score: 0, comment:"설명 없음"},
                {score: 0, comment:"설명 없음"},
            ]
        }

        if( this.detailReportAL == null ) return result
        if( this.detailReportAL.AM004 === undefined ) return result
        if( this.detailReportAL.AM004.avgScore !== undefined ){
            result.avg = this.detailReportAL.AM004.avgScore;
        }
        if( this.detailReportAL.AM004.AM004001 !== undefined ||
            this.detailReportAL.AM004.AM004001.msmtScore !== undefined ||
            this.detailReportAL.AM004.AM004001.asesCtt !== undefined ){
               result.value[0].score =  this.detailReportAL.AM004.AM004001.msmtScore;
               result.value[0].comment =  this.detailReportAL.AM004.AM004001.asesCtt;
        }
        if( this.detailReportAL.AM004.AM004002 !== undefined ||
            this.detailReportAL.AM004.AM004002.msmtScore !== undefined ||
            this.detailReportAL.AM004.AM004002.asesCtt !== undefined ){
               result.value[1].score =  this.detailReportAL.AM004.AM004002.msmtScore;
               result.value[1].comment =  this.detailReportAL.AM004.AM004002.asesCtt;
        }
        return result;
    }

    getBookinfo( idx: number ): { progressRate: Array<number>; progressLabel: Array<number>; score: number; grade: string; notCompleted: Array<string> } {
        const result = {
            progressRate: [50,50],
            progressLabel: [0,0],
            score: 0,
            grade: "-",
            notCompleted: []
        }
        if( this.detailReportAL == null ) return result
        if( idx == 0 ){
            if( this.detailReportAL.AM001 === undefined ) return result
            if( this.detailReportAL.AM001.progressRate === undefined ) return result
            result.progressRate = this.detailReportAL.AM001.progressRate;
            result.progressLabel = [
                this.detailReportAL.AM001.AM001001.msmtScore,
                this.detailReportAL.AM001.AM001002.msmtScore,
            ]
            if( this.detailReportAL.AM001.total === undefined ) return result
            result.score = this.detailReportAL.AM001.total.score;
            result.grade = this.detailReportAL.AM001.total.grade;
            result.notCompleted = this.detailReportAL.AM001.total.notCompleted;            
        }else if( idx == 1 ){
            if( this.detailReportAL.AM002 === undefined ) return result
            if( this.detailReportAL.AM002.progressRate === undefined ) return result
            result.progressRate = this.detailReportAL.AM002.progressRate;
            result.progressLabel = [
                this.detailReportAL.AM002.AM002001.msmtScore,
                this.detailReportAL.AM002.AM002002.msmtScore,
            ]
            if( this.detailReportAL.AM002.total === undefined ) return result
            result.score = this.detailReportAL.AM002.total.score;
            result.grade = this.detailReportAL.AM002.total.grade;
            result.notCompleted = this.detailReportAL.AM002.total.notCompleted;            
        }else if( idx == 2 ){
            if( this.detailReportAL.AM003 === undefined ) return result
            if( this.detailReportAL.AM003.progressRate === undefined ) return result
            result.progressRate = this.detailReportAL.AM003.progressRate;
            result.progressLabel = [
                this.detailReportAL.AM003.AM003001.msmtScore,
                this.detailReportAL.AM003.AM003002.msmtScore,
            ]
            if( this.detailReportAL.AM003.total === undefined ) return result
            result.score = this.detailReportAL.AM003.total.score;
            result.grade = this.detailReportAL.AM003.total.grade;
            result.notCompleted = this.detailReportAL.AM003.total.notCompleted;            
        }else if( idx == 3 ){
            if( this.detailReportAL.AM004 === undefined ) return result
            if( this.detailReportAL.AM004.progressRate === undefined ) return result
            result.progressRate = this.detailReportAL.AM004.progressRate;
            result.progressLabel = [
                this.detailReportAL.AM004.AM004001.msmtScore,
                this.detailReportAL.AM004.AM004002.msmtScore,
            ]
            if( this.detailReportAL.AM004.total === undefined ) return result
            result.score = this.detailReportAL.AM004.total.score;
            result.grade = this.detailReportAL.AM004.total.grade;
            result.notCompleted = this.detailReportAL.AM004.total.notCompleted;            
        }
        return result;
    }

    get talentLabels(): Array<string>{
        const result = ["--","--","--","--"]
        return ['정보이해', '객체조립', '공통성 파악', '수용 어휘'];
    }

    get selfData(): Array<number>{
        if( this.detailReportAL == null ) return [0,0,0,0]
        return [
            this.detailReportAL.xpndIntllctlTalent.AM005001.msmtScore,
            this.detailReportAL.xpndIntllctlTalent.AM006001.msmtScore,
            this.detailReportAL.xpndIntllctlTalent.AM007001.msmtScore,
            this.detailReportAL.xpndIntllctlTalent.AM008001.msmtScore,
        ]
    }
    get avgData(): Array<number>{
        if( this.detailReportAL == null ) return [0,0,0,0]
        return [
            this.detailReportAL.xpndIntllctlTalent.AM005001.avgScore,
            this.detailReportAL.xpndIntllctlTalent.AM006001.avgScore,
            this.detailReportAL.xpndIntllctlTalent.AM007001.avgScore,
            this.detailReportAL.xpndIntllctlTalent.AM008001.avgScore,
        ]
    }
    get comments(): Array<string>{
        if( this.detailReportAL == null ) return ['','','','']
        return [
            this.detailReportAL.xpndIntllctlTalent.AM005001.asesCtt,
            this.detailReportAL.xpndIntllctlTalent.AM006001.asesCtt,
            this.detailReportAL.xpndIntllctlTalent.AM007001.asesCtt,
            this.detailReportAL.xpndIntllctlTalent.AM008001.asesCtt,
        ]
    }
    //--------------------------------------
    async mounted(){
        //
        console.log( this.idx, this.level, this.slotInfo )
        if( this.slotInfo != null || this.slotInfo.lrngSttcSeqno !== undefined || this.slotInfo.lrngSttcSeqno>=0 ){
            await ParentSetupModule.getDetailReportAL( {lrngSttcSeqno: this.slotInfo.lrngSttcSeqno })
            console.log( ParentSetupModule.detailReportAL );
        }
    }

    _close(){
        this.$emit("onClose");
    }
    
}
</script>
 