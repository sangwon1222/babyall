import * as PIXI from "pixi.js";
import gsap from "gsap";
import { App } from "@/Activity/Core";

export class Mole extends PIXI.Sprite {
  static debugMode = false;

  private mSpine: PIXI.spine.Spine;
  private mTextSprite: PIXI.Sprite;
  private mQuizTextures: Array<PIXI.Texture>;

  private mHoldSec: number; //두더지 올라오고 대기시간.
  private mAllowClick = false;
  private mIsReady: boolean; // 두더지 대기상태인가?
  private mOutAniTween: gsap.core.Tween = null; // mHoldSec만큼 기다렸다가 퇴장처리

  private mCorrectSound: PIXI.sound.Sound;
  private mWrongSound: PIXI.sound.Sound;

  private mIsAnswer: boolean;

  get width(): number {
    return 150;
  }
  get height(): number {
    return 120;
  }
  get marginX(): number {
    return 100;
  }
  get marginY(): number {
    return 50;
  }

  constructor(symbol: string, themeIDX: number, holdSec: number) {
    super();

    this.mHoldSec = holdSec;
    this.mIsReady = true;
    this.mIsAnswer = false;

    this.mCorrectSound = App.Handle.currentGame.getResource(
      "ac_sfx_1.mp3"
    ).sound;
    this.mWrongSound = App.Handle.currentGame.getResource("ac_sfx_2.mp3").sound;
    this.mQuizTextures = [
      App.Handle.currentGame.getProductResource(`${symbol.toLowerCase()}1.png`)
        .texture,
      App.Handle.currentGame.getProductResource(`${symbol.toLowerCase()}2.png`)
        .texture,
      App.Handle.currentGame.getProductResource(`${symbol.toLowerCase()}3.png`)
        .texture,
      App.Handle.currentGame.getProductResource(`${symbol.toLowerCase()}4.png`)
        .texture,
    ];
    this.mTextSprite = new PIXI.Sprite(this.mQuizTextures[0]);
    this.mTextSprite.anchor.set(0.5);
    this.mTextSprite.scale.x = 0.6;
    this.mTextSprite.scale.y = -0.6;
    // 두더지 이미지
    this.mSpine = new PIXI.spine.Spine(
      App.Handle.currentGame.getResource(
        `common_mole_0${themeIDX}.json`
      ).spineData
    );
    //this.mSpine = new PIXI.spine.Spine( App.Handle.currentGame.getResource(`common_mole_01.json`).spineData );
    const temp = this.mSpine.slotContainers[
      this.mSpine.skeleton.findSlotIndex("text")
    ];
    temp.removeChildren();
    temp.addChild(this.mTextSprite);
    temp.updateTransform();

    console.error(temp);

    this.mSpine.position.set(this.width / 2, this.height);
    this.addChild(this.mSpine);

    this.mSpine.state.setAnimation(0, "vg_in", false);
    this.mSpine.state.timeScale = 0;
    this._setupMoleAnimation();

    const rect = new PIXI.Rectangle(0, 0, this.width, this.height);
    this.hitArea = rect;
    this.interactive = true;
    this.buttonMode = true;
    this.on("pointerdown", () => {
      // this._onClick();
      if (this.mAllowClick) {
        this._onClick();
        // 중복 클릭 못하도록 처리
        this.mAllowClick = false;
      }
    });

    if (Mole.debugMode) {
      // // 클릭 영역
      // 클릭 영역
      const debug = new PIXI.Graphics();
      debug.lineStyle(2, 0xff000066, 1);
      debug.drawRect(rect.x, rect.y, rect.width, rect.height);
      this.addChild(debug);

      // 중심 표시
      const debugCenter = new PIXI.Graphics();
      debugCenter.lineStyle(2, 0xffcc00, 1);
      debugCenter.moveTo(0, -10);
      debugCenter.lineTo(0, 10);
      debugCenter.moveTo(-10, 0);
      debugCenter.lineTo(10, 0);
      this.addChild(debugCenter);
    }
  }

  isReady(): boolean {
    return this.mIsReady;
  }
  // 두더지 초기 준비( 당근 사라지는 애니 )
  readyForStart() {
    this.mSpine.state.timeScale = 1;
    this.mSpine.state.setAnimation(0, "vg_in", false);
  }

  // 두더지 등장!
  start(quizidx: number, isAnswer: boolean) {
    this.mIsAnswer = isAnswer;
    this.mTextSprite.texture = this.mQuizTextures[quizidx - 1];
    this.mSpine.state.setAnimation(0, "mole_in", false);
    this.mIsReady = false;
  }

  // 두더지 사라져!
  stop() {
    if (this.mOutAniTween) {
      this.mOutAniTween.kill();
      this.mOutAniTween = null;
    }
    // 성공 애니안했을경우에만 퇴장 애니를 걸어준다.
    if (
      this.mSpine.state.getCurrent(0).animation.name !== "mole_success" &&
      this.mSpine.state.getCurrent(0).animation.name !== "mole_fail"
    ) {
      if (
        this.mSpine.state.getCurrent(0).animation.name !== "mole_out" &&
        this.mSpine.state.getCurrent(0).animation.name !== "vg_in"
      ) {
        this.mSpine.state.setAnimation(0, "mole_out", false);
      }
    }
    this.mAllowClick = false;
  }

  // 두더지의 애니메이션 연출후
  private _setupMoleAnimation() {
    this.mSpine.state.addListener({
      complete: (entry) => {
        if (entry.animation.name == "mole_in") {
          this.mSpine.state.setAnimation(0, "mole_in_ing", true);
          this.mAllowClick = true;
          // 대기시간이후에 들어가라.
          this.mOutAniTween = gsap.delayedCall(this.mHoldSec, () => {
            this.stop();
          });
        } else if (entry.animation.name == "mole_out") {
          this.mIsReady = true;
        } else if (entry.animation.name == "mole_fail") {
          this.stop();
          this.mSpine.state.setAnimation(0, "mole_out", false);
        } else if (entry.animation.name == "mole_success") {
          this.mIsReady = true;
        }
      },
    });
  }

  // 현재 두더지가 정답인가?
  private _checkAnswer(): boolean {
    //return Math.random() >0.5;
    return this.mIsAnswer;
  }

  // 두더지 클릭시 처리
  private _onClick() {
    if (this._checkAnswer()) {
      this.mCorrectSound.play();
      this.emit("success", this);
      this.mSpine.state.setAnimation(0, "mole_success", false);
    } else {
      this.mWrongSound.play();
      this.emit("fail", this);
      this.mSpine.state.setAnimation(0, "mole_fail", false);
    }
    this.stop();
  }
}
