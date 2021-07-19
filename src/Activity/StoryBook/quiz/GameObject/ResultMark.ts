import { App } from "@/Activity/Core";
// import gsap from "gsap"
import { gsap } from "gsap";

export class ResultMark extends PIXI.Sprite {
  private mCorrectTexture: PIXI.Texture;
  private mWrongTexture: PIXI.Texture;

  constructor() {
    super();
    this.mCorrectTexture = App.Handle.currentGame.getViewerResource(
      "correct.png"
    ).texture;
    this.mWrongTexture = App.Handle.currentGame.getViewerResource(
      "wrong.png"
    ).texture;
    this.anchor.set(0.5);
    this.texture = this.mCorrectTexture;
    this.visible = false;
  }

  show(isCorrect: boolean , delayTime: number ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        this.visible = true;
        this.alpha = 0;
        if (isCorrect) {
            App.Handle.currentGame.getViewerResource("sq_sfx_1.mp3").sound.play();
            this.texture = this.mCorrectTexture;
        } else {
            App.Handle.currentGame.getViewerResource("sq_sfx_2.mp3").sound.play();
            this.texture = this.mWrongTexture;
        }

        gsap.to(this, { alpha: 1, duration: 0.5 })
        .eventCallback("onComplete", () => {
            gsap.to(this, { alpha: 0, duration: 0.5, delay: 1 });
            gsap.delayedCall(2+delayTime, () => { resolve();});
        });
    });
  }
}
