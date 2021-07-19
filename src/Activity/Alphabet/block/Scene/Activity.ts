import { App, GameBase, SceneBase, Util } from "../../../Core";
import {
  GameTypeBase,
  GameType1,
  GameType2,
  QuizBox,
  StickBox,
  Stick,
  WordBox,
  ExamStick,
  ExamBox,
} from "../GameObject";
import Game from "../index";
import { QuizDataType1, QuizDataType2 } from "../Define";
import PIXISound from "pixi-sound";
import gsap from "gsap";
import { UserModule } from "@/store/UserStore";
import { AlphabetModule } from "@/store/Alphabet";

import Config from "../../../../Util/Config"
import { SystemModule } from '@/store/System';

export class Activity extends SceneBase {
  //------------------------------------------------
  static _handle: Activity;
  static get Handle(): Activity {
    return Activity._handle;
  }
  //------------------------------------------------
  private mTypeStep: Array<GameTypeBase>;
  private mGameTypeStep: number;
  private mBGM: PIXI.sound.Sound;

  private mWrongCountTYPE1: number;
  get wrongCountTYPE1(): number {
    return this.mWrongCountTYPE1;
  }
  set wrongCountTYPE1(v: number) {
    this.mWrongCountTYPE1 = v;
  }

  private mWrongCountTYPE2: number;
  get wrongCountTYPE2(): number {
    return this.mWrongCountTYPE2;
  }
  set wrongCountTYPE2(v: number) {
    this.mWrongCountTYPE2 = v;
  }

  constructor() {
    super();
    Activity._handle = this;
    this.mTypeStep = [];
    this.mGameTypeStep = -1;

    this.mWrongCountTYPE1 = 0;
    this.mWrongCountTYPE2 = 0;
  }

  async onInit() {
    PIXISound.stopAll();
    this.mBGM = App.Handle.currentGame.getResource(`ab_bgm.mp3`).sound;
    const quizBox = new QuizBox();
    const stickBox = new StickBox();
    const examBox = new ExamBox();
    quizBox.directionlevel;

    this.mTypeStep.push( new GameType1( (this.game as Game).quizData[0] , "upper") )
    this.mTypeStep.push(new GameType2((this.game as Game).quizData[1]));
    this.mTypeStep.push( new GameType1( (this.game as Game).quizData[2] ,"lower") )
    this.mTypeStep.push(new GameType2((this.game as Game).quizData[3]));

    this.removeChildren();
    this.addChild(this.mTypeStep[this.mGameTypeStep + 1]);

    await this.game.endLoadingScreen();
    // 레디 연출. 연출이 끝나면 시작
    await this.game.startReadyScreen(1, "al_block");
    this.start();
  }

  getCurrentGameType2(): GameType2 {
    if (this.mTypeStep[this.mGameTypeStep] instanceof GameType2) {
      return this.mTypeStep[this.mGameTypeStep] as GameType2;
    } else {
      return null;
    }
  }

  // getCurrentQuizBox(): QuizBox {
  //   if (this.mTypeStep[this.mGameTypeStep] instanceof GameType1) {
  //     return (this.mTypeStep[this.mGameTypeStep] as GameType1).getQuizBox();
  //   } else {
  //     return null;
  //   }
  // }
  // getCurrentStickBox(): StickBox {
  //   if (this.mTypeStep[this.mGameTypeStep] instanceof GameType1) {
  //     return (this.mTypeStep[this.mGameTypeStep] as GameType1).getStickBox();
  //   } else {
  //     return null;
  //   }
  // }

  getCurrentWordBox(): WordBox {
    if (this.mTypeStep[this.mGameTypeStep] instanceof GameType2) {
      return (this.mTypeStep[this.mGameTypeStep] as GameType2).getWordBox();
    } else {
      return null;
    }
  }
  getCurrentExamBox(): ExamBox {
    if (this.mTypeStep[this.mGameTypeStep] instanceof GameType2) {
      return (this.mTypeStep[this.mGameTypeStep] as GameType2).getExamBox();
    } else {
      return null;
    }
  }
  getCurrentExamStick(): ExamStick {
    if (this.mTypeStep[this.mGameTypeStep] instanceof GameType2) {
      return (this.mTypeStep[this.mGameTypeStep] as GameType2).getExamStick();
    } else {
      return null;
    }
  }

  NextType() {
    console.log(`체인지 타입 !`);
    if (this.mGameTypeStep < -1) { this.mGameTypeStep = 0; }
    this.mGameTypeStep += 1;  

    if (this.mGameTypeStep < 4) {  
        this.removeChildren();
        this.addChild(this.mTypeStep[this.mGameTypeStep]);
        this.mTypeStep[this.mGameTypeStep].onSetting();
        
        if(this.mGameTypeStep==0){return;}

        this.addChild(this.mTypeStep[this.mGameTypeStep-1]);
        gsap.to(this.mTypeStep[this.mGameTypeStep-1],{x:-1300,duration:0.5})
        .eventCallback("onComplete",()=>{  this.removeChild(this.mTypeStep[this.mGameTypeStep-1]);  })
    }else{
        App.Handle.nextGame();  
    }
  }

  //--------------------------------------

  onStart() {
    this.mBGM.play({ loop: true });
    this.NextType();

    window.onkeyup = (evt) => {
      if (evt.key == "+") {
        App.Handle.nextGame();
        window.onkeyup = null;
      }
    };
  }

  async onEnd() {
    // 서버로 학습결과를 전송
    if( Config.excuteMode == "main" && SystemModule.token!=""){
        console.log(
            " 알파벳 블록 종료",
            this.game.gameName,
            App.Handle.appData.symbol.toLowerCase(),
            UserModule.childSetting.lrngChoLvlCd,
            `첫번째 타입 오답:[${this.wrongCountTYPE1}]
            두번째 타입 오답:[${this.wrongCountTYPE2}]`
        );
        AlphabetModule.setActivityEnd({
        activity: this.game.gameName,
        endinfo: {
            symbol: App.Handle.appData.symbol.toLowerCase(), // 시작하는 알파벳 심볼
            lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,
            wrongCount: this.wrongCountTYPE1 + this.wrongCountTYPE2,
        },
        });
    }else{
        console.warn("block 학습결과를 보내지 않습니다.")
    }
    
    if(this.mBGM) this.mBGM.stop();
    PIXISound.stopAll();
    gsap.globalTimeline.clear();
    await this.game.startEOPScreen(1);
  }
}
