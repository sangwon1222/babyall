import { Canvas } from "./Canvas";
import { SideBar } from "./SideBar";
import { App } from "../../../Core";
import gsap from "gsap";
import { CompleteButton } from "./CompleteButton";
import Axios from "axios";
import Util from "@/Util";
import { SystemModule } from "@/store/System";
import Swal from "sweetalert2";

export class Stage extends PIXI.Container {
  private mCanvas = new Canvas();
  private mSideBar = new SideBar();

  private mShotEffect: PIXI.Graphics;

  static _handle: Stage;
  static get Handle(): Stage {
    return Stage._handle;
  }

  constructor() {
    super();

    Stage._handle = this;

    this.mSideBar.position.set(1280 - this.mSideBar.width, 0);
    this.addChild(this.mCanvas);
    this.addChild(this.mSideBar);

    this.mShotEffect = new PIXI.Graphics();
    this.mShotEffect.beginFill(0xffffff);
    this.mShotEffect.drawRect(0, 0, 1280, 720);
    this.mShotEffect.endFill();
    this.mShotEffect.blendMode = PIXI.BLEND_MODES.ADD;
  }

  makeScreenShot(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const renderTexture = PIXI.RenderTexture.create({
        width: 951,
        height: 720,
      });
      App.Handle.renderer.render(this.mCanvas, renderTexture);

      this.addChild(this.mShotEffect);
      gsap
        .to(this.mShotEffect, { alpha: 0, duration: 0.5 })
        .eventCallback("onComplete", () => {
          this.removeChild(this.mShotEffect);
        });

      const canvas = App.Handle.renderer.extract.canvas(renderTexture);
      canvas.toBlob((b) => {
        // 서버로 학습결과를 전송
        if (Util.Config.excuteMode == "main" && SystemModule.token != "") {
          // 서버로 전송
          const fd = new FormData();
          fd.set("bookID", App.Handle.appData.bookID);
          fd.set("screenshot", b);
          Axios.post(
            `${Util.Config.restAPIProd}/learning/child/storybook/screenshot`,
            fd
          );
        } else {
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(b, "capture.png");
          } else {
            navigator;
            const link = document.createElement("a");
            link.download = "capture.png";
            link.href = canvas.toDataURL("image/png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      }, "image/png");
      gsap.delayedCall(1, () => {
        resolve();
      });
    });
  }
}
