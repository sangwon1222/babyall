<template>
<div class= "ActivityDemo" ref="ActivityDemo">
    <GameList v-show="mGameList" @showReport="_changeThema" />
    <Report v-show="mReport" @showGameList="_changeThema" />
</div>
</template>

<style lang="scss" scoped>
    .ActivityDemo{
        overflow: hidden;
        overflow-y: scroll;
        position:relative;
        top:0;
        left:0;
        width:100vw;
        height:100vh;
        box-sizing: border-box;
    }
    ::-webkit-scrollbar{display:none;}
</style>

<script lang = "ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameList from "@/App_Demo/GameList.vue"
import Report from "@/App_Demo/Report.vue"

@Component({
    components:{
        GameList,
        Report,
    }
})
export default class ActivityDemo extends Vue  {
    
    private mThema= "GameList"
    private mGameList = true;
    private mReport = !this.mGameList;
    $refs: {
        ActivityDemo: HTMLDivElement;
    }
    
    mounted(){
        // window.addEventListener("resize",()=>{  this._calcScreen(this.$refs.ActivityDemo);  })
    }
    _calcScreen(div: HTMLDivElement){
        div.style.width ="100%;"
    }
    _changeThema(){
        if (this.mThema == "GameList"){
            this.mThema = "Report"
            this.mGameList = false;
            this.mReport = true;
        }else{
            this.mThema = "GameList"
            this.mGameList = true;
            this.mReport = false;
        }
    }
}
</script>