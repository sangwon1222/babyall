import { App } from "../../../Core";
import { GameTypeBase, WordBox, ExamBox, ExamStick } from "./";
import { QuizDataType2 } from "../Define";
import gsap from "gsap";

export class GameType2 extends GameTypeBase {
  private mWordBox: WordBox;
  private mExamBox: ExamBox;
  private mExamStick: ExamStick;
  private mInfo: QuizDataType2;

  private mGuideFinger: PIXI.Sprite;

  get info(): QuizDataType2 {
    return this.mInfo;
  }
  get wordbox(): WordBox {
    return this.mWordBox;
  }
  get examBox(): ExamBox {
    return this.mExamBox;
  }

  constructor(info: QuizDataType2) {
    super(`Type2`);
    this.mInfo = info;

    this.mWordBox = new WordBox();
    this.mWordBox.position.set(103, 100);
    this.addChild(this.mWordBox);

    this.mExamBox = new ExamBox();
    this.mExamBox.position.set(103, 400);
    this.addChild(this.mExamBox);

    this.mGuideFinger = new PIXI.Sprite(
      App.Handle.currentGame.getResource(`finger.png`).texture
    );
    
    this.addChild(this.mGuideFinger);
    this.mGuideFinger.anchor.set(0.5);
    this.mGuideFinger.position.set(1280 / 2, 720 * 0.7);
    this.mGuideFinger.alpha = 0;

    this.interactive = true;
    this.on("pointerdown",()=>{
      this.mGuideFinger.removeChildren();
      this.removeChild(this.mGuideFinger);
      this.interactive = false;
    })
  }

  onSetting() {
    this.mWordBox.onStart();
    this.mExamBox.onStart();
    this.fingerMotion();
  }

  fingerMotion(){
      gsap.to(this.mGuideFinger,{y:720 * 0.3,alpha:1,duration:1.5}).repeat(-1).delay(2);
  }

  getWordBox() {
    return this.mWordBox;
  }
  getExamBox() {
    return this.mExamBox;
  }
  getExamStick() {
    return this.mExamStick;
  }
  getGameType2() {
    return this;
  }
}
