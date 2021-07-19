<template>
<div class="TalentInfo">
    <div class="panel">
        <div class="row">
            <span class="title">확장 지적 재능</span>
        </div>
        
        <div class="colcenter">
            <LineGraph 
                :data="[
                    { color:'#bbbbbb', data: this.avgData },
                    { color:'#ff454d', data: this.selfData },
                    // { color:'#0F0', data:[25, 42, 73, 74 ] },
                ]"
                height="300"
                width="600"
                :labels=" this.labels"
                />
            <div class="row">
                <img src="img/parent/line_grey.png"/><span>평균</span> 
                <img src="img/parent/line_red.png" style="margin-left:20px"/><span>{{this.name}}</span>
            </div>
        </div>
        
        <div class="row" style="margin-top:20px;"><span class="subject">정보 이해</span></div>
        <div class="row"> <span class="comment">
            {{ this.comments[0]}}
            </span></div>
        <div class="row"><span class="subject">객체 조립</span></div>
        <div class="row"> <span class="comment">
            {{ this.comments[1]}}
            </span></div>
        <div class="row"><span class="subject">공통성 파악</span></div>
        <div class="row"> <span class="comment">
            {{ this.comments[2]}}
            </span></div>
        
        <div class="row"><span class="subject">수용 어휘</span></div>
        <div class="row"> <span class="comment">
            {{ this.comments[3]}}
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
        margin: 0 0 10px;
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
        margin-top: 20px;
        padding: 46px 50px;

        width: 620px;

        border-radius: 20px;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
        background-color: #FFF;
        box-sizing: border-box;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import LineGraph from "./LineGraph.vue"

@Component({
    components:{
        LineGraph,
    }
})
export default class TalentInfo extends Vue {
    @Prop({ default: '#FCC' }) private fontcolor: string;
    @Prop({ default: '' }) private name: string;
    @Prop({ default: ()=>["--","--","--","--"] }) private labels: string;
    @Prop({ default: ()=>[0,0,0,0] }) private selfData: Array<number>;
    @Prop({ default: ()=>[0,0,0,0] }) private avgData: Array<number>;
    @Prop({ default: ()=>['','','',''] }) private comments: Array<number>;
    
    mounted(){
        // this._drawProc();
    }

    
}
</script>