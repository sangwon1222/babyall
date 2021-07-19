import { App } from "../../../Core";
import { Rectangle } from "pixi.js";
import { SideBar } from "./SideBar";
import { Canvas } from "./Canvas";
import { ColorController } from "./ColorController";

const textTable = [
  0xb80606,
  0x1a8c20,
  0xf1bb00,
  0xfd8f4c,
  0x4aaca7,
  0x29bbef,
  0xc174d4,
  0x000000,
  0xbebebe,
];

const paintTable = [
  0xf25a00,
  0x34af3a,
  0x088f88,
  0xffd318,
  0x00b1e7,
  0xf43255,
  0xd12020,
  0x89bc1b,
  0x036ab7,
  0xa72ae9,
  0x98461a,
  0xa9a9a9,
];

export class TextStage extends PIXI.Container {
  private mStickerButton = new PIXI.Sprite();

  private mTextScreen = new PIXI.Container();
  private mTextBox = new PIXI.Container();
  private mTextArray: Array<ColorController>;

  private mPaintScreen = new PIXI.Container();
  private mPaintBox = new PIXI.Container();
  private mPaintArray: Array<ColorController>;

  private mTextMask: PIXI.Graphics;
  private mPaintMask: PIXI.Graphics;

  private mTextBackupY = 0;
  private mTextBackupPosY = 0;

  private mPaintBackupY = 0;
  private mPaintBackupPosY = 0;

  private mTextBoxDrag = false;
  private mTextBoxDragMove = false;

  private mPaintBoxDrag = false;
  private mPaintBoxDragMove = false;

  private mWheelFlag = true;

  get paintBoxWheelFlag(): boolean{return this.mWheelFlag}
  set paintBoxWheelFlag(v: boolean){ this.mWheelFlag = v;}

  constructor() {
    super();
    const BG = PIXI.Sprite.from(
      App.Handle.currentGame.getResource(`text_toolbar_bg.png`).texture
    );
    this.mTextArray = [];
    this.mPaintArray = [];

    this.mTextScreen.position.set(10, 80);
    this.mTextScreen.addChild(this.mTextBox);

    this.mPaintScreen.position.set(10, 310);
    this.mPaintScreen.addChild(this.mPaintBox);

    this.addChild(BG, this.mTextScreen, this.mPaintScreen);

    this.makeText();
    this.makePaint();

    this.makeTextMask();
    this.makePaintMask();

    this.mTextScreen.hitArea = new Rectangle(0, 0, 300, 390);
    this.mTextScreen.interactive = true;
    this.mTextScreen.buttonMode = true;

    this.mPaintScreen.hitArea = new Rectangle(0, 0, 300, 390);
    this.mPaintScreen.interactive = true;
    this.mPaintScreen.buttonMode = true;

    this.mStickerButton.interactive = true;
    this.mStickerButton.buttonMode = true;
    this.mStickerButton.hitArea = new Rectangle(324 / 2, 0, 324 / 2, 70);
    this.addChild(this.mStickerButton);

    /**스티커탭 */
    this.mStickerButton.on("pointertap", () => {
      (this.parent as SideBar).onSticker();
    });
    // /**텍스트 박스  */
    // this.mTextScreen.on("pointerdown",( evt )=>{
    //     console.log(`페인트박스 클릭`)
    //     this.mTextBoxDrag = true;
    //     this.mTextBoxDragMove = false;

    //     const calcPos = this.toLocal( evt.data.global );
    //     this.mTextBackupY = calcPos.y;
    //     this.mTextBackupPosY = this.mTextBox.y;
    // })
    // .on("pointermove",(evt)=>{
    //     if(this.mTextBoxDrag){
    //         const calcPos = this.toLocal( evt.data.global );
    //         const deltaY = calcPos.y - this.mTextBackupY;
    //         if( deltaY > -3 && deltaY < 3){
    //             //페인트박스 드래그 스탑
    //         }else{
    //             this.mTextBoxDragMove = true;
    //         }
    //         this.mTextBox.y = this.mTextBackupPosY + deltaY;
    //         if(this.mTextBox.y > 0){this.mTextBox.y =0}
    //         if(this.mTextBox.y < -(this.mTextBox.height/4) ){this.mTextBox.y = -(this.mTextBox.height/4)}
    //     }
    // })
    // .on("pointerup",()=>{ this.mTextBoxDrag  = false; })
    // .on("pointerupoutside",()=>{ this.mTextBoxDrag  = false; })

    /**페인트 박스  */
    this.mPaintScreen
      .on("pointerdown", (evt) => {
        this.mPaintBoxDrag = true;
        this.mPaintBoxDragMove = false;

        const calcPos = this.toLocal(evt.data.global);
        this.mPaintBackupY = calcPos.y;
        this.mPaintBackupPosY = this.mPaintBox.y;
      })
      .on("pointermove", (evt) => {
        if (this.mPaintBoxDrag) {
          const calcPos = this.toLocal(evt.data.global);
          const deltaY = calcPos.y - this.mPaintBackupY;
          if (deltaY > -80 && deltaY < 80) {
            //페인트박스 드래그 스탑
          } else {
            this.mPaintBoxDragMove = true;
          }
          this.mPaintBox.y = this.mPaintBackupPosY + deltaY;
          if (this.mPaintBox.y > 0) {
            this.mPaintBox.y = 0;
          }
          if (this.mPaintBox.y < -(this.mPaintBox.height - 370)) {
            this.mPaintBox.y = -(this.mPaintBox.height - 370);
          }
        }
      })
      .on("pointerup", () => {
        this.mPaintBoxDrag = false;
      })
      .on("pointerupoutside", () => {
        this.mPaintBoxDrag = false;
      });
    
    window.addEventListener("mousewheel",(evt)=>{
      if(this.paintBoxWheelFlag){
        if(evt['deltaY'] >0){
          this.mPaintBox.y -=50;
          if (this.mPaintBox.y < -(this.mPaintBox.height - 370)) {
            this.mPaintBox.y = -(this.mPaintBox.height - 370);
          }
        }else{
          this.mPaintBox.y +=50;
          if (this.mPaintBox.y > 0) { this.mPaintBox.y = 0; }
        }
      }
    })
  
  }

