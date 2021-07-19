import * as PIXI from "pixi.js";
import "pixi-spine";
import PIXISound from "pixi-sound";
import { gsap } from "gsap";

import { SceneBase } from "./SceneBase";
import { App } from "./App";
import { ResourceLoadTable } from "./Define";

import { LoadingScreen } from "./Popup/LoadingScreen";
import { ResourceManager } from "./ResourceManager";
import { ReadyScreen } from "./Popup/ReadyScreen";
import { EOP } from "./Popup/EOP";
import { MenuScreen } from "./Popup/MenuScreen";
import { GameHowto } from "./GameHowTo";
import Util from "@/Util";
import { UserModule } from "@/store/UserStore";
import { StoryBooksModule } from "@/store/StoryBooks";
import { SystemModule } from "@/store/System";

/*
    <알파벳스쿨>
    1. catch 4
    2. match 4
    3. touch 4
    4. block 4
    5. quiz 4

    <스토리북스>
    1. movie 2
    2. catch 3
    3. touch 3
    4. match 4
    5. finder 5
    6. quiz 4
    7. makingbook 4
    */

function getHowtoPageCount(cate, activity) {
  if (cate == "alphabet") {
    //
    if (activity == "catch") return 4;
    if (activity == "match") return 4;
    if (activity == "touch") return 4;
    if (activity == "block") return 4;
    if (activity == "quiz") return 4;
  }
  if (cate == "storybooks") {
    if (activity == "movie") return 2;
    if (activity == "catch") return 3;
    if (activity == "touch") return 3;
    if (activity == "match") return 4;
    if (activity == "finder") return 5;
    if (activity == "quiz") return 4;
    if (activity == "makingbook") return 4;
  }
  return 0;
}
export class GameBase extends PIXI.Container {
  protected mLoadingScreen: LoadingScreen;
  protected mReadyScreen: ReadyScreen;
  protected mEOP: EOP;
  protected mMenuScreen: MenuScreen;
  private mGameHowto: GameHowto;
  private mPageTexture: Array<PIXI.Texture>;
  // scene관련
  private mSceneRoot: PIXI.Container;
  private mScene: { [name: string]: SceneBase };
  private mCurrentSceneIDX: string;

  private mGameData: any;
  private mViewerData: any;
  private mGameName: string;

  private mPlayStartT: number;

  private mDimmed: PIXI.Graphics;

  get gameName(): string {
    return this.mGameName;
  }
  get currentScene(): SceneBase {
    return this.mScene[this.mCurrentSceneIDX];
  }
  get gameData(): any {
    return this.mGameData;
  }
  get appData(): any {
    return App.Handle.appData;
  }
  get viewerData(): any {
    return this.mViewerData;
  }
  get playTime(): number {
    const now = Date.now();
    return (now - this.mPlayStartT) / 1000;
  }

  //-----------------------------------------

  constructor(name: string) {
    super();

    this.mGameName = name;

    this.mSceneRoot = new PIXI.Container();
    this.addChild(this.mSceneRoot);

    this.mScene = {};
    this.mCurrentSceneIDX = "";
    this.mGameData = {};
    this.mViewerData = {};

    this.mLoadingScreen = new LoadingScreen();
    this.mReadyScreen = new ReadyScreen();
    this.mEOP = new EOP();

    this.mPageTexture = [];

    this.mDimmed = new PIXI.Graphics();
    this.mDimmed.beginFill(0x0000, 0.5);
    this.mDimmed.drawRect(0, 0, 1280, 720);
    this.mDimmed.endFill();
    this.addChild(this.mDimmed);

    if (Util.Config.excuteMode == "saleskit") {
      console.log(
        `%c Sales Kit Mode`,
        `border:1px red solid; padding-right:1rem;`
      );
    } else {
      console.log(`%c Main Mode`, `border:1px red solid; padding-right:1rem;`);
      this.mMenuScreen = new MenuScreen();
      this.mMenuScreen.visible = false;
      this.addChild(this.mMenuScreen);
      if (
        App.Handle.currentCategory == "alphabet" ||
        App.Handle.currentCategory == "storybooks"
      ) {
        this.makeHowTo();
      }
    }
  }
  async makeHowTo() {
    await UserModule.getHowToData();

    if (Util.Config.excuteMode == "main") {
      if (App.Handle.currentCategory == "storybooks") {
        if (SystemModule.isDemoMode === true) {
          this.mGameHowto = new GameHowto();
          this.addChild(this.mGameHowto);
        } else {
          const completeActCount =
            StoryBooksModule.finishResultData[App.Handle.appData.bookID]
              .cpltAcvtCnt;
          for (let i = 0; i < completeActCount; i++) {
            UserModule.howtoData[App.Handle.currentCategory][i] = true;
          }

          if (
            UserModule.howtoData[App.Handle.currentCategory][this.mGameName] ==
            false
          ) {
            this.mGameHowto = new GameHowto();
            this.addChild(this.mGameHowto);
          }
        }
      }
    }
  }

  getResource(path: string): PIXI.LoaderResource {
    return this.getViewerResource(path);
  }

