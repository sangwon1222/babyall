<template>
    <div class="Lobby">
        <div class="vue-app" v-if=" !isShowCanvas || !showTubPlayerFlag">
            <ProfileBar 
                @goHome="selectHomeTab"
                @onClickParentSetup="_clickParentSetup" 
                @onShowActiveTime="_showActiveTime"
                @onSelectTab="selectHomeTab"
                :menu="menu" 
                />
                <LobbyList 
                    v-if=" !isShowCanvas || !showTubPlayerFlag"
                    :currentPage="this.pageIndex"
                    @onTabToSlide="_onSelecedTab"
                    @onShowBabyTube="this.showTubePlayer"
                    @onShowAlphabetSchool="_onShowAlphabetSchool"
                    @onSelectHomeMenu="_selectHomeMenu"
                    @onShowStoryBook="_onShowStoryBook"
                />
            <!-- <component
                v-if=" !isShowCanvas || !showTubPlayerFlag"
                :is="this.pageIndex"
                @onShowBabyTube="this.showTubePlayer"
                @onShowAlphabetSchool="_onShowAlphabetSchool"
                @onSelectHomeMenu="_selectHomeMenu"
                @onShowStoryBook="_onShowStoryBook"
                ></component> -->
            <!-- <TabPageNavi :menu="menu" @onSelectTab="selectHomeTab"  /> -->
            
            <ActiveTimePopup ref="ActiveTimePopup" />
            <RestartPopup />
            <ParentCheckPopup ref="ParentCheckPopup" />
            
        </div>
        
        <BabyTubePlayer
            v-if="showTubPlayerFlag"
            :filterData="this.babytubeFilterData"
            @onClose="_closeTube"
            ></BabyTubePlayer>

        <ActivityPlayer  
            v-if="isShowCanvas" 
			
            :category="mCurrentCategory"
			:level="currentLevel"
			:alphabet="mCurrentSymbol"
            :bookID="mCurrentBookID" 
            :activitySB="mCurrentActivity" 
			:isMobileMode="true"
			class="activityView" 
			@onClose="_closeActivity"
			></ActivityPlayer>
        
        <DemoEnd v-if="demoEnableFlag" />
        <DemoLevelChoice v-if="demoLevelChoiceFlag" />
    </div>
</template>

<style lang="scss" scoped>
.Lobby {
    width: inherit;
    height: inherit;
    background:#FFF;
    // background: linear-gradient(#e66465, #e6649a);
    // background-image: url("/img/bg1.png");
    display: flex;
    align-items: center;
    .vue-app {
        position:relative;
        width: inherit;
        height: inherit;
    }
}

.page {
    border: 1px dashed #f00;
    // align-self: center;
    width: inherit;
    h1 {
        width: inherit;
        color: #fff;
        text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        text-align: center;
    }  
}

.activityView{
    width: 720px;
    height: 1280px;
    position: absolute;
    // transform: rotate(90deg) translate(0px, 280px);
}

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { SystemModule } from '../store/System';
import { UserModule } from '../store/UserStore';

import ProfileBar from "./Lobby/components/ProfileBar.vue";
import TabPageNavi from "./Lobby/components/TabPageNavi.vue";

import Home from "./Lobby/Home.vue";
import StoryBook from "./Lobby/StoryBook.vue";
import AlphabetSchool from "./Lobby/AlphabetSchool.vue";
import BabyTube from "./Lobby/BabyTube.vue";
import LobbyList from "./Lobby/LobbyList.vue";

import BabyTubePlayer from "../player/BabyTubePlayer.vue";
import ActivityPlayer from "../player/ActivityPlayer.vue"

import { isMobilePlatform } from '@/Util/Platform';

import AppVue from '@/App.vue';
import { PlayLevel } from '@/store/Define';
import { ParentSetupModule } from '@/store/ParentSetup';

import ParentCheckPopup from "./Lobby/popup/ParentCheckPopup.vue"
import RestartPopup from "./Lobby/popup/RestartPopup.vue"
import ActiveTimePopup from "./Lobby/popup/ActiveTimePopup.vue"
import DemoEnd from "./Lobby/components/DemoEnd.vue"
import DemoLevelChoice from "./Lobby/components/DemoLevelChoice.vue"

@Component({
    components:{
        ProfileBar,
        TabPageNavi,
        
        LobbyList,
        Home,
        StoryBook,
        AlphabetSchool,
        BabyTube,

        BabyTubePlayer,
        ActivityPlayer,

        ParentCheckPopup,
        RestartPopup,
        ActiveTimePopup,
        DemoEnd,
        DemoLevelChoice,
    }
})

export default class Lobby extends Vue {
    
    private pageIndex = "Home";
    private isShowCanvas = false;
    private showTubPlayerFlag = false;
    private babyTubeFlag = false;
    private list: any;

    private menu = [
        {label:"홈", pageIDX:"Home", img:"btn1", selected:false},
        {label:"베이비튜브", pageIDX:"BabyTube", img:"btn4", selected:false },
        {label:"스토리", pageIDX:"StoryBook", img:"btn2", selected:false},
        {label:"알파벳스쿨" , pageIDX:"AlphabetSchool", img:"btn3", selected:false},
        {label:"맘앤대디" , pageIDX:"MomAndDaddy", img:"btn5", selected:false},
    ];
    
    private userinfo = {};
    private babytubeFilterData = {filter:"favorite"};
    private mCurrentCategory = "alphabet";
    private mCurrentSymbol = "A";
    private mCurrentBookID = "2004";
    private mCurrentActivitySB = "movie";
    
