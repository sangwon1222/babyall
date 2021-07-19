import { App, SceneBase, Util } from "../../../Core";
import Game from "../index";
import gsap from "gsap";
import PIXISound from "pixi-sound";
import { Sprite, Rectangle } from "pixi.js";
import { MediaPlayer } from "dashjs";
import { UserModule } from "@/store/UserStore";
import { StoryBooksModule } from "@/store/StoryBooks";

import Config from "../../../../Util/Config";
import { SystemModule } from "@/store/System";
import { isIOS } from "@/Util/Platform";

const ProgressTextStyle = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 20,
  // fontStyle: "italic",
  fontWeight: "bold",
  fill: "#ffffff",
});

export class ProgGuage extends PIXI.Container {
  private mVideoElement: HTMLVideoElement;
  private mGaugeBG: PIXI.Sprite;
  private mGauge: PIXI.Sprite;
  private mGaugeCursor: PIXI.Sprite;
  private mIsDrag: boolean;
  private mText: PIXI.Text;

  constructor(video: HTMLVideoElement) {
    super();

    this.mVideoElement = video;

    this.mGaugeBG = new PIXI.Sprite(
      App.Handle.currentGame.getViewerResource("scroll_bg.png").texture
    );
    this.mGaugeBG.y = 20;
    this.addChild(this.mGaugeBG);

    this.hitArea = new Rectangle(0, 0, this.mGaugeBG.width, 50);

    this.mGauge = new PIXI.Sprite(
      App.Handle.currentGame.getViewerResource("scroll_bg.png").texture
    );
    this.mGauge.y = 20;
    this.mGauge.tint = 0xff4747;
    this.mGauge.scale.x = 0.5;
    this.addChild(this.mGauge);

    this.mGaugeCursor = new PIXI.Sprite(
      App.Handle.currentGame.getViewerResource("scrollbtn.png").texture
    );
    this.mGaugeCursor.anchor.set(0.5);
    this.mGaugeCursor.y = 23;
    this.addChild(this.mGaugeCursor);

    this.mText = new PIXI.Text("00:00", ProgressTextStyle);
    this.mText.anchor.set(1, 0);
    this.mText.position.set(this.mGaugeBG.width, 35);
    this.addChild(this.mText);

    this.mVideoElement.ontimeupdate = () => {
      const date = new Date(this.mVideoElement.currentTime * 1000);
      const m = "0" + date.getMinutes();
      const s = "0" + date.getSeconds();

      const dateDuration = new Date(this.mVideoElement.duration * 1000);
      const md = "0" + dateDuration.getMinutes();
      const sd = "0" + dateDuration.getSeconds();

      this.mText.text =
        m.substr(-2) +
        ":" +
        s.substr(-2) +
        " / " +
        md.substr(-2) +
        ":" +
        sd.substr(-2);
      this.mGauge.scale.x = video.currentTime / video.duration;
      this.mGaugeCursor.x = this.mGauge.width;
    };

    this.interactive = true;
    this.buttonMode = true;
    this.mIsDrag = false;
    this.on("pointerdown", (evt) => {
      this.mIsDrag = true;
      const pos = this.toLocal(evt.data.global);
      let percent = pos.x / this.width;
      if (percent < 0) {
        percent = 0;
      }
      this.mVideoElement.currentTime = this.mVideoElement.duration * percent;
      this.mGaugeCursor.x = this.mGaugeBG.width * percent;
      this.mGauge.scale.x = percent;
    });
    this.on("pointermove", (evt) => {
      if (this.mIsDrag == true) {
        const pos = this.toLocal(evt.data.global);
        let percent = pos.x / this.width;
        if (percent < 0) {
          percent = 0;
        }
        this.mVideoElement.currentTime = this.mVideoElement.duration * percent;
        this.mGaugeCursor.x = this.mGaugeBG.width * percent;
        this.mGauge.scale.x = percent;
      }
    });
    this.on("pointerup", (evt) => {
      this.mIsDrag = false;
      evt.stopPropagation();
    });
    this.on("pointerupoutside", (evt) => {
      this.mIsDrag = false;
      evt.stopPropagation();
    });
  }
}
export class PlayToogleBTN extends PIXI.Sprite {
  private mPlayTexture: PIXI.Texture;
  private mPauseTexture: PIXI.Texture;
  private mVideoElement: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    super();

