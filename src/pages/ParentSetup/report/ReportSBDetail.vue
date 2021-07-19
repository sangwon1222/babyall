<template>
    <div class="ReportSBDetail">
        <div class="topMenu">
            <div class="row">
                <div class="menuBTN"> <img style="height:100%;" src="img/parent/btn_pre.png" @click.stop="_close()"/></div>
                <div class="title"><span class="cap">Lv.{{this.level}}</span> {{this.idx}}</div>
            </div>
        </div>

        <div class="contents">
            <div class="row center">
                <div class="group">
                    <div>
                        <div class="info"><span class="subject">발행일</span> <span class="value">{{this.sttcCreDate}}</span></div>
                        <div class="info" ><span class="subject">나      이</span> <span class="value">{{this.childAge}}세</span> </div>
                        <div class="info"><span class="subject">이      름</span> <span class="value">{{this.childNm}}</span> </div>
                        <div class="info"><span class="subject">읽은책</span> <span class="value">{{this.cpltBookListLabel}}</span> </div>
                    </div>
                </div>
            </div>
        
            <div class="row center">
                <div class="group" style="padding: 45px 50px 0;" >
                    <h1 style="letter-spacing:-0.1rem;">영역 평가</h1>
                    <div class="user"><img src="img/parent/line_pink.png"/>{{this.childNm}}</div>
                    <div class="theOther"><img src="img/parent/line_grey.png"/>다른 학생들</div>
                    <DirGraph 
                    style="margin:20px 0 0 -20px;"
                    :data="[
                        { color:'#AAA', data: this.areaInfoAvg },
                        { color:'#F00', data: this.areaInfoSelf },
                    ]"
                    size="580"
                    :labels="this.areaInfoLabel"
                    />
                </div>
            </div>

            <SectionInfo title="어휘 영역" color="#00a0e9" fontcolor="#005982" :percent=" this.section1.avg "
                :data="[
                    {label:'철자', value:this.section1.value[0].score, max: 100, comment:this.section1.value[0].comment},
                    {label:'음절', value:this.section1.value[1].score, max: 100, comment:this.section1.value[1].comment},
                ]" 
                />
            <SectionInfo title="듣기 영역" color="#ae4fff" fontcolor="#490582"  :percent=" this.section2.avg "
                :data="[
                    {label:'소리와 의미연결', value:this.section2.value[0].score, max: 100, comment:this.section2.value[0].comment},
                    {label:'이해력', value:this.section2.value[1].score, max: 100, comment:this.section2.value[1].comment},
                ]" 
                />
            <SectionInfo title="읽기 영역" color="#00c641" fontcolor="#00852c" :percent=" this.section3.avg "
                :data="[
                    {label:'문자 인지', value:this.section3.value[0].score, max: 100, comment:this.section3.value[0].comment},
                    {label:'이해력', value:this.section3.value[1].score, max: 100, comment:this.section3.value[1].comment},
                ]" 
                />
            <SectionInfo title="말하기 영역" color="#ff8f21" fontcolor="#943f06" :percent=" this.section4.avg "
                :data="[
                    {label:'맥락 이래', value:this.section4.value[0].score, max: 100, comment:this.section4.value[0].comment},
                    {label:'대화', value:this.section4.value[1].score, max: 100, comment:this.section4.value[1].comment},
                ]" 
                />
            
            
            <BookInfoSB v-for="(info,idx) of this.dtlAsesInfo" :key="idx" 
                :dataset="[
                    { color:'#00c641', label: info.progressValue[0],
                        start:0,
                        end: ( 360*( info.progressRate[0]/100 ) ) },
                    { color:'#ae4fff', label: info.progressValue[1],
                        start: ( 360*( info.progressRate[0]/100 ) ),
                        end: ( 360*( (info.progressRate[0]+info.progressRate[1])/100 ) ) },
                    { color:'#00a0e9', label: info.progressValue[2],
                        start:  ( 360*( (info.progressRate[0]+info.progressRate[1])/100 ) ),
                        end:    ( 360*( (info.progressRate[0]+info.progressRate[1]+info.progressRate[2])/100 ) ) },
                    { color:'#ff8f21', label: info.progressValue[3],
                        start:  ( 360*( (info.progressRate[0]+info.progressRate[1]+info.progressRate[2])/100 ) ),
                        end:    ( 360*( (info.progressRate[0]+info.progressRate[1]+info.progressRate[2]+info.progressRate[3])/100 ) )},
                ]"
                :title="info.bookTitle"
                :grade="info.total.grade"
                :score="info.total.score"
                :cntntUndstdg="info.cntntUndstdg"
                :quizCorrectRate="info.quizCorrectRate"
                :lrngWords="info.lrngWords"
            />
            
            <TalentInfo 
                :data="this.talentInfoData"
                :bookIDList="this.bookIDList"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ReportSBDetail{
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
            width: 100px;
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
        height: 90px;
        position: fixed;
        top: 0;
        z-index: 100;
        #topBTN{
            position:absolute;
            top:110px;
            right:90px;
            width:90px;
            height:90px;
            cursor: pointer;
            &::before{
                content:"";
                display:block;
                margin-top:12px;
                margin-left:12px;
                width:50px;
                height:50px;
                border-bottom: 4px black solid;
                border-right: 4px black solid;
                transform: rotate(45deg);
            }
        }
    }
    .menuBTN{
         width:3rem; 
         cursor:pointer; 
         margin:0.8rem 1rem;
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
    padding: 24px 50px;
    border-radius: 20px;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
    margin-top: 20px;
    box-sizing: border-box;
    /* cursor: pointer; */
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
        top:150px;
        left:50px;
        z-index:1000;
        display:flex;
        align-items: center;
    }
    .theOther{
        top:200px;
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
import BookInfoSB from "../components/BookInfoSB.vue"
import TalentInfo from "../components/TalentInfo.vue"

import { ParentInfo } from '@/store/Define';
import { ParentSetupModule } from '@/store/ParentSetup';
import gsap from 'gsap';

@Component({
    components:{
        Graph,
        DirGraph,
        SectionInfo,
        BookInfoSB,
        TalentInfo
    }
})
export default class ReportSBDetail extends Vue {
    @Prop( {default:null}) private slotInfo: ParentInfo.SBReportSlot;
    @Prop( {default:"1st"}) private idx: string;
    @Prop( {default:0}) private level: number;

    get detailReportSB(): ParentInfo.DetailReportSB{
        return ParentSetupModule.detailReportSB;
    }

    get sttcCreDate(): string{
        if( this.detailReportSB == null ) return "--"
        return this.detailReportSB.sttcCreDate;
    }
    get childAge(): number{
        if( this.detailReportSB == null ) return 0
        return this.detailReportSB.childAge;
    }
    get childNm(): string{
        if( this.detailReportSB == null ) return '--'
        return this.detailReportSB.childNm;
    }
    
    get cpltBookListLabel(): string{
        let result = "";
        if( this.detailReportSB == null ) return "--"
        for( const v of this.detailReportSB.cpltBookList){
            result += `${Math.floor(v/1000)}-${v%1000}`;
            if( this.detailReportSB.cpltBookList.indexOf(v) < 3 ){
                result += ", ";
            }
        }
        return result;
    }

    get areaInfoLabel(): Array<string>{
        if( this.detailReportSB == null ) return [ "--", "--", "--", "--" ];        
        return [ 
            this.detailReportSB.asesByArea[0].acvtMsmtNm,
            this.detailReportSB.asesByArea[1].acvtMsmtNm,
            this.detailReportSB.asesByArea[2].acvtMsmtNm,
            this.detailReportSB.asesByArea[3].acvtMsmtNm,
        ]
    }
    
    get areaInfoSelf(): Array<number>{
        if( this.detailReportSB == null ) return [0,0,0,0];        
        return [ 
            this.detailReportSB.asesByArea[0].acvtMsmtScore,
            this.detailReportSB.asesByArea[1].acvtMsmtScore,
            this.detailReportSB.asesByArea[2].acvtMsmtScore,
            this.detailReportSB.asesByArea[3].acvtMsmtScore,
        ]
    }
    get areaInfoAvg(): Array<number>{
        if( this.detailReportSB == null ) return [0,0,0,0];        
        return [ 
            this.detailReportSB.asesByArea[0].acvtMsmtAvgScore,
            this.detailReportSB.asesByArea[1].acvtMsmtAvgScore,
            this.detailReportSB.asesByArea[2].acvtMsmtAvgScore,
            this.detailReportSB.asesByArea[3].acvtMsmtAvgScore,
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

        if( this.detailReportSB == null ) return result
        if( this.detailReportSB.AM009 === undefined ) return result
        if( this.detailReportSB.AM009.avgScore !== undefined ){
            result.avg = this.detailReportSB.AM009.avgScore;
        }
        if( this.detailReportSB.AM009.AM009001 !== undefined ||
            this.detailReportSB.AM009.AM009001.msmtScore !== undefined ||
            this.detailReportSB.AM009.AM009001.asesCtt !== undefined ){
               result.value[0].score =  this.detailReportSB.AM009.AM009001.msmtScore;
               result.value[0].comment =  this.detailReportSB.AM009.AM009001.asesCtt;
        }
        if( this.detailReportSB.AM009.AM009002 !== undefined ||
            this.detailReportSB.AM009.AM009002.msmtScore !== undefined ||
            this.detailReportSB.AM009.AM009002.asesCtt !== undefined ){
               result.value[1].score =  this.detailReportSB.AM009.AM009002.msmtScore;
               result.value[1].comment =  this.detailReportSB.AM009.AM009002.asesCtt;
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

        if( this.detailReportSB == null ) return result
        if( this.detailReportSB.AM010 === undefined ) return result
        if( this.detailReportSB.AM010.avgScore !== undefined ){
            result.avg = this.detailReportSB.AM010.avgScore;
        }
        if( this.detailReportSB.AM010.AM010001 !== undefined ||
            this.detailReportSB.AM010.AM010001.msmtScore !== undefined ||
            this.detailReportSB.AM010.AM010001.asesCtt !== undefined ){
               result.value[0].score =  this.detailReportSB.AM010.AM010001.msmtScore;
               result.value[0].comment =  this.detailReportSB.AM010.AM010001.asesCtt;
        }
        if( this.detailReportSB.AM010.AM010002 !== undefined ||
            this.detailReportSB.AM010.AM010002.msmtScore !== undefined ||
            this.detailReportSB.AM010.AM010002.asesCtt !== undefined ){
               result.value[1].score =  this.detailReportSB.AM010.AM010002.msmtScore;
               result.value[1].comment =  this.detailReportSB.AM010.AM010002.asesCtt;
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

        if( this.detailReportSB == null ) return result
        if( this.detailReportSB.AM011 === undefined ) return result
        if( this.detailReportSB.AM011.avgScore !== undefined ){
            result.avg = this.detailReportSB.AM011.avgScore;
        }
        if( this.detailReportSB.AM011.AM011001 !== undefined ||
            this.detailReportSB.AM011.AM011001.msmtScore !== undefined ||
            this.detailReportSB.AM011.AM011001.asesCtt !== undefined ){
               result.value[0].score =  this.detailReportSB.AM011.AM011001.msmtScore;
               result.value[0].comment =  this.detailReportSB.AM011.AM011001.asesCtt;
        }
        if( this.detailReportSB.AM011.AM011002 !== undefined ||
            this.detailReportSB.AM011.AM011002.msmtScore !== undefined ||
            this.detailReportSB.AM011.AM011002.asesCtt !== undefined ){
               result.value[1].score =  this.detailReportSB.AM011.AM011002.msmtScore;
               result.value[1].comment =  this.detailReportSB.AM011.AM011002.asesCtt;
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

        if( this.detailReportSB == null ) return result
        if( this.detailReportSB.AM012 === undefined ) return result
        if( this.detailReportSB.AM012.avgScore !== undefined ){
            result.avg = this.detailReportSB.AM012.avgScore;
        }
        if( this.detailReportSB.AM012.AM012001 !== undefined ||
            this.detailReportSB.AM012.AM012001.msmtScore !== undefined ||
            this.detailReportSB.AM012.AM012001.asesCtt !== undefined ){
               result.value[0].score =  this.detailReportSB.AM012.AM012001.msmtScore;
               result.value[0].comment =  this.detailReportSB.AM012.AM012001.asesCtt;
        }
        if( this.detailReportSB.AM012.AM012002 !== undefined ||
            this.detailReportSB.AM012.AM012002.msmtScore !== undefined ||
            this.detailReportSB.AM012.AM012002.asesCtt !== undefined ){
               result.value[1].score =  this.detailReportSB.AM012.AM012002.msmtScore;
               result.value[1].comment =  this.detailReportSB.AM012.AM012002.asesCtt;
        }
        return result;
    }
        
    get dtlAsesInfo(): Array<ParentInfo.BookReportDetail>{
        if( this.detailReportSB == null ) return [];
        if( this.detailReportSB.dtlAsesInfo === undefined ) return [];
        return this.detailReportSB.dtlAsesInfo;
        
    }

    get talentInfoData(): Array<ParentInfo.SBTalentInfo>{
        if( this.detailReportSB == null ) return [];
        if( this.detailReportSB.xpndIntllctlTalent === undefined ) return [];
        
        return [
            this.detailReportSB.xpndIntllctlTalent.AM013001,
            this.detailReportSB.xpndIntllctlTalent.AM014001,
            this.detailReportSB.xpndIntllctlTalent.AM015001
        ];
    }

    get bookIDList(): Array<number>{
        if( this.detailReportSB == null ) return [1001,1001,1001,1001]
        if( this.detailReportSB.dtlAsesInfo === undefined ) return [1001,1001,1001,1001]
        console.log( this.detailReportSB.dtlAsesInfo );
        return [
            this.detailReportSB.dtlAsesInfo[0]?this.detailReportSB.dtlAsesInfo[0].bookID:1001,
            this.detailReportSB.dtlAsesInfo[1]?this.detailReportSB.dtlAsesInfo[1].bookID:1001,
            this.detailReportSB.dtlAsesInfo[2]?this.detailReportSB.dtlAsesInfo[2].bookID:1001,
            this.detailReportSB.dtlAsesInfo[3]?this.detailReportSB.dtlAsesInfo[3].bookID:1001,            
        ]
        
    }
    //----------------------

    async mounted(){
        if( this.slotInfo != null || this.slotInfo.lrngSttcSeqno !== undefined || this.slotInfo.lrngSttcSeqno>=0 ){
            ParentSetupModule.getDetailReportSB( {lrngSttcSeqno: this.slotInfo.lrngSttcSeqno })
        }
        window.scrollTo(0,0);
    }
    
    _close(){
        this.$emit("onClose");
    }
    
    private getBookCoverImagePath( bookid: number){
        return `${Util.Config.packageURL}/bookcover/${bookid}_cover.png`
    }

}
</script>
 