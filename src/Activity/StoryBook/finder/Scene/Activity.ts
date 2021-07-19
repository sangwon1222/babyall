import { App,SceneBase } from '../../../Core';
import {Stage} from '../GmaeObject/Stage'
import { FinderData } from '../Define';
import Game from '../';
import gsap from 'gsap';
import PIXISound from 'pixi-sound'
import { UserModule } from '@/store/UserStore';
import { StoryBooksModule } from '@/store/StoryBooks';

import Config from "../../../../Util/Config"
import { SystemModule } from '@/store/System';

export class Activity extends SceneBase{
    static _handle: Activity;
    static get Handle(): Activity { return Activity._handle}

    get quizStep() { return this.mQuizStep}
    
    get finderData() { 
        if( (this.game as Game).finderData === undefined ) { return []; }
        return (this.game as Game).finderData
    }

    private mFinder: Stage;
    private mQuizStep: number;
    private mBGM: PIXI.sound.Sound;

    constructor(){
        super()
        Activity._handle = this;
        
    }
    async onInit(){
        PIXISound.stopAll()
        this.mQuizStep = 1;
        this.mFinder = new Stage(this.finderData);
        this.addChild(this.mFinder);
        
        await this.game.endLoadingScreen();
        
        // 레디 연출. 연출이 끝나면 시작
        await this.game.startReadyScreen(2,"sb_finder");
        
        this.mBGM = App.Handle.currentGame.getResource(`sf_bgm.mp3`).sound;
        this.mBGM.play({loop:true})

        this.start();
    }

    async onEnd(){
        // 서버로 학습결과를 전송
        if( Config.excuteMode == "main" && SystemModule.token!=""){
        
            console.log("스토리 파인더 끝", 
                this.game.gameName,
                App.Handle.appData.bookID,
                UserModule.childSetting.lrngChoLvlCd,
                this.mFinder.wrongCount
            );

            StoryBooksModule.setActivityEnd({
                activity: this.game.gameName,
                endinfo:{
                    bookID: App.Handle.appData.bookID,
                    lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,       
                    //complete: true,      // 무비, 메이킹북
                    wrongCount: this.mFinder.wrongCount,     // 캐치,터치,매치,스팟파인더
                    // quizResult?: Array<boolean>[5]; //퀴즈
                }
            })
        }else{
            console.warn("스토리파인더 학습결과를 전송하지 않습니다.")
        }
        
        PIXISound.stopAll();
        gsap.globalTimeline.clear();
        await this.game.startEOPScreen(0,true);
    }

    onNextStep(){
        console.log(`ACTIVITY=>[${this.mQuizStep}]`)
        const gameCount = App.Handle.appData.level +2;
        this.mQuizStep+=1;
        if(this.mQuizStep > gameCount){
            console.error(`게임 끝!!`)
            console.warn(`틀린갯수 =>[${this.mFinder.wrongCount}]`)
            this.mBGM.stop();
            App.Handle.nextGame();
        }
    }
    onStart(){
        this.mFinder.onStart();
        window.onkeyup=(evt)=>{
            if( evt.key=="+" ){
                App.Handle.nextGame();
                window.onkeyup = null;
            }
        }
    }
    
}