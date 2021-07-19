<template>
<div class="BookInfo">
    <div class="panel">
        <div class="rowcenter"  style="margin-bottom:2rem;">
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
            <img :src="infoThumb" style="width:100%; margin:0.5rem 0" />
        </div>

        <div class="description"> 
            <div class="row">
                <div class="marker" />
                <div class="lineValue"> <div class="title">종합 평점</div> <div class="value">{{this.grade}}</div> </div>
            </div>
            <div class="row"> <span class="comment">{{this.score}}</span></div>

            <div class="row">
                <div class="marker" />
                <div class="lineValue"> <div class="title">내용 이해</div></div>
            </div>
            <div class="row"> <span class="comment">{{this.cntntUndstdg}}</span></div>

            <div class="row">
                <div class="marker" />
                <div class="lineValue"><div class="title">퀴즈 정답률</div></div>
            </div>
            <div class="row"> <span class="comment">{{this.quizCorrectRate}}%</span></div>

            <div class="row">
                <div class="marker" />
                <div class="lineValue"><div class="title">학습어휘</div></div>
            </div>
            <div class="row"> <span class="comment">{{this.lrngWordsString}}</span></div>

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
        width: 620px;
        box-sizing: border-box;
        padding: 46px 50px;
        border-radius: 20px;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
        margin-top: 20px;
        
        .description{
            // border: 1px solid #F00;
            padding:20px 0 ; 
            margin: 10px 0 0;
            width: 100%; 
            
            display:flex;
            flex-direction: column;

            border-radius: 20px;
            background-color: #f6f6f6;
            box-sizing:border-box;
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
                min-height:32px;
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
                margin: 0 0.5rem 0 2rem;
                width: 10px;
                height: 10px;
                border-radius: 40px;
                box-sizing: border-box;
                border: 6px #000 solid;
                /* background: #000; */
            }
            .comment{
                margin-left: 2.5rem;
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import Graph from "./Graph.vue"
import CircleGraph, { DataForm } from "./CircleGraph.vue"

@Component({
    components:{
        Graph,
        CircleGraph,
    }
})
export default class BookInfoSB extends Vue {
    @Prop({ default: '#FCC' }) private fontcolor: string;
    @Prop({ default: '' }) private title: string;
    @Prop({ default: 'img/parent/bookinfo.png' }) private infoThumb: string;
    @Prop({ default: ()=>[
            {start:0,end:45, color:'#00c641'},
            {start:45,end:130, color:'#ae4fff'},
            {start:130,end:200, color:'#00a0e9'},
            {start:200,end:360, color:'#ff8f21'},
        ] }) private dataset: Array<DataForm>;
    
    @Prop({default:0.0}) private score: number;
    @Prop({default:"X"}) private grade: string;
    @Prop({default:0.0}) private cntntUndstdg: number;
    @Prop({default:0}) private quizCorrectRate: number;
    
    @Prop({default:()=>[]}) private lrngWords: Array<string>;

    get lrngWordsString(): string{
        let result = "";
        for( const v of this.lrngWords){
            result += v;
            if( this.lrngWords.indexOf(v) < this.lrngWords.length-1 ){
                result += ", ";
            }
        }
        return result;
    }
    mounted(){
        // this._drawProc();
    }
    
}
</script>