<template>
    <div class="Report">
        <ReportSwiper 
            @onTabToSlide="_onSelecedTab"
            @openDetail="_openDetail"
            :subMenu="this.subMenu"
        />
        <!-- <component :is="this.subMenuName"/> -->
<!--         
        <StarGraph 
            :data="mStar"
            :colors="[ '#ff8085', '#c9c9c9' ]"
            height="400"
            width="300"
            :labels="['자녀', '평균']"
            />

        <LineGraph 
            :data="mDir2Data"
            height="400"
            width="720"
            :labels="['책 1-1', '책 1-12', '책 1-19', '책 2-6']"
            />

        <CircleGraph 
            :data="mCircleData"
            borderWidth="5"
            fontsize="20"
            size="250"
            />

        <CircleGraph 
            :borderColor="'#ff454d'"
            :data="mCircleData2"
            borderWidth="5"
            fontsize="25"
            size="250"
            />
        
        <DirGraph 
            :data="mDirData"
            size="600"
            :labels="['말하기', '어휘', '듣기', '읽기']"
            />
        
        <button @click="_onClickTemp">테스트</button>
        
        <Graph 
            ref="graph"
            :value="this.mTemp1"
            height="30"
            color="#f44336"
            bgcolor="#FFF"
            labelcolor="#FFF"
            style="width:50%"
            />
        <Slider 
            start="5분" end="150분" 
            cursorColor="#ff9f15"
            guageColor ="#4CAF50"
            bgColor="#C4C4C4"
            min="5"
            max="150"
            :init="this.mTimerValue"
            @onValueChanged="_onTimerChange"
            />         -->
    </div>
</template>

<style lang="scss" scoped>
.Report {
    overflow-y:scroll;
    position: relative;
    margin-top: 90px;
    
    width: 100%;
    height: 1280px;
    
    background-color: #f0f0f0;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
.Report::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}

</style>

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import Axios from "axios"

import ReportSummary from "./report/ReportSummary.vue"
import ReportAL from "./report/ReportAL.vue"
import ReportSB from "./report/ReportSB.vue"

import ReportSwiper from "@/pages/ParentSetup/ReportSwiper.vue"

@Component({
    components:{
        ReportSwiper,
        ReportSummary,
        ReportAL,
        ReportSB,
    }
})
export default class Report extends Vue {
    @Prop({default:'ReportSummary'}) subMenu: string;

    get subMenuName(): string{ 
        console.warn( "subMenuName:", this.subMenu );
        return this.subMenu
    }
    private mTimerValue = 30;

    private mTemp1 = 0;
    
    private mStar=[80,60];
    private mDirData = [
        { color:'#CCC', data:[50, 70, 50, 65 ] },
        { color:'#F00', data:[100, 20, 50, 30 ] },
    ]
    
    private mDir2Data = [
        { color:'#FC0', data:[50, 70, 50, 65 ] },
        { color:'#F00', data:[100, 20, 50, 30 ] },
        { color:'#00F', data:[10, 30, 60, 90 ] },
        // { color:'#0F0', data:[25, 42, 73, 74 ] },
    ]
    
    private mCircleData = [
        {start:0,end:45, color:'#00c641'},
        {start:45,end:130, color:'#ae4fff'},
        {start:130,end:200, color:'#00a0e9'},
        {start:200,end:360, color:'#ff8f21'},
    ]
    private mCircleData2 = [
        {start:0,end:200, color:'#ff454d'}
    ]

    // $refs!: {
    //     graph: Graph;
    // }
    async mounted(){
        //
        // const response = await Axios.post('https://api.arambookclub.com/babytube/getContentsList',{
        //     uid: "XXX",
        //     filter: "step1",
        //     bookID: "1001"
        // });
        // console.log( response );
    }
    
    // private _onScroll( evt ){
    //     console.log( "scroll")
    // }
    private _onSelecedTab(pageidx){
        let pageName ="ReportSummary"
        if(pageidx==0)pageName="ReportSummary";
        if(pageidx==1)pageName="ReportSB";
        if(pageidx==2)pageName="ReportAL";
        
        this.$emit("onSelecedTab",pageName)
    }
    _onClickTemp(){
        this.mTemp1 += 5
        // this.$refs.graph.updateValue();
    }

    _onTimerChange(v){
        this.mTimerValue = v;
        
    }
    _onClickBack(){
        this.$emit('onClickBack')
    }

    _onClickMenu(){
        this.$emit('onShowMainMenu')
    }
    _openDetail(flag: boolean){
        if(flag) this.$el.setAttribute('style',`margin-top:0; height:720px;` ); 
        else this.$el.setAttribute('style','margin-top:90px;  height: calc(100% -90px);');
    }
}
</script>
 