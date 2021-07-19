<template>
<div class="BookInfo">
    <div class="panel">
        <div class="rowcenter">
            <img src="img/parent/titlecover_start.png"/>
            <span class="title">{{title}}</span>
            <img src="img/parent/titlecover_end.png"/>
        </div>
        
        <div class="colcenter">
            <CircleGraph 
                :data="this.dataset"
                borderColor="#ededed"
                borderWidth="10"
                fontsize="20"
                size="350"
                />
            <img :src="infoThumb" />
        </div>

        <div class="description"> 
            <div class="row">
                <div class="marker" />
                <div class="lineValue">
                    <div class="title">종합 평가</div>
                    <div class="value">C</div>
                </div>
            </div>
            <div class="row"> <span class="comment">73.25</span></div>

            <div class="row">
                <div class="marker" />
                <div class="lineValue">
                    <div class="title">완성 어휘</div>
                    
                </div>
            </div>
            <div class="row"> <span class="comment">feet, arms, legs, hips</span></div>

            <div class="row">
                <div class="marker" />
                <div class="lineValue">
                    <div class="title">미완성 어휘</div>
                    
                </div>
            </div>
            <div class="row"> <span class="comment">hands</span></div>
        </div>
    </div>

</div>
</template>


<style lang="scss" scoped>
.BookInfo {
    width:100%;
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .rowcenter{
        // border: 1px solid #F00;
        width: 100%;
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
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

    .panel{
        background-color: #FFF;
        width: calc(660px - 40px);
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
        margin-top: 20px;
        
        .description{
            // border: 1px solid #F00;
            background-color: #f6f6f6;
            margin: 20px;
            margin-bottom: 10px;
            padding: 20px;
            padding-top: 40px;
            width: 90%;
            display:flex;
            flex-direction: column;
            border-radius: 20px;
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
                margin-left: 20px;
                background-color: #ff454d;
                padding: 5px;
                width: 32px;
                text-align: center;
                font-family: 'Noto sans';
                font-size: 1.2rem;
                font-weight: bold;
                color: #FFF;
                span{
                    font-family: 'Noto sans';
                    font-size: 1.2rem;
                    color:#e64d7a;
                }
            }
            .marker {
                display:block;
                margin-left: 2em; /* same as padding-left set on li */
                width: 20px;
                margin-right: 32px;
                height: 20px;
                border-radius: 20px;
                /* background-color:#000; */
                border:10px #000 solid;
                box-sizing:border-box;
            }
            .comment{
                margin-left: 70px;
                padding: 20px;
                padding-top: 10px;
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
import CircleGraph, { DataForm } from "./CircleGraph.vue"

@Component({
    components:{
        Graph,
        CircleGraph,
    }
})
export default class BookInfo extends Vue {
    @Prop({ default: '#FCC' }) private fontcolor: string;
    @Prop({ default: '' }) private title: string;
    @Prop({ default: 'img/parent/bookinfo.png' }) private infoThumb: string;
    @Prop({ default: ()=>[
            {start:0,end:45, color:'#00c641'},
            {start:45,end:130, color:'#ae4fff'},
            {start:130,end:200, color:'#00a0e9'},
            {start:200,end:360, color:'#ff8f21'},
        ] }) private dataset: Array<DataForm>;

    mounted(){
        // this._drawProc();
    }

    
}
</script>