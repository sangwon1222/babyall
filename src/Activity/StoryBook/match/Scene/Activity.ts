import { SceneBase, App } from "../../../Core";
import gsap from "gsap";
import Game from "../index";
import { Road } from "../GameObject/Road";
import { DashBoard } from "../GameObject/DashBoard";
import { QuizPanel, SelectSide } from "../GameObject/QuizPanel";
import { SignalSign } from "../GameObject/SignalSign";
import MatchGame from "../index";
import PIXISound from "pixi-sound";
import { UserModule } from "@/store/UserStore";
import { StoryBooksModule } from "@/store/StoryBooks";

import Config from "../../../../Util/Config";
import { SystemModule } from "@/store/System";

const gameData1 = {
  answer: "play with a toy car",
  words: ["play", "with", "a", "toy", "car"],
  correctImage: "rm_2006_1.png",
  wrongImage: "rm_2006_3.png",
  wrongText: "play with a dinosaur doll",
  answerSound: "rm_2006_1.mp3",
  wordsSound: [
    "rm_2006_1_1.mp3",
    "rm_2006_1_2.mp3",
    "rm_2006_1_3.mp3",
    "rm_2006_1_4.mp3",
    "rm_2006_1_5.mp3",
  ],
};

const gameData2 = [
  {
    answer: "grandpa",
    words: ["grand", "pa"],
    correctImage: "rm_1002_1.png",
    wrongImage: "rm_1002_3.png",
    wrongText: "daddy",
    answerSound: "rm_1002_1.mp3",
    wordsSound: ["rm_1002_1_1.mp3", "rm_1002_1_2.mp3"],
  },
  {
    answer: "grandma",
    words: ["grand", "ma"],
    correctImage: "rm_1002_2.png",
    wrongImage: "rm_1002_5.png",
    wrongText: "mommy",
    answerSound: "rm_1002_2.mp3",
    wordsSound: ["rm_1002_2_1.mp3", "rm_1002_2_2.mp3"],
  },
  {
    answer: "daddy",
    words: ["dad", "dy"],
    correctImage: "rm_1002_3.png",
    wrongImage: "rm_1002_1.png",
    wrongText: "grandma",
    answerSound: "rm_1002_3.mp3",
    wordsSound: ["rm_1002_3_1.mp3", "rm_1002_3_2.mp3"],
  },
  {
    answer: "mommy",
    words: ["mom", "my"],
    correctImage: "rm_1002_4.png",
    wrongImage: "rm_1002_2.png",
    wrongText: "sister",
    answerSound: "rm_1002_4.mp3",
    wordsSound: ["rm_1002_4_1.mp3", "rm_1002_4_2.mp3"],
  },
  {
    answer: "sister",
    words: ["sis", "ter"],
    correctImage: "rm_1002_5.png",
    wrongImage: "rm_1002_4.png",
    wrongText: "mommy",
    answerSound: "rm_1002_5.mp3",
    wordsSound: ["rm_1002_5_1.mp3", "rm_1002_5_2.mp3"],
  },
];

export enum QuizType {
  word,
  image,
  fullText,
}

export interface QuizData {
  quizType: QuizType;

  // 입력 대기 시간(초).
  waitDelaySec: number;

  // 정답 문자.
  answer: string;
  // 정답 사운드.
  answerSound: PIXI.sound.Sound;

  // level 1
  correctWord: string;
  wordSound: PIXI.sound.Sound;

  // level 2
  correctImage: PIXI.Texture;
  wrongImage: PIXI.Texture;

  // level 3
  correctText: string;
  wrongText: string;
}

export interface QuizGameData {
  answer: string;
  words: Array<string>;
  correctImage: string;
  wrongImage: string;
  wrongText: string;
  answerSound: string;
  wordsSound: Array<string>;
}

export class Activity extends SceneBase {
  private mBGM: PIXI.sound.Sound;
  private mRoad: Road;
  private mDashBoard: DashBoard;
  private mQuizPanel: QuizPanel;
  private mSignalSign: SignalSign;

  private mQuizs: Array<Array<QuizData>>;
  private mCurrentQuizStepIDX: number;
  private mCurrentQuizIDX: number;
  private mWrongCount: number;
  private mWaitCount: number;

  // 서버로 부터 받은 정보
  get quizGameData(): Array<QuizGameData> {
    return (App.Handle.currentGame as MatchGame).quizGameData;
  }
  get currentQuiz(): QuizData {
    if (this.mQuizs.length <= this.mCurrentQuizStepIDX) return null;
    if (this.mQuizs[this.mCurrentQuizStepIDX].length <= this.mCurrentQuizIDX)
      return null;
    return this.mQuizs[this.mCurrentQuizStepIDX][this.mCurrentQuizIDX];
  }

  constructor() {
    super();
  }

