import { App } from "@/Activity/Core";
import gsap from "gsap";
import { CardBG } from "./CardBG";

export class SoundButton extends PIXI.Sprite {
  private mNormalTexture: PIXI.Texture;
  private mActiveTexture: PIXI.Texture;
  private mSound: PIXI.sound.Sound;
  private mDuration: number;
  private mIsPlaying: boolean;
  private mRepeatSound: TweenLite;
  private mCard: any;

  get soundDuration(): number {return this.mDuration;}

  constructor(sound: PIXI.sound.Sound) {
    super();

    this.mIsPlaying = false;
    this.interactive = true;
    this.buttonMode = true;
    this.mDuration=0;

    this.anchor.set(0.5);
    // console.log(App.Handle.currentGame);
    this.mNormalTexture = App.Handle.currentGame.getViewerResource(
      "sound.png"
    ).texture;
    this.mActiveTexture = App.Handle.currentGame.getViewerResource(
      "sound_down.png"
    ).texture;
    this.texture = this.mNormalTexture;

    this.mSound = sound;
    this.mDuration = sound.duration;

    this.on("pointerup", () => {
      if (this.mIsPlaying == false) {
        this.repeatSound(true, this.mCard);
      }
    });
  }

  clickLock(flag: boolean) {
    this.interactive = !flag;
  }

  onClick(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.mSound == null) {resolve();}
      this.mIsPlaying = true;
      this.mSound.play();
      this.texture = this.mActiveTexture;

      gsap.delayedCall(this.mSound.duration, () => {
        this.texture = this.mNormalTexture;
        this.mIsPlaying = false;
        resolve();
      });
    });
  }

  async repeatSound(flag?: boolean, card?: any) {
    this.mCard = card;
    if (this.mSound != undefined) this.mSound.pause();
    if (this.mRepeatSound) this.mRepeatSound.kill();
    this.mRepeatSound = undefined;
    this.clickLock(false);

    /**반복 재생 */
    if (flag != false) {
      flag = true;
    }
    /**반복 끝 다음스텝으로 ㄱ */
    if (flag == false) {
        const sound = this.mSound;
        this.mSound = null;
        this.mCard = null;
        sound.play();
        this.texture = this.mActiveTexture;
        gsap.delayedCall(sound.duration,()=>{  this.texture = this.mNormalTexture;  return; })
        
    }

    /**공통 작업 */
    if (this.mCard) this.mCard.waitingAnimation();
    await this.onClick();

    const delayTime = 5;

    if (this.mSound != null) {
      this.mRepeatSound = gsap.delayedCall(delayTime, () => {
        this.repeatSound(true, this.mCard);
      });
    }
  }

}
