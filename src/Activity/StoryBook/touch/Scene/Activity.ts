import { App, SceneBase } from '../../../Core'

import Game from '../';
import PIXISound from 'pixi-sound'
import gsap from 'gsap';

import { AnswerBox,ExamStickerBox,SpeakBox,ExamSticker } from '../GameObject';
import { UserModule } from '@/store/UserStore';
import { StoryBooksModule } from '@/store/StoryBooks';

import Config from "../../../../Util/Config"
import { SystemModule } from '@/store/System';

export class Activity extends SceneBase{
    //------------------------------------------------
    static _handle: Activity;
    static get Handle(): Activity { return Activity._handle}

    private mBGM: PIXI.sound.Sound;
    private mBG: PIXI.Sprite
    private mAnswerBox: AnswerBox;
    private mExamStickerBox: ExamStickerBox;
    private mCurrentStep = -1;
    private mSpeakBox: SpeakBox;

    
    get touchData(){ 
        if( (this.game as Game).touchData === undefined ){
            return [];
        }
        return (this.game as Game).touchData; 
    }

    get currentStep(): number { return this.mCurrentStep}
    
    constructor(){
        super();
        Activity._handle = this;
    }

    async onInit(){
        PIXISound.stopAll();
        // console.warn( "touchData", this.touchData);
        this.mBG = PIXI.Sprite.from(App.Handle.currentGame.getProductResource(`lt_${App.Handle.appData.bookID}_bg.png`).texture);
        this.addChild(this.mBG)

        this.mAnswerBox = new AnswerBox(this.touchData);
        this.addChild(this.mAnswerBox);
        
        this.mExamStickerBox = new ExamStickerBox();
        this.addChild(this.mExamStickerBox);
        
        this.mSpeakBox = new SpeakBox(this.touchData)
        this.mSpeakBox.onSoundPlayLock=( flag: boolean)=>{
            if( flag ){
                this.mAnswerBox.currentAnswer.hint();
            }
        }
        this.addChild(this.mSpeakBox)
        
        this.interactive = true;
        
        await this.game.endLoadingScreen();
        
        // 레디 연출. 연출이 끝나면 시작
        await this.game.startReadyScreen(2,"sb_touch");
        
        
        this.start();
    }
    async onEnd(){
        // 서버로 학습결과를 전송
        if( Config.excuteMode == "main" && SystemModule.token!=""){
    
            console.log("스토리 터치 끝", 
                this.game.gameName,
                App.Handle.appData.bookID,
                UserModule.childSetting.lrngChoLvlCd,
                this.mExamStickerBox.wrongCount
            );
            StoryBooksModule.setActivityEnd({
                activity: this.game.gameName,
                endinfo:{
                    bookID: App.Handle.appData.bookID,
                    lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,       
                    // complete: true,      // 무비, 메이킹북
                    wrongCount: this.mExamStickerBox.wrongCount,     // 캐치,터치,매치,스팟파인더
                    // quizResult?: Array<boolean>[5]; //퀴즈
                }
            })
            console.warn(`틀린갯수 =>[${this.mExamStickerBox.wrongCount}]`)
        }else{
            console.warn("스토리 터치 학습결과를 전송하지 않습니다.")
        }

        PIXISound.stopAll();
        gsap.globalTimeline.clear();
        await this.game.startEOPScreen(1,true);
        
    }
    
    onStart(){
        const finger = new PIXI.Sprite(App.Handle.currentGame.getResource(`finger.png`).texture);
        this.addChild(finger)
        finger.anchor.set(0.5);
        finger.position.set(1280*0.8,720/2);
        gsap.to(finger,{x:finger.x-1280/3,duration:2}).repeat(-1)

        this.interactive= true;
        this.on("pointerdown",()=>{this.removeChild(finger)})
        
        this.mBGM = App.Handle.currentGame.getResource(`lt_bgm.mp3`).sound;
        this.mBGM.play({loop:true})
        console.log(`touch ACTIVITY 시작 !!`)
        this.onNextQuiz();

        window.onkeyup=(evt)=>{
            if( evt.key=="+" ){
                App.Handle.nextGame();
                window.onkeyup = null;
            }
        }
    }

    onNextQuiz(){
        
        console.log( "FINISH",App.Handle.appData.level +2,this.mCurrentStep+1, ( App.Handle.appData.level +2 == this.mCurrentStep))
        if( App.Handle.appData.level +2 == this.mCurrentStep+1){
            // 모든 퀴즈가 끝났다면..
            App.Handle.nextGame();
            return;
        }else{
            // 새로운 문제 처리
            this.mCurrentStep += 1;
            this.mExamStickerBox.nextStep();
            this.mAnswerBox.currentAnswer.finish();
            this.mSpeakBox.initQuiz( this.currentStep );
            this.mAnswerBox.currentAnswer.focus( true );
        }
    }
}