  async onInit() {
    PIXISound.stopAll();

    this.mQuizs = [];
    this.mWrongCount = 0;
    this.mWaitCount = 0;

    this.mBGM = App.Handle.currentGame.getViewerResource("rm_bgm.mp3").sound;

    this.mRoad = new Road();
    this.addChild(this.mRoad);

    this.mQuizPanel = new QuizPanel();
    this.addChild(this.mQuizPanel);

    this.mSignalSign = new SignalSign();
    this.mSignalSign.position.set(1280 / 2, 0);
    this.addChild(this.mSignalSign);

    this.mDashBoard = new DashBoard();
    this.mDashBoard.position.set(0, 720);
    this.addChild(this.mDashBoard);

    this.makeQuizData();

    this.mDashBoard.initDoll(this.quizGameData);

    await this.game.endLoadingScreen();

    // 레디 연출. 연출이 끝나면 시작
    await this.game.startReadyScreen(0, "sb_match");

    this.start();
  }

  makeQuizData() {
    this.mCurrentQuizStepIDX = 0;
    this.mCurrentQuizIDX = 0;

    // console.log( this.mQuizGameData.words );

    // fill level1 quizData
    for (const gameData of this.quizGameData) {
      const quizlist = [];
      let idx = 0;
      for (const word of gameData.words) {
        quizlist.push({
          quizType: QuizType.word,
          waitDelaySec: 10,
          answer: gameData.answer,
          answerSound: App.Handle.currentGame.getProductResource(
            gameData.answerSound
          ).sound,
          correctWord: word,
          wordSound: App.Handle.currentGame.getProductResource(
            gameData.wordsSound[idx]
          ).sound,
          correctImage: null,
          wrongImage: null,
          correctText: null,
          wrongText: null,
        });
        idx += 1;
      }

      // fill level2 quizData
      if (App.Handle.appData.level > 1) {
        quizlist.push({
          quizType: QuizType.image,
          waitDelaySec: 10,
          answer: gameData.answer,
          answerSound: App.Handle.currentGame.getProductResource(
            gameData.answerSound
          ).sound,
          correctWord: null,
          wordSound: null,
          correctImage: App.Handle.currentGame.getProductResource(
            gameData.correctImage
          ).texture,
          wrongImage: App.Handle.currentGame.getProductResource(
            gameData.wrongImage
          ).texture,
          correctText: null,
          wrongText: null,
        });
      }

      // fill level3 quizData
      if (App.Handle.appData.level > 2) {
        quizlist.push({
          quizType: QuizType.fullText,
          waitDelaySec: 10,
          answer: gameData.answer,
          answerSound: App.Handle.currentGame.getProductResource(
            gameData.answerSound
          ).sound,
          correctWord: null,
          wordSound: null,
          correctImage: null,
          wrongImage: null,
          correctText: gameData.answer,
          wrongText: gameData.wrongText,
        });
      }
      this.mQuizs.push(quizlist);
    }
  }

  onStart() {
    this.mBGM.play({ loop: true });

    // this.mDashBoard.setText( this.mQuizGameData.answer );

    this.nextQuiz();
    window.onkeyup = (evt) => {
      if (evt.key == "+") {
        App.Handle.nextGame();
        window.onkeyup = null;
      }
    };
  }

