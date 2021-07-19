<!-- 부모 설정화면 -->
<template>
    <div class="ParentSetup">
        <TopMenu 
            @onShowMainMenu="_onShowMainMenu"
            @onShowSubMenu="_onShowSubMenu"
            @onClickBack="_onClickBack"
            :title="this.mCurrentTitle"
            :currentMenu="this.mCurrentSubView"
            />
        
        <component 
            :is="mCurrentView" 
            :subMenu="this.mCurrentSubView" 
            @onSelecedTab="_onShowSubMenu" 
        />
        <!-- <div class="UserConfig">
            <div>
                <p>레벨설정</p>
                <CheckGroup
                :datalist="mLevelList"
                @onSelectItem="_onSelectLevel"
                ></CheckGroup>
            </div>

            <div>
                <p>진행모드</p>
                
            </div>
            <div>
                <p>하루사용시간</p>
                
            </div>
            
            <button @click="_onClickClose">닫기</button>
        </div>
         -->
        
        <MainMenu 
            v-if="mIsShowMainMenu" 
            @onCloseMainMenu="_onCloseMainMenu"
            @onSelectMainMenu="_onSelectMainMenu"
            />
    </div>
</template>

<style lang="scss" scoped>
.ParentSetup {
    width: inherit;
    height: inherit;
    background:#FFF;
    // background: linear-gradient(#e66465, #e6649a);
    // background-image: url("/img/bg1.png");
    display: flex;
    // align-items: center;
    .vue-app {
        width: inherit;
        height: inherit;
    }
}

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import TopMenu from './ParentSetup/Topmenu.vue'
import MainMenu from './ParentSetup/MainMenu.vue'

import CheckGroup from "../components/CheckGroup.vue";
import { UserModule } from '../store/UserStore';
import Swal from 'sweetalert2'
import { SystemModule } from '../store/System';

import SetupChild from "./ParentSetup/SetupChild.vue"
import Report from "./ParentSetup/Report.vue"
import ParentMovie from './ParentSetup/ParentMovie.vue'
import { PlayLevel } from '@/store/Define';
import { ParentSetupModule } from '@/store/ParentSetup';

@Component({
    components:{
        TopMenu,
        MainMenu,

        SetupChild,
        Report,
        ParentMovie,

        CheckGroup
    }
})
export default class ParentSetup extends Vue {
    private mIsShowMainMenu = false;
    private mCurrentView = "Report"
    private mCurrentSubView = "ReportSummary"
    private mCurrentTitle = "활동 리포트"
    
    private mLevelList: Array<{ label: string; checked: boolean }>=[
        { label: "레벨1", checked: false },
        { label: "레벨2 -추천", checked: true },
        { label: "레벨3", checked: false }
    ];
    
    async mounted(){
        ParentSetupModule.getActSlotReport();
        
        if( UserModule.childSetting.lrngChoLvlCd == PlayLevel.easy ){
            this.mLevelList[0].checked = true;
        }else if( UserModule.childSetting.lrngChoLvlCd == PlayLevel.normal ){
            this.mLevelList[1].checked = true;
        }else if( UserModule.childSetting.lrngChoLvlCd == PlayLevel.hard ){
            this.mLevelList[2].checked = true;
        }        
    }
    
    private _onShowMainMenu(){
        this.mIsShowMainMenu = true;
    }
    private _onCloseMainMenu(){
        this.mIsShowMainMenu = false;
    }

    private _onClickBack(){
        SystemModule.setCurrentPage("Lobby");
    }

    private _onSelectMainMenu( command: string){
        console.log( "parentSetup._onSelectMainMenu()", command);
        if( command == "exitBabyAll"){
           //self.close();
           //window.open('', '_parent', '').close();
           //window.open('','_self').close();
            // parent.close()
            history.back();
        }else if( command=="report"){
            this.mCurrentView = "Report"
            this.mCurrentTitle = "활동 리포트"
        }else if( command=="setup"){
            this.mCurrentView = "SetupChild"
            this.mCurrentTitle = "자녀 설정"
        }else if( command=="movie"){
            this.mCurrentView = "ParentMovie"
            this.mCurrentTitle = "활용 영상"
        }
        // console.log(`도토리 클릭`)
        // SystemModule.popup.show( true , command);
    }
    
    private _onShowSubMenu( menu: string ){
        this.mCurrentSubView = menu;
    }
    private _onSelectLevel(idx) {
        if( idx == 0 ) UserModule.childSetting.lrngChoLvlCd = PlayLevel.easy; 
        else if( idx == 1 ) UserModule.childSetting.lrngChoLvlCd = PlayLevel.normal; 
        else if( idx == 2 ) UserModule.childSetting.lrngChoLvlCd = PlayLevel.hard; 
        UserModule.setChildSetting( UserModule.childSetting );
    }
    
    private _onClickApply(){
        Swal.fire({
            icon: 'success',
            title: 'Setup UserConfig',
            text: `정상적으로 처리되었습니다.`,
        });
    }
    private _onClickClose(){
        SystemModule.setCurrentPage("Lobby");
    }
}
</script>