    this.mPlayTexture = App.Handle.currentGame.getViewerResource(
      "play_btn.png"
    ).texture;
    this.mPauseTexture = App.Handle.currentGame.getViewerResource(
      "stop_btn.png"
    ).texture;
    this.anchor.set(0.5);
    this.texture = this.mPauseTexture;
    this.interactive = true;
    this.buttonMode = true;
    this.mVideoElement = video;
    this.on("pointerup", (evt: PIXI.InteractionEvent) => {
      if (this.mVideoElement.paused) {
        this.mVideoElement.play();
        this.texture = this.mPauseTexture;
      } else {
        this.mVideoElement.pause();
        this.texture = this.mPlayTexture;
      }
      evt.stopPropagation();
    });
  }
}

export class Dimmed extends PIXI.Graphics {
  private mVideoElement: HTMLVideoElement;
  private mPlayBTN: PlayToogleBTN;
  private mProgGuage: ProgGuage;

  constructor(video: HTMLVideoElement) {
    super();
    this.mVideoElement = video;
    this.beginFill(0x000000, 0.4);
    this.drawRect(0, 0, 1280, 720);
    this.endFill();

    this.mPlayBTN = new PlayToogleBTN(this.mVideoElement);
    this.mPlayBTN.position.set(1280 / 2, 720 / 2);
    this.addChild(this.mPlayBTN);

    this.mProgGuage = new ProgGuage(this.mVideoElement);
    this.mProgGuage.position.set(30, 650);
    this.addChild(this.mProgGuage);

    this.interactive = true;
    this.buttonMode = true;

    this.on("pointerup", () => {
      this.show(false);
    });
    this.visible = false;
  }
  show(flag: boolean) {
    console.log("show", flag, this.visible);
    if (flag == true && this.visible == false) {
      this.visible = true;
      this.alpha = 0;
      gsap.to(this, { alpha: 1, duration: 0.5 });
    } else if (flag == false && this.visible == true) {
      gsap
        .to(this, { alpha: 0, duration: 0.5 })
        .eventCallback("onComplete", () => {
          this.visible = false;
        });
    }
  }
}

export class SBMovieActivity extends SceneBase {
  // private mBGM: PIXI.sound.Sound;
  private mVideoSprite: PIXI.Sprite;
  private mVideoElement: HTMLVideoElement;
  private cb: any;

  private mDimmed: Dimmed;

  constructor() {
    super();
  }

  async onInit() {
    PIXISound.stopAll()
    // 비디오 플레이어 생성.
    this.mVideoSprite = new PIXI.Sprite();
    this.addChild(this.mVideoSprite);

    //this.mVideoElement = App.Handle.currentGame.getProductResource(`${ App.Handle.appData.bookID }/${ App.Handle.appData.bookID }.mp4`).data;
    this.mVideoElement = document.createElement("video");
    this.mVideoElement.setAttribute("playsinline", "");
    this.mVideoElement.setAttribute("autoplay", "");
    const url =
      "https://contents.arambookclub.com/contents/product/storybooks/movie/" +
      `${App.Handle.appData.bookID}.mp4`;
    this.mVideoElement.src = url;
    this.mVideoElement.crossOrigin = "";
    this.mVideoElement.autoplay = true;

    window["video"] = this.mVideoElement;

    this.cb = () => {
      if (document.hidden == false) {
        if (this.mVideoElement) this.mVideoElement.play();
      } else {
        if (this.mVideoElement) this.mVideoElement.pause();
      }
    };
    document.addEventListener("visibilitychange", this.cb);

    // const player = MediaPlayer().create();
    // player.initialize();
    // player.attachView( this.mVideoElement );
    // player.setAutoPlay( false );
    // player.attachSource( url );
    this.mVideoSprite.texture = PIXI.Texture.from(this.mVideoElement);
    this.mVideoElement.oncanplay = () => {
      this.mVideoElement.currentTime = 0;
      this.mVideoElement.pause();
      this.mVideoElement.oncanplay = null;
    };
    this.mVideoElement.onended = () => {
      App.Handle.nextGame();
    };
    // console.log( App.Handle.currentGame.getProductResource("1001.mp4").data );
    // App.Handle.currentGame.getProductResource("1001.mp4").

    if (isIOS()) {
      this.interactive = false;
      this.buttonMode = false;
    }

    this.on("pointerup", () => {
      this.mDimmed.show(true);
    });
    this.mDimmed = new Dimmed(this.mVideoElement);
    this.addChild(this.mDimmed);

    if (!isIOS()) {
      this.interactive = true;
      this.buttonMode = true;
    }
    await this.game.endLoadingScreen();

    // 레디 연출. 연출이 끝나면 시작
    await this.game.startReadyScreen(-1, "sb_movie");
    this.start();
  }

