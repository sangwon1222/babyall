import { App } from "../../../Core";
import { Sticker } from "./Sticker";
import { Canvas } from "./Canvas";
import { Rectangle } from "pixi.js";
import { SideBar } from "./SideBar";
import gsap from "gsap";

export class StickerStage extends PIXI.Container {
  private mTextButton = new PIXI.Sprite();

  private mStickerRect = new PIXI.Container();
  private mStickerBox = new PIXI.Container();

  private mMask: PIXI.Graphics;
  private mBackupY = 0;
  private mBackupPosY = 0;

  private mStickBoxDrag = false;
  private mStickerFlag = true;

  private mSticker: Sticker;

  get stickerRoot(): PIXI.Container {
    return this.mStickerBox;
  }

  private mWheelFlag = false;

  get stickerWheelFlag(): boolean{return this.mWheelFlag}
  set stickerWheelFlag(v: boolean){ this.mWheelFlag = v;}

  constructor() {
    super();

    const BG = PIXI.Sprite.from(
      App.Handle.currentGame.getResource(`sticker_toolbar_bg.png`).texture
    );
    this.addChild(BG);

    this.mStickerRect.position.set(10, 80);
    this.addChild(this.mStickerRect);
    this.mStickerRect.addChild(this.mStickerBox);

    this.makeStickerList();
    this.makeMask();

    this.mStickerRect.hitArea = new Rectangle(0, 0, 300, 640);
    this.mStickerRect.interactive = true;
    this.mStickerRect.buttonMode = true;

    this.addChild(this.mTextButton);
    this.mTextButton.hitArea = new Rectangle(0, 0, 324 / 2, 70);
    this.mTextButton.interactive = true;
    this.mTextButton.buttonMode = true;

    /**텍스트 탭  */
    this.mTextButton.on("pointertap", () => {
      (this.parent as SideBar).onText();
    });
    /**스티커 박스 */
    this.mStickerRect
      .on("pointerdown", (evt) => {
        // Canvas.Handle.focusOut();
        this.mStickBoxDrag = true;

        const calcPos = this.toLocal(evt.data.global);
        this.mBackupY = calcPos.y;

        this.mBackupPosY = this.mStickerBox.y;
      })
      .on("pointermove", (evt) => {
        if (this.mStickBoxDrag) {
          const calcPos = this.toLocal(evt.data.global);
          const deltaY = calcPos.y - this.mBackupY;
          if (deltaY > -80 && deltaY < 80) {
            // 스티커 선택이벤트가 아닌 드래그이벤트로 보낸다.
            this.mStickerFlag = true;
          } else{
            this.mStickerFlag = false;
          }
          this.mStickerBox.y = this.mBackupPosY + deltaY;
          if (this.mStickerBox.y > 0) this.mStickerBox.y = 0;
          if (this.mStickerBox.y < -(this.mStickerBox.height - 600)) {
            this.mStickerBox.y = -(this.mStickerBox.height - 600);
          }
        }
      })
      .on("pointerup", (evt) => {
        this.mStickBoxDrag = false;
        this.mStickerFlag = true;
      })
      .on("pointerupoutside", (evt) => {
        this.mStickBoxDrag = false;
        this.mStickerFlag = true;
      })
      .on("pointerout", (evt) => {
        this.mStickBoxDrag = false;
        this.mStickerFlag = true;
      });
  
      window.addEventListener("mousewheel",(evt)=>{
        if(this.stickerWheelFlag){
            if(evt['deltaY'] >0){
              this.mStickerBox.y -=50;
              if (this.mStickerBox.y < -(this.mStickerBox.height - 600)) {
                this.mStickerBox.y = -(this.mStickerBox.height - 600);
              }
            }else{
              this.mStickerBox.y +=50;
              if (this.mStickerBox.y > 0) this.mStickerBox.y = 0;
            }
        }
      })

      
  }

  private makeStickerList() {
    this.mStickerBox.removeChildren();

    const offsetX1 = 80;
    const offsetX2 = 230;
    let offsetY = 60;
    for (let i = 0; i < 10 + 4; i++) {
      if (i < 10) {
        this.mSticker = new Sticker(
          `mb_${App.Handle.appData.bookID}_${i + 1}.png`,
          true
        );
      } else {
        const nameTag = [
          `mb_logo.png`,
          `mb_nametag_1.png`,
          `mb_nametag_2.png`,
          `mb_nametag_3.png`,
        ];
        this.mSticker = new Sticker(nameTag[i - 10], true);
        this.mSticker.setNameTag();
      }
      this.mSticker.anchor.set(0.5);
      this.mSticker.reCalcWidth(100);

      this.mSticker.onSelect = (textureName: string) => {
        if(this.mStickerFlag){
          console.log("select Sticker:", textureName);
          Canvas.Handle.makeSticker(textureName);
          const stickerSound = App.Handle.currentGame.getResource(`mb_sfx_2.mp3`).sound;
          stickerSound.play();
        }
      };

      this.mSticker.y = offsetY;
      if (i % 2) {
        this.mSticker.x = offsetX2;
        offsetY += 140;
      } else {
        this.mSticker.x = offsetX1;
      }

      this.mStickerBox.addChild(this.mSticker);
      gsap
        .to(this.mSticker, { rotation: 0.1, duration: 1 })
        .yoyo(true)
        .repeat(-1);
    }
  }

  private makeMask() {
    this.mMask = new PIXI.Graphics();
    this.mMask.beginFill(0xff0000, 0.5);
    this.mMask.drawRect(20, 90, 280, 620);
    this.mMask.endFill();
    this.mStickerBox.mask = this.mMask;
    this.addChild(this.mMask);
  }
}
