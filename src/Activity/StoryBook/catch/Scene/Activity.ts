import { App, SceneBase } from "../../../Core";
import { Page1, Page2, PageBase } from "../GameObject";
import Game from "../index";
import gsap from "gsap";
import PIXISound from "pixi-sound";
import { Card } from "../GameObject/Card";
import { UserModule } from "@/store/UserStore";
import { StoryBooksModule } from "@/store/StoryBooks";

import Config from "../../../../Util/Config";
import { SystemModule } from "@/store/System";

export class Activity extends SceneBase {
  private mPageArray: Array<PageBase>;
  private mPageCount = 7;
  private mPageStepIDX: number;
  private mBGM: PIXI.sound.Sound;
  private mWrongCount: number;

  get wrongCount(): number {
    return this.mWrongCount;
  }
  set wrongCount(v: number) {
    this.mWrongCount = v;
  }

  get currentPage() {
    // console.error( `this.mPageStepIDX, this.mPageArray`,this.mPageStepIDX, this.mPageArray)
    return this.mPageArray[this.mPageStepIDX];
  }

  get catchDataList() {
    if ((this.game as Game).catchData === undefined) {
      return [];
    }
    return (this.game as Game).catchData;
  }

  constructor() {
    super();
    this.mPageArray = [];
    this.mPageStepIDX = 0;
    this.mWrongCount = 0;
  }

  async onInit() {
    console.log(this.catchDataList);
    PIXISound.stopAll();
    this.mBGM = App.Handle.currentGame.getProductResource(
      `${App.Handle.appData.bookID}_bgm.mp3`
    ).sound;
    this.mPageCount = this.catchDataList.length;
    for (const data of this.catchDataList) {
      console.log(
        `${data.pageNum}번째 게임의 타입은 ${data.pageType}타입 입니다.`
      );
      if (data.pageType == 2) {
        this.mPageArray.push(new Page2(data));
      } else {
        this.mPageArray.push(new Page1(data));
      }
    }
    this.addChild(this.mPageArray[this.mPageStepIDX]);
    await this.game.endLoadingScreen();
    // await this.game.startReadyScreen(0);

    // 레디 연출. 연출이 끝나면 시작
    await this.game.startReadyScreen(1, "sb_catch");

    this.start();
  }
  onStart() {
    this.mBGM.play({ loop: true });
    console.log(`ACTIVITY 시작 !!`);
    this.currentPage.startAct();

    window.onkeyup = (evt) => {
      if (evt.key == "+") {
        App.Handle.nextGame();
        window.onkeyup = null;
      }
    };
  }

  async onEnd() {
    // 서버로 학습결과를 전송
    if (Config.excuteMode == "main" && SystemModule.token != "") {
      console.log(
        "스토리 캐치 끝",
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
          wrongCount: this.mWrongCount, // 캐치,터치,매치,스팟파인더
          // quizResult?: Array<boolean>[5]; //퀴즈
        },
      });
    } else {
      console.warn("스토리캐치 학습결과를 전송하지 않습니다.");
    }
    PIXISound.stopAll();
    gsap.globalTimeline.clear();

    this.mPageCount = this.catchDataList.length;
    console.warn(`틀린 갯수 => [${this.mWrongCount}]`);
    await this.game.startEOPScreen(0, true);
    //성과를 저장
  }

  onNextPage() {
    if (this.mPageStepIDX > this.mPageCount) {
      console.log(`끝`);
    }
    const nextPageSound = App.Handle.currentGame.getResource(`sc_sfx_5.mp3`)
      .sound;
    nextPageSound.play();
    if (this.mPageArray[this.mPageStepIDX + 1] === undefined) {
      App.Handle.nextGame();
    } else {
      this.addChild(this.mPageArray[this.mPageStepIDX + 1]);
      this.mPageArray[this.mPageStepIDX + 1].x = 1280;
      gsap.to(this.mPageArray[this.mPageStepIDX + 1], { x: 0, duration: 0.5 });
      gsap.to(this.mPageArray[this.mPageStepIDX], {
        x: -1280,
        duration: 0.5,
        onComplete: () => {
          this.removeChildren();
          this.mPageStepIDX += 1;
          this.addChild(this.mPageArray[this.mPageStepIDX]);
          this.currentPage.startAct();
        },
      });
    }

    console.log(`${this.mPageStepIDX + 1} 번째 콘탠츠 시작`);
  }

  setWrongCount() {
    console.log(this.mWrongCount);
  }
}
