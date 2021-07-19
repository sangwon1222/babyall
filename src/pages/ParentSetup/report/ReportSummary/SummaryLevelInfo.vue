<template>
<div class="sumLevelInfo">
    <div style="background-color:#ccc; width: 100%;height:2px;margin-bottom:52px; " />
    <div class="row"><img :src="`img/parent/${labelImage}`" /></div>
    <div v-if="this.info!=null">
        <div class="row" style="margin:16px 0 70px;"> 
            <div class="col"> 
                <div class="roundTitle">진도율</div>
                <CircleGraph 
                    :data="[ this.progressRateGraphData ]"
                    :borderColor="'#ff454d'"
                    borderWidth="5"
                    fontsize="25"
                    size="200"
                    />
            </div>

            <div class="col"> 
                <div class="roundTitle">평균 성취도</div>
                <StarGraph 
                    :data=" this.averageAchvGraphData "
                    :colors="[ '#ff8085', '#c9c9c9' ]"
                    height="250"
                    width="250"
                    :labels="['자녀', '평균']"
                    />
            </div>
        </div>
        
        <h1 style="margin-bottom:20px;">진도</h1>
        <ul>
            <li class="li2"><span class="title" style="color:#5195ff;">스토리북스</span><span class="value">{{this.storybookProgressLabel}}</span></li>
            <Graph 
                :value="this.storybookProgressPercent"
                height="34"
                color="#5195ff"
                bgcolor="#FFF"
                labelcolor="#FFF"
                style="width:100%"
                />
        </ul>
        <ul>
            <li class="li2"><span class="title" style="color:#5195ff;">알파벳스쿨</span><span class="value">{{this.alphabetProgressLabel}}</span></li>
            <Graph 
                :value="this.alphabetProgressPercent"
                height="34"
                color="#5195ff"
                bgcolor="#FFF"
                labelcolor="#FFF"
                style="width:100%"
                />
        </ul>
                
        <h1 style="margin:50px 0 30px;">성취</h1>
        <ul>
            <li class="li2"><span class="title" style="color:#5195ff;">단어</span><span class="value">{{this.wrdAchvmntsLabel}}</span></li>
            <Graph 
                :value="this.wrdAchvmntsPercent"
                height="34"
                color="#5195ff"
                bgcolor="#FFF"
                labelcolor="#FFF"
                style="width:100%"
                />
        </ul>
        <ul>
            <li class="li2"><span class="title" style="color:#5195ff;">표현</span><span class="value">{{this.xprsAchvmntsLabel}}</span></li>
            <Graph 
                :value="this.xprsAchvmntsPercent"
                height="34"
                color="#5195ff"
                bgcolor="#FFF"
                labelcolor="#FFF"
                style="width:100%"
                />
        </ul>
    </div>
    <div class="row" v-if="this.info==null"> 
        <span> 활동 기록이 없습니다.</span>
    </div>
</div>
</template>

<style lang="scss" scoped>
.sumLevelInfo{
    margin-top: 20px;
    padding: 20px 0;
    border-radius: 20px;
    /* border: 5px solid #EEE; */

}
.row{
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
    justify-content: space-between;
    height:290px;
    padding: 0 10px 0;
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
.roundTitle{
    background-color: #EEE;
    display: inline-block;
    padding: 5px 30px;
    /* min-width: 100px; */
    text-align: center;
    border-radius: 40px;
    color: #000;
    font-family: 'Noto sans';
    font-size: 1.2rem;
    margin: 10px;
}
li{
    // border: 1px solid #F00;
    margin-bottom: 10px;
    width: 100%;
    display:flex;
    flex-direction: row;
    align-items: center;
    letter-spacing: -0.1rem;
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
    width: 16px;
    margin:0 30px 0 0;
    height: 16px;
    border-radius: 20px;
    background-color: #f05574;
}
.li2{
    margin:0;
}
.li2:before{
    content: "";
    display:block;
    width: 10px;
    height: 10px;
    margin:0 10px 0 0;
    border-radius: 20px;
    /* background-color:#153d8f; */
    border:6px #153d8f solid;
    box-sizing: border-box;
    background-color:none;
}

.btn{
    background-color: #ff454d;
    cursor: pointer;
    display: inline-block;
    padding: 10px;
    min-width: 100px;
    text-align: center;
    border-radius: 40px;
    padding-left: 20px;
    padding-right: 20px;
    color: #FFF;
    font-family: 'Noto sans';
    font-weight: bold;
    margin: 10px;
}

</style>

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";

import Graph from "../../components/Graph.vue"
import CircleGraph from "../../components/CircleGraph.vue"
import StarGraph from "../../components/StarGraph.vue"

import { ParentSetupModule } from '@/store/ParentSetup';
import Util from '@/Util';
import { ParentInfo } from '@/store/Define';

@Component({
    components:{
        Graph,
        CircleGraph,
        StarGraph,
    }
})
export default class ReportSummary extends Vue {
    @Prop({default:'lv1.png'}) private labelImage: string;
    @Prop({default:()=>null})   private info: ParentInfo.ActSummaryLevelInfo;

    get progressRateGraphData(): { start: number; end: number; color: string }{
        if( this.info == null ) return { start: 0, end: 0, color: '#ff454d'}
        const end = 360 * (this.info.progressRate / 100 );
        return { start: 0, end: end, color: '#ff454d'}
    }
    get averageAchvGraphData(): Array<number>{
        if( this.info == null ) return [0,0]
        return [this.info.childAchvmnts*10, this.info.avgAchvmnts*10]
    }

    get storybookProgressLabel(): string{
        if( this.info == null ) return "(0권 / 0권)"
        return `( ${this.info.storybookProgress[0]}권 / ${this.info.storybookProgress[1]}권 )`
    }
    get storybookProgressPercent(): number{
        if( this.info == null ) return 0
        return Math.floor( (this.info.storybookProgress[0]/this.info.storybookProgress[1])* 100)
    }

    get alphabetProgressLabel(): string{
        if( this.info == null ) return "( 0개 / 0개 )"
        return `( ${this.info.alphabetProgress[0]}개 / ${this.info.alphabetProgress[1]}개 )`
    }
    get alphabetProgressPercent(): number{
        if( this.info == null ) return 0
        return Math.floor( (this.info.alphabetProgress[0]/this.info.alphabetProgress[1])* 100)
    }

    get wrdAchvmntsLabel(): string{
        if( this.info == null ) return "( 0개 / 0개 )"
        return `( ${this.info.wrdAchvmnts[0]}개 / ${this.info.wrdAchvmnts[1]}개 )`
    }
    get wrdAchvmntsPercent(): number{
        if( this.info == null ) return 0
        return Math.floor( (this.info.wrdAchvmnts[0]/this.info.wrdAchvmnts[1])* 100)
    }

    get xprsAchvmntsLabel(): string{
        if( this.info == null ) return "( 0개 / 0개 )"
        return `( ${this.info.xprsAchvmnts[0]}개 / ${this.info.xprsAchvmnts[1]}개 )`
    }
    get xprsAchvmntsPercent(): number{
        if( this.info == null ) return 0
        return Math.floor( (this.info.xprsAchvmnts[0]/this.info.xprsAchvmnts[1])* 100)
    }
    async mounted(){
        //
        // console.log("ReportSummary mounted")
        // await ParentSetupModule.getActSummaryReport();
        
    }
}
</script>
 