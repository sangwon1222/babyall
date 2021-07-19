import { App } from "@/Activity/Core";
import gsap from "gsap";

export class SoundButton extends PIXI.Sprite {
  private mNormalTexture: PIXI.Texture;
  private mActiveTexture: PIXI.Texture;
  private mSound: PIXI.sound.Sound;
  private mDuration: number;
  private mIsPlaying: boolean;

  get soundDuration(): number {return this.mDuration;}

  constructor(sound: PIXI.sound.Sound) {
    super();

    this.mIsPlaying = false;
    this.interactive = true;
    this.buttonMode = true;
    this.mDuration=0;

    this.anchor.set(0.5);
    console.log(App.Handle.currentGame);
    this.mNormalTexture = App.Handle.currentGame.getViewerResource(
      "sound.png"
    ).texture;
    this.mActiveTexture = App.Handle.currentGame.getViewerResource(
      "sound_down.png"
    ).texture;
    this.texture = this.mNormalTexture;

    this.mSound = sound;
    this.mDuration = sound.duration;

    this.on("pointerup", async () => {
      if (this.mIsPlaying == false) {
        await this.onClick();
      }
    });
  }

  clickLock(flag: boolean) {
    this.interactive = !flag;
  }

  onClick(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.mSound == null) {resolve();}
      this.mSound.pause();
      this.mIsPlaying = true;
      this.texture = this.mActiveTexture;
      this.mSound.play();

      gsap.delayedCall(this.mSound.duration, () => {
        this.texture = this.mNormalTexture;
        this.mIsPlaying = false;
        resolve();
      });
    });
  }
}
