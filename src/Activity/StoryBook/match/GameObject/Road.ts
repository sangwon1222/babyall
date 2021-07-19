import { App } from "@/Activity/Core";
import gsap from "gsap";
import { QuizSet } from "./QuizSet";
import { SelectSide } from "./QuizPanel";

export class Road extends PIXI.Container {
  private mBGRoot: PIXI.Container;
  private mBG1: PIXI.Sprite;
  private mBG2: PIXI.Sprite;
  private mMoveSpeed = 20;
  private mSpeed: number;
  private mExplodeEffect: PIXI.spine.Spine;
  private mQuizSet: QuizSet;

  private mCar: PIXI.Sprite;
  private mStopSound: PIXI.sound.Sound;
  private mCarStartSound: PIXI.sound.Sound;
  private mExplodeSound: PIXI.sound.Sound;

  private mTicker: PIXI.Ticker;
  set ticker(v: boolean) {
    if (v == false) this.mTicker.remove(this.removeAllListeners);
    this.mTicker.destroy();
    this.mTicker = null;
  }

  get quizSet(): QuizSet {
    return this.mQuizSet;
  }

  constructor() {
    super();

    let texture = App.Handle.currentGame.getViewerResource("bg_ver_1.png")
      .texture;
    if (Math.random() > 0.5) {
      texture = App.Handle.currentGame.getViewerResource("bg_ver_2.png")
        .texture;
    }

    this.mSpeed = this.mMoveSpeed;
    this.mBGRoot = new PIXI.Container();
    this.addChild(this.mBGRoot);

    this.mBG1 = new PIXI.Sprite(texture);
    this.mBG2 = new PIXI.Sprite(texture);
    this.mBG2.y = -720;
    this.mBGRoot.addChild(this.mBG1);
    this.mBGRoot.addChild(this.mBG2);

    this.mQuizSet = new QuizSet();
    this.mQuizSet.position.set(1280 / 2, 0);
    this.addChild(this.mQuizSet);

    this.mCar = new PIXI.Sprite(
      App.Handle.currentGame.getViewerResource("car.png").texture
    );
    this.mCar.anchor.set(0.5);
    this.mCar.position.set(1280 / 2, 470);
    this.addChild(this.mCar);

    this.mExplodeEffect = new PIXI.spine.Spine(
      App.Handle.currentGame.getViewerResource(
        "common_effect_bomb.json"
      ).spineData
    );
    this.mCar.addChild(this.mExplodeEffect);
    this.mExplodeEffect.y = -30;
    this.mExplodeEffect.scale.set(1.5);
    this.mExplodeEffect.visible = false;

    this.mStopSound = App.Handle.currentGame.getViewerResource(
      "rm_sfx_1.mp3"
    ).sound;
    this.mCarStartSound = App.Handle.currentGame.getViewerResource(
      "rm_sfx_5.mp3"
    ).sound;
    this.mExplodeSound = App.Handle.currentGame.getViewerResource(
      "rm_sfx_6.mp3"
    ).sound;

    this.mTicker = PIXI.Ticker.shared;
    this.mTicker.add((time) => {
      this.onUpdate(time);
    });
  }

  onUpdate(t: number) {
    if (this.mTicker == null) {
      this.onUpdate = () => null;
    } else {
      this.mBGRoot.y += this.mSpeed * t;
      if (this.mBGRoot.y > 720) this.mBGRoot.y -= 720;
      if (this.mQuizSet.visible == true) {
        this.mQuizSet.y += this.mSpeed * t;
        if (this.mQuizSet.y > 1000) {
          this.mQuizSet.visible = false;
        }
      }
    }
  }

