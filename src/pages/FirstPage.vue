<template>
  <div class="FirstPage">
    <component :is="this.currentView" 
        @onChangeView="_changeView"
        @onSelectLevel="_setLevel"
        @onSelectMode="_setMode"
        @onSetPlayTime="_setPlayTime"
        @onSaveSetting="_saveSetting"
        />
    <img class="ci" src="img/firstconfig/aram_ci.png" />
  </div>
</template>

<style lang="scss" scoped>
.FirstPage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    position: relative;
    width: inherit;
    height: inherit;
    
    color: #fff;
    text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
    background: #cbe697;
}
.ci{
    position: absolute;
    top: 60px;
    left: 80px;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Intro from "./FirstPage/Intro.vue"
import Level from "./FirstPage/Level.vue"
import Mode from "./FirstPage/Mode.vue"
import PlayTimeLimit from "./FirstPage/PlayTimeLimit.vue"
import End from "./FirstPage/End.vue"
import { ChildSetting, PlayLevel, PlayMode } from '@/store/Define';
import { UserModule } from '@/store/UserStore';
import { SystemModule } from '@/store/System';
import { ParentSetupModule } from '@/store/ParentSetup';

@Component({
    components:{ 
        Intro,
        Level,
        Mode,
        PlayTimeLimit,
        End,
    }
})
export default class FirstPage extends Vue {
    private mRecommendLevel = 1;
    private mCurrentView = "Intro";
    private mChildSetting: ChildSetting={
        lrngChoLvlCd: PlayLevel.normal,
        lrngModeCd: PlayMode.step,
        playPosbTime: 30,
        isNonLimitToPlay: false
    }

    get currentView(): string{
        return this.mCurrentView
    }
    
    _changeView( name: string){
        console.log( name );
        this.mCurrentView = name;
    }

    _setLevel( v: number ){
        if( v == 1){
            this.mChildSetting.lrngChoLvlCd = PlayLevel.easy;
        }else if( v == 2){
            this.mChildSetting.lrngChoLvlCd = PlayLevel.normal;
        }else if( v == 3){
            this.mChildSetting.lrngChoLvlCd = PlayLevel.hard;
        }
        this.mCurrentView = "Mode"
    }

    _setMode( v: number ){
        if( v == 1){
            this.mChildSetting.lrngModeCd = PlayMode.free;
        }else if( v == 2){
            this.mChildSetting.lrngModeCd = PlayMode.step;
        }
        this.mCurrentView = "PlayTimeLimit"
    }

    _setPlayTime( v: number, isNonLimitToPlay: boolean ){
        this.mChildSetting.isNonLimitToPlay = isNonLimitToPlay; 
        this.mChildSetting.playPosbTime = v*60;
        this.mCurrentView = "End"
    }

    async _saveSetting(){
        console.log( "SettingTime:", this.mChildSetting.playPosbTime);
        await UserModule.setChildSetting( this.mChildSetting );
        // await ParentSetupModule.updateRemainTime( this.mChildSetting.playPosbTime );
        SystemModule.setCurrentPage("Lobby");
    }
}
</script>
