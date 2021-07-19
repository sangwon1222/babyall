<template>
<div class= "ActivitySalesKit" ref="ActivitySalesKit">
    <GameList v-show="mGameList" @showReport="_changeThema" />
    <Report v-show="mReport" @showGameList="_changeThema" />
</div>
</template>

<style lang="scss" scoped>
    .ActivitySalesKit{
        display:flex;
        justify-content: center;
        width:100%;
        background:white;
    }
</style>

<script lang = "ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameList from "@/App_Sales/GameList.vue"
import Report from "@/App_Sales/Report.vue"

@Component({
    components:{
        GameList,
        Report,
    }
})
export default class ActivitySalesKit extends Vue  {
    
    private mThema= "GameList"
    private mGameList = true;
    private mReport = !this.mGameList;
    $refs: {
        ActivitySalesKit: HTMLDivElement;
    }
    
    mounted(){
        window.addEventListener("resize",()=>{  this._calcScreen(this.$refs.ActivitySalesKit);  })
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
            /**레벨박스 플래그 */
            this.mReport = false;
        }
    }
}
</script>