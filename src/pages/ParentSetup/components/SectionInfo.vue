<template>
<div class="SectionInfo">
    <div class="panel">
        <h1 class="title" style="margin-bottom:22px;">{{title}}</h1>
        <div class="row center" style="margin-bottom:35px;">
            <Graph 
                ref="graph"
                :value="this.percent"
                height="34"
                :color="color"
                bgcolor="#FFF"
                labelcolor="#FFF"
                style="width:100%"
                />
        </div>
        <div class="description" 
            :style="`--font-color:${fontcolor}`"
            v-for="(info, idx) in data"
            :key="idx" 
            >
            <div class="row">
                <div class="marker" />
                <div class="lineValue">
                    <div class="title">{{info.label}}</div>
                    <div class="value">( <span>{{info.value}}</span>/{{info.max}}  )</div>
                </div>
            </div>
            <div class="row"> <span class="comment">{{info.comment}}</span></div>
        </div>
        
    </div>

</div>
</template>


<style lang="scss" scoped>
.SectionInfo {
    width:100%;
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .title{
        
        letter-spacing:-0.1rem;
        font-family: 'Noto sans';
        font-size: 28px;
        font-weight: bold;
    }

    .panel{
        background-color: #FFF;
        width: 620px;
        padding: 46px 50px ;
        border-radius: 20px;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
        margin-top: 20px;
        box-sizing: border-box;
        .description{
            // border: 1px solid #F00;
            margin: 20px;
            margin-bottom: 10px;
            width: 90%;
            display:flex;
            flex-direction: column;
            .row{
                // border: 1px solid #F00;
                display:flex;
                flex-direction: row;
                align-items: center;
            }
            .lineValue{
                width:100%; 
                display:flex;
                flex-direction: row;
                align-items: center;
            }
            // align-items: center; 
            .title{
                font-family: 'Noto sans';
                font-size: 1.2rem;
                color: var(--font-color);
            }
            .value{
                flex:1;
                text-align: right;
                font-family: 'Noto sans';
                font-size: 1.2rem;
                color: #000;
                span{
                    font-family: 'Noto sans';
                    font-size: 1.2rem;
                    color:#e64d7a;
                }
            }
            .marker {
                display:block;
                // margin-left: -1.3em; /* same as padding-left set on li */
                width: 10px;
                height: 10px;
                margin-right: 10px;
                border-radius: 20px;
                border:6px var(--font-color) solid;
                box-sizing: border-box;
                /* background-color:var(--font-color); */
            }
            .comment{
                padding: 20px 0 0;
                font-family: 'Noto sans';
                font-size: 1.2rem;
                color: #848484;
            }
        }
        
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Graph from "./Graph.vue"

interface InfoType{
    label: string;
    value: number;
    max: number;
    comment: string;
}

@Component({
    components:{
        Graph,
    }
})
export default class SectionInfo extends Vue {
    @Prop({ default: '#CCC' }) private fontcolor: string;
    @Prop({ default: '#CCC' }) private color: string;
    @Prop({ default: 0 }) private percent: number;
    @Prop({ default: '' }) private title: string;
    @Prop({ default: [] }) private data: Array<InfoType>;
    
    mounted(){
        // this._drawProc();
    }

    
}
</script>