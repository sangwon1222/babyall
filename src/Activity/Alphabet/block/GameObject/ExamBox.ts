import { App, Util } from "../../../Core";
import { QuizDataType2 } from "../Define";
import { Rectangle, Sprite } from "pixi.js";
import { ExamStick } from "./ExamStick";
import gsap from "gsap";
import { GameType2 } from "./GameType2";

const map = ["ab_g_2.png", "ab_p_2.png", "ab_q_2.png", "ab_y_2.png"];
const lowerGroup = [
  "ab_j_2.png",
  "ab_a_2.png",
  "ab_c_2.png",
  "ab_e_2.png",
  "ab_n_2.png",
  "ab_m_2.png",
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

export class ExamBox extends PIXI.Container {
  private mPictureStage: PIXI.Container;
  private mPicture: PIXI.Sprite;
  private mPictureTexture1: PIXI.Texture;
  private mPictureTexture2: PIXI.Texture;
  private mExamStage: PIXI.Container;
  private mExamStageSize: PIXI.Point;
  private mExamArray: Array<ExamStick>;
  private mPictureFlag = true;

  get gameType(): GameType2 {
    return this.parent as GameType2;
  }
  get info(): QuizDataType2 {
    return this.gameType.info;
  }

  constructor() {
    super();

    this.mExamArray = [];

    this.mPictureStage = new PIXI.Container();
    this.mPictureStage.pivot.set(250 / 2, 255 / 2);
    this.mPictureStage.position.set(250 / 2, 255 / 2);
    this.mPictureStage.hitArea = new Rectangle(0, 0, 250, 255);
    this.mPictureStage.interactive = true;
    this.mPictureStage.buttonMode = true;

    this.mPicture = new PIXI.Sprite();
    this.mPicture.anchor.set(0.5);
    this.mPicture.position.set(250 / 2, 255 / 2);

    this.mPictureStage.addChild(this.mPicture);
    this.addChild(this.mPictureStage);

    // const debug = new PIXI.Graphics();
    // debug.lineStyle(2, 0xff000066, 1);
    // debug.drawRect(0,0,250,255)
    // this.addChild(debug);

    this.mPictureStage.on("pointerdown", () => {
      this.clickPicture();
    });
    this.mExamStage = new PIXI.Container();
    this.mExamStageSize = new PIXI.Point(800, 256);
    this.mExamStage.x = 270;
    this.addChild(this.mExamStage);

    // 클릭 시작
    this.interactive = true;
    this.on("pointerdown", (evt: PIXI.InteractionEvent) => {
      const temp = this.mExamArray.reverse();
      for (const exam of temp) {
        if (exam.checkTouchDown(evt.data.global) == true) {
          this.mExamStage.removeChild(exam);
          this.mExamStage.addChild(exam);
          break;
        }
      }
    });
    this.on("pointerup", (evt) => {
      for (const exam of this.mExamArray) {
        exam.focusPointerUp(evt.data.global);
      }
    });
  }

  onStart() {
    this.mPictureTexture1 = App.Handle.currentGame.getProductResource(
      this.info.picture[0]
    ).texture;
    this.mPictureTexture2 = App.Handle.currentGame.getProductResource(
      this.info.picture[1]
    ).texture;
    // 예시박스 왼쪽 사진
    this.mExamStage.removeChildren();
    this.mPicture.texture = this.mPictureTexture2;

    this.sellectSetting();
    const wordsound = App.Handle.currentGame.getProductResource(
      this.info.sound[this.info.sound.length - 1]
    ).sound;
    
    gsap.delayedCall(1, () => {  wordsound.play();  });

  }
  clickPicture() {
    if (this.mPictureFlag) {
      this.mPictureFlag = false;
      this.onCorrect();
      const wordsound = App.Handle.currentGame.getProductResource(this.info.sound[this.info.sound.length - 1]).sound;
      wordsound.play();
      gsap.delayedCall(1, () => {  this.mPictureFlag = true;  });
    }
  }
  onCorrect() {
    this.mPicture.texture =
      this.mPicture.texture == this.mPictureTexture1
        ? this.mPictureTexture2
        : this.mPictureTexture1;
  }
  sellectSetting() {
    // 보기박스
    /**정답 스틱 */
    for (let i = 0; i < this.info.correct.length; i++) {
      const exam = new ExamStick(this.info.correct[i], this.info.lines[i]);
      if (lowerGroup.includes(this.info.correct[i])) {
        exam.y = 20;
        exam.onArrowPos(20 * 3);
      }
      if (map.includes(this.info.correct[i])) {
        exam.y = 45;
        exam.onArrowPos(45 * 3);
      }
      /**i 일때 띄어쓰기 */
      if (this.info.correct[i] != "ab_-_1.png") {
        this.mExamArray.push(exam);
      }
    }
    const idxForDelete = [];
    const list = this.gameType.wordbox.examStickList;

    for (const exStick of list) {
      if (!exStick.isOpened) {
        idxForDelete.push(list.indexOf(exStick));
      }
    }
    const temp = [];
    for (const idx in this.mExamArray) {
      const stickIDX = parseInt(idx, 10);
      if (!idxForDelete.includes(stickIDX)) {
        temp.push(this.mExamArray[stickIDX]);
      }
    }
    this.mExamArray = temp;
    /**오답 스틱 */
    const level = App.Handle.appData.level - 1;
    const wrongCount = level;
    for (let i = 0; i < wrongCount; i++) {
      const wrong = new ExamStick(this.info.wrong[i], this.info.wrong[i]);
      if (lowerGroup.includes(this.info.wrong[i])) {
        wrong.y = 20;
        wrong.onArrowPos(20 * 3);
      }
      if (map.includes(this.info.wrong[i])) {
        wrong.y = 45;
        wrong.onArrowPos(45 * 3);
      }
      this.mExamArray.push(wrong);
      console.log(`오답은 ${this.info.wrong[i]}이 나옵니다.`);
    }
    console.log(`오답 갯수 ${wrongCount}개 산출`);
    Util.shuffleArray(this.mExamArray);

    let offsetx = 0;
    for (let i = 0; i < this.mExamArray.length; i++) {
      if (i != 0) this.mExamArray[i].x = offsetx + 10;
      offsetx += this.mExamArray[i].width;
      this.mExamStage.addChild(this.mExamArray[i]);
    }
    this.mExamStage.pivot.x = -this.mExamStageSize.x / 2 + offsetx / 2;
    this.mExamStage.pivot.y =
      -this.mExamStageSize.y / 2 + this.mExamArray[0].height / 2;
  }

  endMotion() {
    this.removeChild(this.mPictureStage);
    this.mExamStage.removeChildren();

    const picture1 = new PIXI.Sprite(this.mPictureTexture1);
    this.addChild(picture1);

    const picture2 = new PIXI.Sprite(this.mPictureTexture2);
    this.addChild(picture2);

    picture1.anchor.set(0.5);
    picture2.anchor.set(0.5);
    picture1.x = 530 / 2;
    picture1.y = 280 / 2;
    picture2.x = 530 + 530 / 2;
    picture2.y = 280 / 2;

    // /**사진 모션 */
    gsap
      .fromTo(picture1, { rotation: -0.2 }, { rotation: 0.2, duration: 0.5 })
      .yoyo(true)
      .repeat(-1);
    gsap
      .fromTo(picture2, { rotation: -0.2 }, { rotation: 0.2, duration: 0.5 })
      .yoyo(true)
      .repeat(-1);
  }

  onWrong() {
    //
  }
}