  getViewerResource(fname: string): PIXI.LoaderResource {
    let prefix = "";
    if (this.gameName == "") {
      prefix = `${App.Handle.currentCategory}`;
    } else {
      prefix = `${App.Handle.currentCategory}/${this.gameName}`;
    }
    return ResourceManager.Handle.getViewerResource(`${prefix}/${fname}`);
  }
  getProductResource(fname: string): PIXI.LoaderResource {
    let prefix = "";
    if (this.gameName == "") {
      prefix = `${App.Handle.currentCategory}`;
    } else {
      prefix = `${App.Handle.currentCategory}/${this.gameName}`;
    }

    return ResourceManager.Handle.getProductResource(`${prefix}/${fname}`);
  }

  public async _loadProductResource(
    infoList: ResourceLoadTable
  ): Promise<void> {
    let prefix = "";
    if (this.gameName == "") {
      prefix = `${App.Handle.currentCategory}`;
    } else {
      prefix = `${App.Handle.currentCategory}/${this.gameName}`;
    }
    await ResourceManager.Handle.loadProductResource(`${prefix}`, infoList);
  }

  public async _loadViewerResource(infoList: ResourceLoadTable): Promise<void> {
    let prefix = "";
    if (this.gameName == "") {
      prefix = `${App.Handle.currentCategory}`;
    } else {
      prefix = `${App.Handle.currentCategory}/${this.gameName}`;
    }
    await ResourceManager.Handle.loadViewerResource(prefix, infoList);
  }

  clear() {
    ResourceManager.Handle.destroy();
    this.mScene = {};
    this.mCurrentSceneIDX = "";
    this.mGameData = {};
    this.mViewerData = {};
    this.mSceneRoot.removeChildren();
  }
  addScene(name: string, scene: SceneBase) {
    this.mScene[name] = scene;
  }
  async goScene(name: string) {
    // if( this.mLoadingScreen.nextGameFlag === false ){
    //     PIXISound.stopAll();
    //     this.mSceneRoot.removeChildren;
    //     return ;
    // }
    if (this.mScene[name] === undefined) {
      // console.error(`해당 Scene[${name}]은 존재하지 않습니다.`)
      return;
    }
    console.log("PIXI.sound stopAll", PIXI);
    if (window["video"]) {
      window["video"].pause();
      window["video"] = null;
    }
    if (PIXI.sound) {
      console.log("PIXI.sound stopAll");
      PIXI.sound.stopAll();
    }
    this.mSceneRoot.removeChildren();

    if (this.mScene[this.mCurrentSceneIDX] !== undefined) {
      await this.mScene[this.mCurrentSceneIDX].onEnd();
    }

    console.log("[goScene]", name);
    this.mSceneRoot.addChild(this.mScene[name]);
    this.mCurrentSceneIDX = name;

    this.mScene[name].removeChildren();
    this.mScene[name].onInit();
  }

  async startLoadingScreen() {
    await this.mLoadingScreen.init();
    this.addChild(this.mLoadingScreen);
    this.mLoadingScreen.start();
    if (this.mMenuScreen) {
      await this.mMenuScreen.init();
    }
  }

  async endLoadingScreen() {
    // console.warn(App.Handle.currentCategory)
    if (App.Handle.currentCategory == "mypet") {
      this.removeChild(this.mDimmed);
    }
    if (Util.Config.excuteMode == "main") {
      if (
        App.Handle.currentCategory == "alphabet" ||
        App.Handle.currentCategory == "storybooks"
      ) {
        this.mPageTexture = [];
        const cnt = getHowtoPageCount(
          App.Handle.currentCategory,
          App.Handle.currentGame.gameName
        );
        for (let i = 0; i < cnt; i++) {
          this.mPageTexture.push(
            App.Handle.currentGame.getViewerResource(`howto0${i + 1}.png`)
              .texture
          );
        }

        if (this.mGameHowto) await this.mGameHowto.init(this.mPageTexture);
      }
    }
    await this.mLoadingScreen.end();
    this.removeChild(this.mLoadingScreen);

    if (this.mGameHowto !== undefined) {
      await this.mGameHowto.ready();
    }
  }

  async startReadyScreen(readyType: number, title = "") {
    // if(!this.mLoadingScreen.end()){return;}
    await this.mReadyScreen.init();
    this.addChild(this.mReadyScreen);

    await this.mReadyScreen.start(readyType, title);

    this.removeChild(this.mDimmed);
    this.removeChild(this.mReadyScreen);

    if (this.mMenuScreen) this.mMenuScreen.visible = true;
  }

  async startEOPScreen(eopType: number, isSB = false) {
    if (this.mMenuScreen) this.mMenuScreen.visible = false;

    await this.mEOP.init(isSB);
    this.addChild(this.mEOP);
    await this.mEOP.start(eopType);
    this.mEOP.clear();
    this.removeChild(this.mEOP);
  }

  async startGame() {
    this.mPlayStartT = Date.now();
    this.onStartGame();
  }

  async endGame() {
    console.log("gameEND:", this.gameName, this.playTime);
    if (this.mScene[this.mCurrentSceneIDX] !== undefined) {
      await this.mScene[this.mCurrentSceneIDX].onEnd();
    }
    this.onEndGame();
    gsap.globalTimeline.clear();
    PIXISound.stopAll();
  }

  //-------------------------------------
  onStartGame() {
    //
  }
  onEndGame() {
    //
  }

  //-------------------------------------
}