  nextQuiz() {
    if (this.mCurrentQuizIDX >= this.mQuizs[this.mCurrentQuizStepIDX].length) {
      // this.mDashBoard.showDoll( this.mCurrentQuizStepIDX )
      this.mCurrentQuizIDX = 0;
      this.mCurrentQuizStepIDX += 1;
    }

    // 각 문제 step의 첫번째에서 대쉬보드 퀴즈 텍스트 준비
    if (
      this.mCurrentQuizIDX == 0 &&
      this.mQuizs.length > this.mCurrentQuizStepIDX
    ) {
      this.mDashBoard.initText(this.quizGameData[this.mCurrentQuizStepIDX]);
      if (App.Handle.appData.level == 1) {
        this.mDashBoard.showDoll(this.mCurrentQuizStepIDX);
      } else {
        this.mDashBoard.showSound(this.mCurrentQuizStepIDX);
      }
    }

    if (this.currentQuiz && this.currentQuiz.quizType == QuizType.fullText) {
      this.mDashBoard.hideText();
    }

    gsap.delayedCall(1.5, async () => {
      // 모든 퀴즈가 끝났다. 게임 종료
      if (this.mQuizs.length <= this.mCurrentQuizStepIDX) {
        this.mDashBoard.closeText();
        // App.Handle.currentGame.getProductResource(this.mQuizGameData.answerSound).sound.play();
        await this.mRoad.endAnimation();
        App.Handle.nextGame();
        return;
      }

      // console.warn( "currentQuiz", this.mCurrentQuizIDX, this.mQuizs.length, this.currentQuiz );
      let correctSide = SelectSide.left;

      // 신호등 빨간불
      this.mSignalSign.stop(this.currentQuiz.waitDelaySec);

      // 배경 스크롤 정지
      await this.mRoad.stop(2);
      this.mQuizPanel.show();

      // 현재 퀴즈 타입이 word(레벨1)일 경우
      if (this.currentQuiz.quizType == QuizType.word) {
        this.currentQuiz.wordSound.play();
        correctSide = this.mQuizPanel.makeWordQuiz(
          this.currentQuiz.correctWord
        );
      } else if (this.currentQuiz.quizType == QuizType.image) {
        this.currentQuiz.answerSound.play();
        correctSide = this.mQuizPanel.makeImageQuiz(
          this.currentQuiz.correctImage,
          this.currentQuiz.wrongImage
        );
      } else if (this.currentQuiz.quizType == QuizType.fullText) {
        this.currentQuiz.answerSound.play();
        correctSide = this.mQuizPanel.makeFullTextQuiz(
          this.currentQuiz.correctText,
          this.currentQuiz.wrongText
        );
      }

      // 답선택시의 콜백
      this.mQuizPanel.onSelectAnswer = (
        selectSide: SelectSide,
        isCorrect: boolean
      ) => {
        this.mSignalSign.removeWaitTimeCallback();
        gsap.delayedCall(1.5, async () => {
          // 대시보드 답을 표시
          if (isCorrect) {
            if (this.currentQuiz.quizType == QuizType.word) {
              this.mDashBoard.showText(this.currentQuiz.correctWord);
            }
          }
          await this.mQuizPanel.close();
          this.mSignalSign.start();
          console.warn("isCorrect", isCorrect);

          if (isCorrect == false) {
            this.mWrongCount += 1;
          }

          console.log(
            "_isAllQuizClear",
            this._isAllQuizClear(),
            this.mQuizs[this.mCurrentQuizStepIDX]
          );
          if (isCorrect) {
            if (
              App.Handle.appData.level > 1 &&
              this.currentQuiz.quizType == QuizType.image
            ) {
              this.mDashBoard.showDoll(this.mCurrentQuizStepIDX);
            }
            if (this._isAllQuizClear()) {
              this.currentQuiz.answerSound.play();
              this.mDashBoard.openAllText();
            }
          }

          if (selectSide == SelectSide.left) {
            this.mDashBoard.handleLeft();
            if (isCorrect) {
              await this.mRoad.moveCarLeft();
            } else {
              await this.mRoad.moveCarLeftDie();
            }
          } else {
            this.mDashBoard.handleRight();
            if (isCorrect) {
              await this.mRoad.moveCarRight();
            } else {
              await this.mRoad.moveCarRightDie();
            }
          }

          if (isCorrect) {
            this.mCurrentQuizIDX += 1;
          }
          this.nextQuiz();
        });
      };

      // 제한 시간시간동안 문제 미해결시의 콜백
      this.mSignalSign.onWaitTimeOut = async () => {
        console.log("onWaitTimeOut", correctSide);
        this.mWaitCount += 1;
        const timeOut = App.Handle.currentGame.getViewerResource("rm_sfx_7.mp3")
          .sound;
        timeOut.play();
        await this.mQuizPanel.close();
        await this.mRoad.quizSet.displayPolice(correctSide);
        if (correctSide == SelectSide.left) {
          this.mDashBoard.handleLeft();
          await this.mRoad.moveCarLeft();
        } else {
          this.mDashBoard.handleRight();
          await this.mRoad.moveCarRight();
        }
        this.nextQuiz();
      };
    });
  }

  private _isAllQuizClear(): boolean {
    return (
      this.mCurrentQuizIDX >= this.mQuizs[this.mCurrentQuizStepIDX].length - 1
    );
  }
  async onEnd() {
    // 서버로 학습결과를 전송
    this.mRoad.ticker = false;
    if (Config.excuteMode == "main" && SystemModule.token != "") {
      console.log(
        "스토리 매치 끝",
        this.game.gameName,
        App.Handle.appData.bookID,
        UserModule.childSetting.lrngChoLvlCd,
        this.mWrongCount
      );

      StoryBooksModule.setActivityEnd({
        activity: this.game.gameName,
        endinfo: {
          bookID: App.Handle.appData.bookID,
          lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,
          // complete: true,      // 무비, 메이킹북
          wrongCount: this.mWrongCount, // 캐치,터치,매치,스팟파인더
          // quizResult?: Array<boolean>[5]; //퀴즈
        },
      });
    } else {
      console.warn("스토리 매치 학습결과를 전송하지 않습니다.");
    }
    if (this.mBGM) this.mBGM.stop();
    PIXISound.stopAll();
    gsap.globalTimeline.clear();
    console.log(`틀린갯수 => [${this.mWrongCount}]`);
    console.log(`미응답갯수 => [${this.mWaitCount}]`);
    await this.game.startEOPScreen(1, true);
    //성과를 저장
  }
}
