import * as PIXI from "pixi.js";
import gsap from "gsap";

import { SceneBase, App } from "../../../Core";
import { QuizTypeBase, QuizData } from "../GameObject/QuizTypeBase";
import { QuizType1 } from "../GameObject/QuizType1";
import { QuizType2 } from "../GameObject/QuizType2";
import { QuizType3 } from "../GameObject/QuizType3";
import { QuizType4n5 } from "../GameObject/QuizType4n5";
import PIXISound from "pixi-sound";
import { UserModule } from "@/store/UserStore";
import { AlphabetModule } from "@/store/Alphabet";
import { QuizDataTypeBase } from '../Define';

import Config from "../../../../Util/Config"
import { SystemModule } from '@/store/System';

interface QuizDataListType {
  type1: Array<QuizData>;
  type2: Array<QuizData>;
  type3: Array<QuizData>;
  type4: Array<QuizData>;
  type5: Array<QuizData>;
  addSymbol: Array<string>;
}

export class Activity extends SceneBase {
  private mBGM: PIXI.sound.Sound;

  private mQuizRoot: PIXI.Container;
  private mCurrentQuizIDX: number;
  private mQuizes: Array<QuizTypeBase>;
  private mQuizDataList: QuizDataListType;

  private mWrongCountList: Array<boolean>;
  get wrongCountList(): Array<boolean> {
    if (this.mWrongCountList == null) {
      this.mWrongCountList = [false, false, false, false, false];
    }
    return this.mWrongCountList;
  }

  static _handle: Activity;
  static get Handle(): Activity {
    return Activity._handle;
  }
  private mDrawData: Array<QuizDataTypeBase>;

  constructor(quizDataList: QuizDataListType , drawData?: Array<QuizDataTypeBase> ) {
    super();

    Activity._handle = this;
    this.mQuizDataList = quizDataList;
    this.mCurrentQuizIDX = -1;
    this.mQuizes = [];
    this.mDrawData = drawData;
  }
  async onInit() {
    PIXISound.stopAll();

    this.mWrongCountList = [false, false, false, false, false];
    this.removeChildren();

    this.mQuizRoot = new PIXI.Container();
    this.addChild(this.mQuizRoot);
    const bg = new PIXI.Sprite(App.Handle.currentGame.getResource(`bg.png`).texture);
    this.mQuizRoot.addChild(bg)

    this.mQuizes.push(new QuizType1(this.mQuizDataList.type1, 0));
    this.mQuizes.push(new QuizType2(this.mQuizDataList.type2, 1 , this.mDrawData ));
    this.mQuizes.push(new QuizType3(this.mQuizDataList.type3, 2));
    this.mQuizes.push(new QuizType4n5(this.mQuizDataList.type4, 3));
    this.mQuizes.push(new QuizType4n5(this.mQuizDataList.type5, 4));

    await this.game.endLoadingScreen();

    // 레디 연출. 연출이 끝나면 시작
    await this.game.startReadyScreen(-1, "al_quiz");
    this.start();
  }
  onStart() {
    this.nextQuiz();
    window.onkeyup = (evt) => {
      if (evt.key == "+") {
        App.Handle.nextGame();
        window.onkeyup = null;
      }
    }
    //   if (evt.key == "-") {
    //     this.nextQuiz();
    //   }
    // };
  }

  async onEnd() {
      // 서버로 학습결과를 전송
      if( Config.excuteMode == "main" && SystemModule.token!=""){
        console.log(
            " 알파벳 퀴즈 종료",
            this.game.gameName,
            App.Handle.appData.symbol.toLowerCase(),
            UserModule.childSetting.lrngChoLvlCd,
            this.mWrongCountList
        );

        AlphabetModule.setActivityEnd({
            activity: this.game.gameName,
            endinfo: {
            symbol: App.Handle.appData.symbol.toLowerCase(), // 시작하는 알파벳 심볼
            lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,
            quizResult: this.mWrongCountList,
            },
        });
    }else{
        console.warn("quiz 학습결과를 전송하지 않습니다.")
    }
    
    if(this.mBGM) this.mBGM.stop();
    PIXISound.stopAll();
    gsap.globalTimeline.clear();
    await this.game.startEOPScreen(0);
  }

  onAppMessage(message: any) {
    //
  }

  nextQuiz() {

    console.log(`%c 틀린갯수 ${this.wrongCountList}`,"border:1px red solid;")

    this.mQuizRoot.removeChildren();
    if (this.mCurrentQuizIDX >= 0) this.mQuizes[this.mCurrentQuizIDX].onEnd();
    this.mCurrentQuizIDX += 1;
    if (this.mCurrentQuizIDX < this.mQuizes.length) {
      this.mQuizRoot.addChild(this.mQuizes[this.mCurrentQuizIDX]);
      this.mQuizes[this.mCurrentQuizIDX].onStart();
    } else {
      App.Handle.nextGame();
    }
  }

  
}
