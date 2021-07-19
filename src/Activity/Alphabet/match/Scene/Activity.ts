import * as PIXI from "pixi.js";
import gsap from "gsap";

import { SceneBase, App } from "../../../Core";
import { Stage } from '../GameObject/Stage';
import Game from "../index"
import PIXISound from 'pixi-sound'
import { AlphabetModule } from '@/store/Alphabet';
import { UserModule } from '@/store/UserStore';

import Config from "../../../../Util/Config"
import { SystemModule } from '@/store/System';

export class Activity extends SceneBase {
    
    private mQuizSymbolText = 'A';  // 출제되는 문제 알파벳
    
    private mBGM: PIXI.sound.Sound;
    private mBG: PIXI.Sprite;
    private mStage: Stage;
    private mTime: number;
    
    get levelData(): Array<Array<number>>{ return ( App.Handle.currentGame as Game ).levelData}

    constructor() {
        super();

        // this.mMoleGroups = [];
    }
    async onInit(){
        PIXISound.stopAll();

        this.mBGM = this.game.getResource("am_bgm.mp3").sound;

        this.mQuizSymbolText = App.Handle.appData.symbol;
        console.log(" Activity start: Symbol->",this.mQuizSymbolText);

        this.mBG = PIXI.Sprite.from(this.game.getResource(`match_bg.png`).texture);
        this.addChild( this.mBG );
        
        this.mStage = new Stage( this.levelData, this.mQuizSymbolText );
        this.mStage.position.set( 113,93 );
        this.addChild( this.mStage );
        await this.game.endLoadingScreen()
        await this.game.startReadyScreen(0,"al_match");
        this.start();
    }
//   get currentMoleGroup(): MoleGroup {
//     return this.mMoleGroups[this.mCurrentQuizIndex];
//   }
    
    onStart() {
        if(this.mBGM) this.mBGM.play( {loop:true} );
        console.log("알파벳 매치 시작")
        this.mTime = Date.now();

        window.onkeyup=(evt)=>{
            if( evt.key=="+" ){
                // this.mQuizStepIDX = 4;
                App.Handle.nextGame();
                window.onkeyup = null;
            }
        }
    }

    async onEnd() {
        // 서버로 학습결과를 전송
        if( Config.excuteMode == "main" && SystemModule.token!=""){
    
            console.log(" 알파벳 매치 종료",
                this.game.gameName,
                App.Handle.appData.symbol.toLowerCase(),
                UserModule.childSetting.lrngChoLvlCd,
                (Date.now()-this.mTime)/1000
                );
            AlphabetModule.setActivityEnd({
                activity: this.game.gameName,
                endinfo: {
                    symbol: App.Handle.appData.symbol.toLowerCase(),         // 시작하는 알파벳 심볼
                    lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,
                    completeTime: (Date.now()-this.mTime)/1000
                } 
            });
        }else{
            console.warn("match 학습결과를 전송하지 않습니다.")
        }

        if(this.mBGM) this.mBGM.stop();
        PIXISound.stopAll();
        gsap.globalTimeline.clear();
        await this.game.startEOPScreen(1);
    }
    
    onAppMessage( message: any){
        //
    }
}
