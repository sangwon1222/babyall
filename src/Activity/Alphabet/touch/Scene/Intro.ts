import gsap from "gsap";
import { App, GameBase, SceneBase } from "../../../Core";
import PIXISound from "pixi-sound";
// import { Thumnail } from '../GameObject/Thumnail';

export class Intro extends SceneBase {
  private mBgGroup: PIXI.Container;
  private mSideBar: PIXI.Container;

  async onInit() {
    PIXISound.stopAll();
    this.onBackground();
    await this.game.endLoadingScreen();
    await this.game.startReadyScreen(2, "al_touch");
    this.start();
  }

  onStart() {
    PIXISound.stopAll();

    this.onThumSet();
  }
  onBackground() {
    this.mBgGroup = new PIXI.Container();
    this.mSideBar = new PIXI.Container();
    const bg = new PIXI.Sprite(this.game.getResource("bg_wood.png").texture);
    this.mBgGroup.addChild(bg);
    this.addChild(this.mBgGroup);
    
    const side = new PIXI.Sprite(this.game.getResource("right.png").texture);
    side.position.set(-110,10)
    this.mSideBar.addChild(side);
    this.addChild(this.mSideBar);
    this.mSideBar.position.set(1118+400, 0);
  }

  onThumSet() {
    const sketchBook = new PIXI.Sprite(this.game.getResource("bg_book.png").texture);
    this.mBgGroup.addChild(sketchBook);
    gsap.from(sketchBook,{y:-720,duraiton:1})
    // 썸네일
    // const thumNail = new Thumnail();
    // this.mSideBar.addChild(thumNail)
    // thumNail.position.set(0,80)
   
    gsap.to(this.mSideBar,{x:1118,duration:0.5,delay:1})
    gsap.delayedCall(1.5, () => {this.onNext();});
    
  }

  onNext() {
    // this.game.goScene("outro");
    this.game.goScene("activity");
  }

  onEnd() {
    console.log("[intro] onEnd");
  }
}