  makeText() {
    this.mTextBox.removeChildren();

    const offsetX1 = 20;
    const offsetX2 = 120;
    const offsetX3 = 220;
    let offsetY = 0;
    for (let i = 0; i < textTable.length; i++) {
      const text = new ColorController(
        textTable[i],
        `text_${i + 1}.png`,
        `check_text_btn.png`
      );
      text.onSelectColor = (colorValue: number) => {
        Canvas.Handle.tintText(textTable[i], i + 1);
        const textSound = App.Handle.currentGame.getResource(`mb_sfx_3.mp3`)
          .sound;
        textSound.play();
        console.log(
          `%c 텍스트버튼 눌렀을때 소리 교체 필요`,
          "border:1px red solid;"
        );
        this.initTextButton();
        text.clickButton(`text`);
      };
      text.y = offsetY;
      const index = i % 3;
      if (index == 0) {
        text.position.set(offsetX1, offsetY);
      } else if (index == 1) {
        text.position.set(offsetX2, offsetY);
      } else {
        text.position.set(offsetX3, offsetY);
        offsetY += text.height;
        // offsetY += text.height+20; 터치드래그 필요시
      }
      this.mTextArray.push(text);
      this.mTextBox.addChild(text);
    }
  }

  initTextButton() {
    for (let i = 0; i < textTable.length; i++) {
      this.mTextArray[i].initButton(`text`);
    }
  }

  makeTextMask() {
    this.mTextMask = new PIXI.Graphics();
    this.mTextMask.beginFill(0xff0000, 0.5);
    this.mTextMask.drawRoundedRect(10, 80, 300, 220, 25);
    this.mTextMask.endFill();
    this.mTextBox.mask = this.mTextMask;
    this.addChild(this.mTextMask);
  }

  makePaint() {
    this.mPaintBox.removeChildren();

    const offsetX1 = 10;
    const offsetX2 = 150;
    let offsetY = 10;
    for (let i = 0; i < paintTable.length; i++) {
      const paint = new ColorController(
        paintTable[i],
        `paint_${i + 1}.png`,
        `check_box.png`,
        `paint_box.png`
      );
      paint.onSelectColor = (colorValue: number) => {
        if (this.mPaintBoxDragMove == false) {
          const paintSound = App.Handle.currentGame.getResource(`mb_sfx_3.mp3`)
            .sound;
          paintSound.play();
          Canvas.Handle.tintCanvas(colorValue);
          this.initPaintButton();
          paint.clickButton(`paint`);
        }
      };
      paint.y = offsetY;
      if (i % 2) {
        paint.x = offsetX2;
        offsetY += paint.height + 10;
      } else {
        paint.x = offsetX1;
      }
      this.mPaintArray.push(paint);
      this.mPaintBox.addChild(paint);
    }
  }

  initPaintButton() {
    for (let i = 0; i < 12; i++) {
      this.mPaintArray[i].initButton(`paint`);
    }
  }

  private makePaintMask() {
    this.mPaintMask = new PIXI.Graphics();
    this.mPaintMask.beginFill(0xff0000, 0.5);
    this.mPaintMask.drawRect(10, 310, 310, 390);
    this.mPaintMask.endFill();
    this.mPaintBox.mask = this.mPaintMask;
    this.addChild(this.mPaintMask);
  }
}
