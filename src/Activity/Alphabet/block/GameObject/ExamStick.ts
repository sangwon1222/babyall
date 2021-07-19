import gsap from "gsap";
import { App, Util } from "../../../Core";
import { WordBox, GameType2, ExamBox } from "./";
import { Activity } from "../Scene";
import { QuizDataType2 } from "../Define";
// ==================두번째 유형====================
export class ExamStick extends PIXI.Sprite {
  private mPath: string;
  private mBoxInCheck: boolean;
  private mStepCount: 0;
  private mReturnPos: PIXI.Point;
  private mDragFlag = false;
  private mDeltaByClick = new PIXI.Point(0, 0);
  private mArrow: PIXI.Sprite;
  private mBlink: PIXI.Sprite;
  private mBlinkTimeLine: gsap.core.Timeline;

  private mTextureOpened: PIXI.Texture;
  private mTextureClosed: PIXI.Texture;

  get path(): string {
    return this.mPath;
  }
  get stepCount(): number {
    return this.mStepCount;
  }
  get isOpened(): boolean {
    return this.texture == this.mTextureOpened;
  }

  constructor(closeImageFileName: string, openImageFileName: string) {
    super();
    this.mPath = openImageFileName;
    this.mTextureOpened = App.Handle.currentGame.getProductResource(
      openImageFileName
    ).texture;
    this.mTextureClosed = App.Handle.currentGame.getProductResource(
      closeImageFileName
    ).texture;
    this.texture = this.mTextureClosed;

    this.interactive = true;
    this.mArrow = new PIXI.Sprite();
    this.mArrow.anchor.set(0.5, 1);
    this.mArrow.texture = App.Handle.currentGame.getResource(`arrow.png`).texture;
    this.mArrow.scale.set(2)

    this.mArrow.x = this.width / 2;
    this.mArrow.visible = false;
    this.addChild(this.mArrow);

    this.mBlink = PIXI.Sprite.from(this.mTextureClosed);
    this.mBlink.visible = false;
    this.addChild(this.mBlink);

    this.on("pointermove", (evt) => {
      if (this.mDragFlag) {
        this.onDragging(evt);
      }
    });
    this.scale.set(0.35);
  }

  onDragging(evt: PIXI.InteractionEvent) {
    const localPos = this.parent.toLocal(
      new PIXI.Point(evt.data.global.x, evt.data.global.y)
    );
    const x = localPos.x - this.mDeltaByClick.x;
    const y = localPos.y - this.mDeltaByClick.y;
    this.position.set(x, y);
    const WRsound = App.Handle.currentGame.getResource(`ab_sfx_2.mp3`).sound;
    if (
      localPos.x > 600 ||
      localPos.x < -300 ||
      localPos.y > 200 ||
      localPos.y < -300
    ) {
      this.mDragFlag = false;
      WRsound.play();
      gsap.to(this, {
        x: this.mReturnPos.x,
        y: this.mReturnPos.y,
        duration: 0.5,
        ease: "back",
      });
    }
  }

  onDragStart() {
    this.buttonMode = true;
    this.mReturnPos = new PIXI.Point(this.x, this.y);
  }

  onDragEnd(globalMPos: PIXI.IPoint) {
    // WordBos에 놓였는지 검사.
    const wbox = Activity.Handle.getCurrentWordBox();
    const localMPos = wbox.stage.toLocal(globalMPos);
    if (wbox.stage.hitArea.contains(localMPos.x, localMPos.y)) {
      this.mBoxInCheck = true;
    } else {
      this.mBoxInCheck = false;
    }
    const gPos = this.toGlobal(new PIXI.Point(0, 0));
    this.stickCheck(gPos);
  }

  focusPointerUp(globalMPos: PIXI.IPoint) {
    if (this.mDragFlag == false) return;
    this.mDragFlag = false;
    this.buttonMode = false;
    this.onDragEnd(globalMPos);
  }

  checkTouchDown(gMPos: PIXI.IPoint): boolean {
    if (Util.getColorByPoint(this, new PIXI.Point(gMPos.x, gMPos.y)).a != 0) {
      this.mDragFlag = true;
      const localPos = this.parent.toLocal(new PIXI.Point(gMPos.x, gMPos.y));
      this.mDeltaByClick.x = localPos.x - this.x;
      this.mDeltaByClick.y = localPos.y - this.y;
      this.buttonMode = true;
      this.onDragStart();
      return true;
    } else {
      return false;
    }
  }

  stickCheck(gPos: PIXI.IPoint) {
    const wbox = Activity.Handle.getCurrentWordBox();
    const ebox = Activity.Handle.getCurrentExamBox();
    if (this.mBoxInCheck == true) {
      const result = wbox.setStick(this.mPath, gPos);
      if (result == true) {
        ebox.onCorrect();
        this.x = this.mReturnPos.x;
        this.y = this.mReturnPos.y;
        this.visible = false;
      } else {
        ebox.onWrong();
        gsap.to(this, {
          x: this.mReturnPos.x,
          y: this.mReturnPos.y,
          duration: 0.5,
        });
      }
    }
  }

  open(visibleArrow = false) {
    this.texture = this.mTextureOpened;
    if (App.Handle.appData.level != 3) {
      this.mArrow.visible = visibleArrow;
      this.hint(visibleArrow);
    }
  }

  close() {
    this.texture = this.mTextureClosed;
    this.mArrow.visible = false;
    this.mBlink.visible = false;
  }

  onArrowPos(Pos: number) {
    this.mArrow.y = -Pos;
  }

  hint(flag: boolean) {
    this.mBlink.visible = flag;
    this.mBlink.alpha = 0;
    if (this.mBlinkTimeLine) {
      this.mBlinkTimeLine.kill();
    }
    gsap.delayedCall(0.5, () => {
      if (flag) {
        const blinkTime = 0.3;
        this.mBlinkTimeLine = gsap.timeline({ repeat: 1 });
        this.mBlinkTimeLine.to(this.mBlink, { alpha: 1, duration: blinkTime });
        this.mBlinkTimeLine.to(this.mBlink, { alpha: 0, duration: blinkTime });
        this.mBlinkTimeLine.eventCallback("onComplete", () => { this.mBlinkTimeLine.kill(); });
      } else {
        console.log(`힌트 끝`);
        if (this.mBlinkTimeLine) { this.mBlinkTimeLine.kill(); }
      }
    });
  }
}
