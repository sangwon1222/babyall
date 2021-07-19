<template>
<div class="TalentInfo">
    <div class="panel">
        <div class="row">
            <span class="title">확장 지적 재능</span>
        </div>
        
        <div class="colcenter">
            <LineGraph 
                :data="[
                    { color:'#F00', data:this.getScoreData(0) },
                    { color:'#FC0', data:this.getScoreData(1) },
                    { color:'#00F', data:this.getScoreData(2) },
                    // { color:'#0F0', data:[25, 42, 73, 74 ] },
                ]"
                height="300"
                width="600"
                :labels=" this.labels"
                />
        </div>
        
        <div class="row" style="margin-top:20px;"><img src="img/parent/line_red.png"/><span class="subject">확장 이해</span></div>
        <div class="row"> <span class="comment">
            <!-- 확장 이해 영역에서는 다소 불안정한 모습을 보이고 있습니다. 조금 더 집중이 필요합니다. -->
            {{this.getComment(0)}}
            </span></div>
        <div class="row"><img src="img/parent/line_yellow.png"/><span class="subject">객체 조립</span></div>
        <div class="row"> <span class="comment">
            <!-- 객체 조립 영역은 꾸준히 유지되는 모습을 보여 주었으나 조금 더 향상이 필요합니다. -->
            {{this.getComment(1)}}
            </span></div>
        <div class="row"><img src="img/parent/line_blue.png"/><span class="subject">정보 파악</span></div>
        <div class="row"> <span class="comment">
            <!-- 정보 파악 영역은 꾸준히 유지되는 모습을 보여 주었으나 조금 더 향상이 필요합니다. -->
            {{this.getComment(2)}}            
            </span></div>
                    
        
    </div>

</div>
</template>


<style lang="scss" scoped>
.TalentInfo {
    width:100%;
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .row{
        margin-top: 0;
        // border: 1px solid #F00;
        width: 100%;
        display:flex;
        flex-direction: row;
        align-items: center;
        // justify-content: center;
    }
    .colcenter{
        // border: 1px solid #F00;
        width: 100%;
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .title{
        font-family: 'Noto sans';
        font-size: 28px;
        font-weight: bold;

        display:flex;
        align-items: center;
    }

    .subject{
        font-family: 'Noto sans';
        font-size: 1.2rem;
        font-weight: bold;
        color: #000;
    }
    .comment{
            margin-bottom: 20px;
            /* padding: 20px; */
            font-family: 'Noto sans';
            font-size: 1.2rem;
            color: #848484;
            letter-spacing: -0.1rem;
        }
    
    .panel{
        background-color: #FFF;
        width: 620px;
        padding: 46px 50px;
        border-radius: 20px;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
        margin-top: 20px;
        box-sizing: border-box;
        
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import LineGraph from "./LineGraph.vue"
import { ParentInfo } from '@/store/Define';

@Component({
    components:{
        LineGraph,
    }
})
export default class TalentInfo extends Vue {
    @Prop({ default: '#FCC' }) private fontcolor: string;
    @Prop({ default: '' }) private title: string;
    @Prop({ default:()=>[]}) private data: Array<ParentInfo.SBTalentInfo>;
    @Prop({ default:()=>[1001,1001,1001,1001]}) private bookIDList: Array<number>;

    get labels(): Array<string>{
        //['책 1-1', '책 1-12', '책 1-19', '책 2-6']
        return [
            `책 ${ Math.floor(this.bookIDList[0]/1000)}-${this.bookIDList[0]%1000}`,
            `책 ${ Math.floor(this.bookIDList[1]/1000)}-${this.bookIDList[1]%1000}`,
            `책 ${ Math.floor(this.bookIDList[2]/1000)}-${this.bookIDList[2]%1000}`,
            `책 ${ Math.floor(this.bookIDList[3]/1000)}-${this.bookIDList[3]%1000}`,
        ]
    }
    mounted(){
        // this._drawProc();
    }

    getScoreData( idx: number ): Array<number>{
        if( this.data.length == 0) return [0,0,0,0]
        return this.data[idx].score;
    }
    getComment( idx: number ): string{
        if( this.data.length == 0) return "";
        return this.data[idx].asesCtt;
    }
    
}
</script>