  moveCarLeft(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mCarStartSound.play();
      this.mQuizSet.turnoff(0);
      const t = gsap.timeline();
      t.to(this.mCar, { angle: -20, x: 400, duration: 1 });
      t.to(this.mCar, { angle: 0, duration: 0.5 });
      t.to(this.mCar, { angle: 20, x: 1280 / 2, duration: 1 });
      t.to(this.mCar, { angle: 0, duration: 0.5 });
      t.play();
      this.start();
      gsap.delayedCall(2, () => resolve());
    });
  }

  moveCarRight(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.mCarStartSound.play();
      this.mQuizSet.turnoff(2);
      const t = gsap.timeline();
      t.to(this.mCar, { angle: 20, x: 1280 - 400, duration: 1 });
      t.to(this.mCar, { angle: 0, duration: 0.5 });
      t.to(this.mCar, { angle: -20, x: 1280 / 2, duration: 1 });
      t.to(this.mCar, { angle: 0, duration: 0.5 });
      t.play();
      this.start();
      gsap.delayedCall(2, () => resolve());
    });
  }

  moveCarLeftDie(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // this.mQuizSet.turnoff( 0 );
      this.mCarStartSound.play();
      const t = gsap.timeline();
      t.to(this.mCar, {
        angle: -20,
        x: 400,
        y: 200,
        duration: 0.5,
        ease: "none",
      });
      // t.to( this.mCar, { angle: 0, y:200,  duration: 1,ease:"none" })
      t.play();
      gsap.delayedCall(0.5, () => {
        this.mExplodeSound.play();
        this.mExplodeEffect.visible = true;
        this.mExplodeEffect.state.setAnimation(0, "effect_bomb", false);
        this.mExplodeEffect.state.clearListeners();
        this.mExplodeEffect.state.addListener({
          complete: (entry) => {
            this.mCar.visible = false;
            this.start();
            this.mCar.position.set(1280 / 2, 470 + 700);
            gsap.delayedCall(1, () => {
              this.mCar.visible = true;
              this.mCar.angle = 0;
              this.mCar.position.set(1280 / 2, 470 + 700);
              gsap.to(this.mCar, { y: 470, duration: 1 });
            });
            gsap.delayedCall(2, () => resolve());
          },
        });
      });
      // this.start();
      // gsap.delayedCall( 2, ()=>resolve() );
    });
  }

  moveCarRightDie(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // this.mQuizSet.turnoff( 2 );
      this.mCarStartSound.play();
      const t = gsap.timeline();
      t.to(this.mCar, {
        angle: 20,
        x: 1280 - 400,
        y: 250,
        duration: 0.5,
        ease: "none",
      });
      // t.to( this.mCar, { angle: 0, y:200,  duration: 1,ease:"none" })
      t.play();
      gsap.delayedCall(0.5, () => {
        this.mExplodeSound.play();
        this.mExplodeEffect.visible = true;
        this.mExplodeEffect.state.setAnimation(0, "effect_bomb", false);
        this.mExplodeEffect.state.clearListeners();
        this.mExplodeEffect.state.addListener({
          complete: (entry) => {
            this.mCar.visible = false;
            this.start();
            gsap.delayedCall(1, () => {
              this.mCar.visible = true;
              this.mCar.position.set(1280 / 2, 470 + 700);
              this.mCar.angle = 0;
              gsap.to(this.mCar, { y: 470, duration: 1 });
            });
            gsap.delayedCall(2, () => resolve());
          },
        });
      });
      // this.start();
      // gsap.delayedCall( 2, ()=>resolve() );
    });
  }

  start() {
    this.mQuizSet.start();
    gsap.to(this, { mSpeed: this.mMoveSpeed, duration: 2, ease: "easeIn" });
  }

  stop(t = 1): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.mStopSound.play();
      this.mQuizSet.stop(t);
      gsap
        .to(this, { mSpeed: 0, duration: t, ease: "easeIn" })
        .eventCallback("onComplete", () => resolve());
    });
  }

  endAnimation(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.mCarStartSound.play();
      gsap
        .to(this.mCar, { y: -100, duration: 1.5, ease: "easeIn" })
        .eventCallback("onComplete", () => resolve());
    });
  }
}