  onStart() {
    // this.mBGM.play({loop:true})
    console.log(`ACTIVITY MOVIE Start!!`);
    if (isIOS()) {
      const background = new PIXI.Graphics();
      background.beginFill(0x000000, 0.4);
      background.drawRect(0, 0, 1280, 720);
      background.endFill();
      this.addChild(background);

      const playBTN = new PIXI.Sprite(
        App.Handle.currentGame.getViewerResource("play_btn.png").texture
      );
      playBTN.anchor.set(0.5);
      playBTN.position.set(1280 / 2, 720 / 2);
      background.addChild(playBTN);

      playBTN.interactive = true;
      background.interactive = true;

      playBTN.on("pointerdown", () => {
        this.removeChild(background);
        this.mVideoElement.play();
        this.interactive = true;
        this.buttonMode = true;
      });
      background.on("pointerdown", (evt) => {
        evt.stopPropagation();
      });
      this.mVideoElement.pause();
    } else {
      this.mVideoElement.play();
    }

    window["video"] = this.mVideoElement;

    window.onkeyup = (evt) => {
      if (evt.key == "+") {
        App.Handle.nextGame();
        window.onkeyup = null;
      }
    };
  }

  onPauseStart() {
    //
    // this.mVideoElement.pause();
  }
  onPauseEnd() {
    //
  }

  onForceExit() {
    this.mVideoElement.currentTime = 0;
    this.mVideoElement.pause();
    this.mVideoElement = null;
    if (window["video"]) {
      window["video"].pause();
      window["video"] = null;
    }
  }

  async onEnd() {
    // 서버로 학습결과를 전송
    if (window["video"]) {
      window["video"].pause();
      window["video"] = null;
    }
    if (this.cb) {
      document.removeEventListener("visibilitychange", this.cb);
    }
    if (Config.excuteMode == "main" && SystemModule.token != "") {
      console.log(
        "스토리 무비 끝",
        this.game.gameName,
        App.Handle.appData.bookID,
        UserModule.childSetting.lrngChoLvlCd
        // this.mWrongCount
      );
      StoryBooksModule.setActivityEnd({
        activity: this.game.gameName,
        endinfo: {
          bookID: App.Handle.appData.bookID,
          lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,
          complete: true, // 무비, 메이킹북
          // wrongCount?: number;     // 캐치,터치,매치,스팟파인더
          // quizResult?: Array<boolean>[5]; //퀴즈
        },
      });
    } else {
      console.warn("스토리무비 학습결과를 전송하지 않습니다.");
    }
    this.mDimmed.show(false);
    PIXISound.stopAll();
    gsap.globalTimeline.clear();
    await this.game.startEOPScreen(1, true);
    this.mVideoElement.currentTime = 0;
    this.mVideoElement.pause();
    //성과를 저장
  }
}
