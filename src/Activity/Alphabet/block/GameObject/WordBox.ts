import { App, Util } from "../../../Core";
import { QuizDataType2 } from "../Define";
import { Rectangle } from "pixi.js";
import gsap from "gsap";
import { ExamStick, ExamBox } from "./";
import { Activity } from "../Scene";
import { GameType2 } from "./GameType2";
const map = ["ab_g_2.png", "ab_p_2.png", "ab_q_2.png", "ab_y_2.png"];
const lowerGroup = [
  "ab_a_2.png",
  "ab_c_2.png",
  "ab_e_2.png",
  "ab_j_2.png",
  "ab_m_2.png",
  "ab_n_2.png",
  "ab_o_2.png",
  "ab_r_2.png",
  "ab_s_2.png",
  "ab_t_2.png",
  "ab_u_2.png",
  "ab_v_2.png",
  "ab_w_2.png",
  "ab_x_2.png",
  "ab_z_2.png",
];
export class WordBox extends PIXI.Container {
  //----------------두번째 유형-----------------
  private mStage: PIXI.Container;
  private mStageSize: PIXI.Point;
  private mExamStickArray: Array<ExamStick>;
  private mReturnPos: PIXI.Point;

  get stage(): PIXI.Container {
    return this.mStage;
  }
  get gameType(): GameType2 {
    return this.parent as GameType2;
  }
  get info(): QuizDataType2 {
    return this.gameType.info;
  }
  get examStickList(): Array<ExamStick> {
    return this.mExamStickArray.slice(0);
  }
  constructor() {
    super();
    this.mExamStickArray = [];

    this.mStage = new PIXI.Container();
    this.mStageSize = new PIXI.Point(1077, 272);
    this.mStage.hitArea = new Rectangle(
      -105,
      -100,
      1280,
      this.mStageSize.y + 200
    );
    this.mStage.interactive = true;

    // // 알파벳블록유형2 통과영역
    // const debug = new PIXI.Graphics();
    // debug.lineStyle(2, 0xff000066, 1);
    // debug.drawRect(-105, -100, 1280, this.mStageSize.y + 200);
    // this.addChild(debug);

    this.addChild(this.mStage);
  }

  onStart() {
    console.log("WORD BOX:", this.info.correct);

    this.mStage.removeChildren();

    let offSetX = 0;

    for (let i = 0; i < this.info.lines.length; i++) {
      const stick = new ExamStick(this.info.correct[i], this.info.lines[i]);
      this.mStage.addChild(stick);

      stick.x = offSetX;
      offSetX += stick.width;
      if (map.includes(this.info.correct[i])) {
        stick.y = 45;
        stick.onArrowPos(45 * 3);
      }
      if (lowerGroup.includes(this.info.correct[i])) {
        stick.y = 20;
        stick.onArrowPos(20 * 3);
      }
      console.log(this.info.correct[i], this.info.correct[i] != `ab_-_1.png`);
      if (this.info.correct[i] != `ab_-_1.png`) {
        this.mExamStickArray.push(stick);
      } else {
        if (this.info.correct[0] != "ab_x_1.png") stick.alpha = 0;
      }
    }
    this.mStage.pivot.x = -this.mStageSize.x / 2 + offSetX / 2;
    this.mStage.pivot.y =
      -this.mStageSize.y / 2 + this.mExamStickArray[0].height / 2;

    // 랜덤으로 3개를 연다.
    const temp = this.mExamStickArray.slice(0);
    temp.shift();
    Util.shuffleArray(temp);
    let limit = 3;
    for (const stick of temp) {
      if (limit > 0) {
        stick.open();
        limit -= 1;
      }
    }

    for (const stick of this.mExamStickArray) {
      if (stick.isOpened) {
        stick.open(App.Handle.appData.level != 3);
        break;
      }
    }
    this.mStage.pivot.set(this.width / 2, this.height / 2);
    this.mStage.position.set(1077 / 2, 272 / 2);
    /**this.mStage 크기 */
    // const debug = new PIXI.Graphics();
    // debug.lineStyle(2, 0xff000066, 1);
    // debug.drawRect(0, 0, this.mStage.width, this.mStage.height);
    // this.mStage.addChild(debug);
  }
  onCorrect(gPos: PIXI.IPoint) {
    const localPos = this.mStage.toLocal(gPos);
    let stickSelected: ExamStick = null;
    for (const stick of this.mExamStickArray) {
      if (stick.isOpened) {
        stick.close();
        stickSelected = stick;
        break;
      }
    }
    let finishQuiz = true;
    for (const stick of this.mExamStickArray) {
      if (stick.isOpened) {
        stick.open(true);
        finishQuiz = false;
        break;
      }
    }
    const soundPath = this.info.sound[
      this.mExamStickArray.indexOf(stickSelected)
    ];
    const sound = App.Handle.currentGame.getProductResource(soundPath).sound;
    sound.play();
    console.log(`사운드 트랙 ${this.mExamStickArray.indexOf(stickSelected)}`);

    gsap
      .from(stickSelected, { x: localPos.x, y: localPos.y, duration: 0.5 })
      .eventCallback("onComplete", () => {
        /**퀴즈를 다 맞췄을때 모션 */
        if (finishQuiz) {
          Activity.Handle.getCurrentGameType2().type2Background();
          Activity.Handle.getCurrentExamBox().endMotion();
          this.endMotion();
          const wordsound = App.Handle.currentGame.getProductResource(
            this.info.sound[this.info.sound.length - 1]
          ).sound;
          wordsound.play();
          gsap.delayedCall(wordsound.duration + 1, () => {
            /**문항이동 음악 */
            const nextSound = App.Handle.currentGame.getResource(`ab_sfx_3.mp3`)
              .sound;
            nextSound.play();
            Activity.Handle.NextType();
          });
        }
      });
  }
  onWrong() {
    Activity.Handle.wrongCountTYPE2 += 1;
    console.error(`type1 오답수:${Activity.Handle.wrongCountTYPE1}`);
    console.error(`type2 오답수:${Activity.Handle.wrongCountTYPE2}`);
    const WRsound = App.Handle.currentGame.getResource(`ab_sfx_2.mp3`).sound;
    WRsound.play();
  }

  setStick(path: string, gPos: PIXI.IPoint): boolean {
    let stickSelected = null;
    for (const stick of this.mExamStickArray) {
      if (stick.isOpened) {
        stickSelected = stick;
        break;
      }
    }
    console.warn( `뚫린 단어:[${stickSelected.path}]와 선택한 스틱:[${path}]가 동일 해야 통과` );
    if (stickSelected.path == path) {
      this.onCorrect(gPos);
      return true;
    } else {
      this.onWrong();
      stickSelected.hint(true);
      return false;
    }
  }
  endMotion() {
    gsap
      .to(this.mStage.scale, { x: 1.05, y: 1.05, duration: 0.5 })
      .yoyo(true)
      .repeat(-1);
  }
}
