import * as PIXI from "pixi.js";
import gsap from "gsap";

import { App, GameBase, SceneBase } from "../../../Core";
import { CardGroup } from "../GameObject/CardGroup";

import Game from "../index";
import { LevelData } from "../Define";
import PIXISound from "pixi-sound";
import { Thumnail } from '../GameObject/Thumnail';

export class Activity extends SceneBase {
  private mBGM: PIXI.sound.Sound;
  private mBgGroup: PIXI.Container;
  private mSideBar: PIXI.Container;
  // 썸네일 그룹 클래스로

  private mThumNail: Thumnail;

  private mCardGroup: Array<CardGroup>;
  private mCurrentCardGroupIDX: number;
  private mWrongCount: number;

  get currentCardGroup(): CardGroup {
    return this.mCardGroup[this.mCurrentCardGroupIDX];
  }
  get levelData(): LevelData {
    return (App.Handle.currentGame as Game).levelData;
  }

  get wrongCount(): number {
    return this.mWrongCount;
  }
  set wrongCount(v: number) {
    this.mWrongCount = v;
  }

  static _handle: Activity;
  static get Handle(): Activity {
    return Activity._handle;
  }

  constructor() {
    super();
    Activity._handle = this;
    this.mBgGroup = null;
    this.mCardGroup = null;
    this.mWrongCount = 0;
  }

  async onInit() {
    PIXISound.stopAll();
    this.mBGM = this.game.getResource("at_bgm.mp3").sound;
    this.mBGM.play({ loop: true });
    // 백그라운드
    this.mBgGroup = new PIXI.Container();
    const bg = new PIXI.Sprite(this.game.getResource("bg_wood.png").texture);
    const sketchBook = new PIXI.Sprite(this.game.getResource("bg_book.png").texture);
    this.mBgGroup.addChild(bg);
    this.mBgGroup.addChild(sketchBook);
    this.addChild(this.mBgGroup);
    
    this.mSideBar = new PIXI.Container();
    const side = new PIXI.Sprite(this.game.getResource("right.png").texture);
    side.position.set(-110,10)
    this.mSideBar.addChild(side);
    this.mSideBar.position.set(1118, 0);
    this.addChild(this.mSideBar);

    this.onThumNail();

    this.addChild(this.currentCardGroup);
    this.start();
  }

  onStart() {
    this.currentCardGroup.onStartPlay();

    window.onkeyup = (evt) => {
      if (evt.key == "+") {
        // this.mQuizStepIDX = 4;
        this.game.goScene("outro");
        window.onkeyup = null;
      }
    };
  }

  onThumNail() {
    // 썸네일
    this.mThumNail = new Thumnail();
    this.mSideBar.addChild(this.mThumNail)
    this.mThumNail.position.set(0,80)
    this.mThumNail.ready();

    // 4단계의 알파벳이미지 넣기
    this.mCardGroup = [];
    this.mCurrentCardGroupIDX = 0;
    for (let i = 0; i < 4; i++) {
      this.mCardGroup[i] = new CardGroup(i + 1, this.levelData);
      this.mCardGroup[i].onEnd = () => {
        this.onEndCardGroup();
      };
      this.mCardGroup[i].x = 565.5;
      this.mCardGroup[i].y = 355 -(556/2);
    }
  }
  // 한개 알파벳 안의 4단계를 다 하는 과정
  async onEndCardGroup() {
    await this.mThumNail.onCorrect(this.mCurrentCardGroupIDX)
    this.removeChild(this.currentCardGroup);
    this.mCurrentCardGroupIDX += 1;
    if (this.mCurrentCardGroupIDX >= 4) {
        this.onNext();
    } else {
        this.addChild(this.currentCardGroup);
        this.currentCardGroup.onStartPlay();
    }
  }

  onEnd() {
    //
  }

  onNext() {
    gsap.to(this.mSideBar,{alpha:0,duration:0.5})
    .eventCallback('onComplete',()=>{this.game.goScene("outro");})
  }
}