    get demoEnableFlag(){ 
        return !SystemModule.isDemoEnable 
    }
    get demoLevelChoiceFlag(){
        if( SystemModule.isDemoMode ==false ) return false;
        if( SystemModule.isDemoEnable == false ) return false;
        if( UserModule.demoLevel != -1 ) return false;
        return true;
    }
    get currentLevel(): number{
        if( SystemModule.isDemoMode== true ) {return UserModule.demoLevel;}
        if( UserModule.childSetting == null) {return 1;}
        else if( UserModule.childSetting.lrngChoLvlCd == PlayLevel.easy) {return 1;}
        else if( UserModule.childSetting.lrngChoLvlCd == PlayLevel.normal) {return 2;}
        else if( UserModule.childSetting.lrngChoLvlCd == PlayLevel.hard) {return 3;}
        return 0;
    }
    
    mounted(){
        //
    }

    private selectHomeTab(pageidx) {
        // console.log("->selectHomeTab:", pageidx);
        this.pageIndex = pageidx;
        let currentPage = 0;
        for (let i=0; i<this.menu.length; i++){
            if(this.menu[i].pageIDX == this.pageIndex)currentPage = i;
            this.menu[i].selected = false;
        }
        this.menu[currentPage].selected = true;
        //gsap.to('.page', {x:500, duration: 3})
    }
    private _onSelecedTab(pageidx){
        let pageName ="Home"
        if(pageidx==0)pageName="Home";
        if(pageidx==1)pageName="BabyTube";
        if(pageidx==2)pageName="StoryBook";
        if(pageidx==3)pageName="AlphabetSchool";
        this.selectHomeTab(pageName);

    }
    private openCanvasPortrait() {
        this.isShowCanvas = true;
    }
    
    private openCanvasLandscape() {
      this.isShowCanvas = true;
    }

    // babytube플레이어를 가동합니다. 
    private showTubePlayer( filter ){
        this.showTubPlayerFlag = true;
        this.babytubeFilterData = filter;
        console.log( "Tube Player:",this.babytubeFilterData);
    }
    
    // 알파벳 스쿨 액티비티 가동
    private _onShowAlphabetSchool( alphabet: string){
        this.mCurrentCategory = "alphabet";
        this.mCurrentSymbol = alphabet;
        /* 스크롤락관련 처리 201103
        if( !isMobilePlatform() ){
            const app = this.$root.$children[0] as AppVue ;
            app.showActivity( { 
                category:this.mCurrentCategory,
                symbol: this.mCurrentSymbol        
            });
        }else{
            this.isShowCanvas = true;       
        }
        */
        const app = this.$root.$children[0] as AppVue ;
        app.showActivity( { 
            category:this.mCurrentCategory,
            symbol: this.mCurrentSymbol        
        });
        console.log( "Lobby._onShowAlphabetSchool", this.mCurrentCategory,this.mCurrentSymbol )
    }
    // 스토리북 액티비티 가동
    private _onShowStoryBook( bookID: string, startActivity="catch" ){
        console.log( "Lobby._onShowStoryBook", bookID, startActivity );
        this.mCurrentCategory = "storybooks";
        this.mCurrentBookID = bookID;
        this.mCurrentActivitySB = startActivity;
        /* 스크롤락관련 처리 201103
        if( !isMobilePlatform() ){
            const app = this.$root.$children[0] as AppVue ;
            app.showActivity( { 
                category:this.mCurrentCategory,
                bookID: this.mCurrentBookID,
                startActivity: this.mCurrentActivitySB
            });
        }else{
            this.isShowCanvas = true;       
        }
        */
        const app = this.$root.$children[0] as AppVue ;
        app.showActivity( { 
            category:this.mCurrentCategory,
            bookID: this.mCurrentBookID,
            startActivity: this.mCurrentActivitySB
        });
    }

    private async _closeActivity(){
        console.log("_closeActivity" )
        ParentSetupModule.updateRemainByCurrent();
        await UserModule.getHomeData();        
        this.$nextTick( ()=>{
            this.isShowCanvas=false;
        })
        
    }

    private _closeTube(){
        ParentSetupModule.updateRemainByCurrent();
        this.showTubPlayerFlag = false;
    }
    // 홈화면 이벤트 바인딩
    private _selectHomeMenu( label: string){
        console.log( "Lobby._selectHomeMenu", label )
        if( label.toLowerCase() == "mypet" ){
            //보유 도토리가 5개보다 적으면 진입못함.
            if( UserModule.homeData.userInfo.acornCnt <5 ){
                SystemModule.popup.showMessageHelp("보유 도토리가 5개 이상이어야 마이펫에 입장할수 있습니다.")
                return;
            }else{
                // 입장시 5개 차감
                ParentSetupModule.chargeAcorn({acornChargeCnt: -5 })        
            }
            this.mCurrentCategory = "mypet";
            /* 스크롤락관련 처리 201103
            if( !isMobilePlatform() ){
                const app = this.$root.$children[0] as AppVue ;
                app.showActivity( { category:'mypet' });
            }else{
                this.isShowCanvas = true;       
            }
            */
            const app = this.$root.$children[0] as AppVue ;
            app.showActivity( { category:'mypet' });
            
        }else if( label.toLowerCase() == "myroom" ){
            SystemModule.setCurrentPage("MyRoom");
        }else if( label.toLowerCase() == "babytube" ){
            this.selectHomeTab("BabyTube");
        }        
    }
    
    // 부모확인 팝업 열기
    private _clickParentSetup(){
        (this.$refs.ParentCheckPopup as ParentCheckPopup).show( ()=>{
            SystemModule.setCurrentPage("ParentSetup");
        } );
    }
    
    _showActiveTime(){
        (this.$refs.ActiveTimePopup as ActiveTimePopup ).show();
    }
    
}
</script>
