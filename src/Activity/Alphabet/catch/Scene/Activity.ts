import * as PIXI from "pixi.js";
import gsap from "gsap";

import { SceneBase, App } from "../../../Core";
import Game from "../index"
import { LevelData } from '../Define';
import { Stage } from '../GameObject/Stage';
import { QuizBox } from '../GameObject/QuizBox';
import PIXISound from 'pixi-sound'
import { StoryBooksModule } from '@/store/StoryBooks';
import { AlphabetModule } from '@/store/Alphabet';
import { UserModule } from '@/store/UserStore';

import Config from "../../../../Util/Config"
import { SystemModule } from '@/store/System';

export class Activity extends SceneBase {
    // private mQuizData: QuizData = new DefaultQuizData();
    // private mMoleGroups: Array<MoleGroup>; // 출제 문제수만큼 생성
    // private mCurrentQuizIndex = -1; // 현재 문제 인덱스
    //private mQuizBoard: QuizBoard;      // 현재 문제 상황 표시
    
    private mQuizSymbolText = 'A';  // 출제되는 문제 알파벳
    
    private mBGM: PIXI.sound.Sound;
    private mBG: PIXI.Sprite;
    private mStage: Stage;
    private mQuizBox: QuizBox;

    private mThemeIDX: number;      // 이미지 테마 인덱스

    private mQuizStepIDX: number;       // 현재 문제 스텝수( 1~4 )
    private mWrongCount: number;          // 틀린 문제 갯수
    get levelData(): LevelData{ return ( App.Handle.currentGame as Game ).levelData}

    async onInit(){
        PIXISound.stopAll();

        this.mWrongCount = 0;

        this.mThemeIDX = Math.ceil(Math.random() *3)+1;
        this.mBGM = this.game.getResource(`ac_bgm_${this.mThemeIDX}.mp3`).sound;
        // this.mBGM = this.game.getResource("bgm.mp3").sound;
        this.mQuizSymbolText = App.Handle.appData.symbol;
        console.log(" Activity start: Symbol->",this.mQuizSymbolText, this.levelData);

        this.mBG = PIXI.Sprite.from(this.game.getResource(`bg_0${this.mThemeIDX}.png`).texture);
        this.addChild( this.mBG );
        
        this.mQuizBox = new QuizBox( this.mQuizSymbolText );
        // this.mQuizBox.setDebug();
        this.mQuizBox.position.set( 1280/2, 216 );
        this.addChild( this.mQuizBox );
        
        this.mStage = new Stage( this.mQuizSymbolText, this.mThemeIDX, this.levelData );
        this.mStage.on( "success", ()=>{ this.onQuizSucess() } )
        this.mStage.on( "fail", ()=>{ this.onQuizFail() } )
        this.mStage.position.set( 1280/2, 450);
        this.addChild( this.mStage ); 
        
        this.mQuizStepIDX = 0;
        // 당근 연출 보이고 문제 시작 준비
        this.mStage.ready();

        await this.game.endLoadingScreen()
        
        // 레디 연출. 연출이 끝나면 시작
        await this.game.startReadyScreen(2,"al_catch");
        this.start();
    }

    onStart() {
        this.mBGM.play( {loop:true} );
        this.onNextQuiz();

        window.onkeyup=(evt)=>{
            if( evt.key=="+" ){
                App.Handle.nextGame();
                window.onkeyup = null;
            }
        }
        // this.game.readyScreen.start( ()=>{
        //     this.onNextQuiz();
        // })
    }

    async onEnd() {
        // 서버로 학습결과를 전송
        if( Config.excuteMode == "main" && SystemModule.token!=""){
    
            console.log("알파벳 캐치 끝", 
                this.game.gameName,
                App.Handle.appData.symbol.toLowerCase(),
                UserModule.childSetting.lrngChoLvlCd,
                this.mWrongCount
            );

            AlphabetModule.setActivityEnd({
                activity: this.game.gameName,
                endinfo: {
                    symbol: App.Handle.appData.symbol.toLowerCase(),         // 시작하는 알파벳 심볼
                    lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,
                    wrongCount: this.mWrongCount
                } 
            });
        }else{
            console.warn("catch 학습결과를 전송하지 않습니다.")
        }
        
        // todo: bgm 정지-> ( EndOfPage )-> 다음 게임으로 넘어간다.
        if(this.mBGM) this.mBGM.stop();
        PIXISound.stopAll();
        gsap.globalTimeline.clear();
        await this.game.startEOPScreen(1);
    }
    
    onAppMessage( message: any){
        //
    }

    // 다음문제 시작시
    onNextQuiz() {
        console.log( "this.mQuizStepIDX:", this.mQuizStepIDX )
        if( this.mQuizStepIDX<4 ){
            this.mQuizStepIDX += 1;
            // 문제 판 애니.( 선지 사운드 출력 )
            this.mQuizBox.startQuizStep( this.mQuizStepIDX );
            
            gsap.delayedCall(1, () => {
                this.mStage.start( this.mQuizStepIDX );
            });
            
        }else{
            console.log("알파벳 캐치 게임 모두 풀었음.")
            App.Handle.nextGame();
        }
    }

    // 현재 퀴즈를 맞췄을때
    onQuizSucess() {
        this.mQuizBox.correct();
        gsap.delayedCall( 3, ()=>{
            this.onNextQuiz();
        });
    }
    // 현재 퀴즈를 틀렸을때
    onQuizFail() {
        this.mWrongCount +=1
        console.log(`틀린갯수 => [${this.mWrongCount}]`)
    }
}
