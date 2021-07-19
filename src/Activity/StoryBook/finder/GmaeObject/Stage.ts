import { App, Util } from "../../../Core";
import { FinderData } from "../Define";
import { ExStage, QuizStage } from "./";
import { Graphics, Rectangle } from "pixi.js";
import Config from "@/Util/Config";
import gsap, { Linear, TweenMax } from "gsap";

export class Stage extends PIXI.Container {

    private mBG: PIXI.Sprite;
    private mExStage: ExStage;
    private mQuizStage: QuizStage;

    private mWrongStage: PIXI.Container;
    private mWrongCount: number;

    private mEffect: any;
    private mEffectTexture: PIXI.Sprite

    get wrongCount(): number {
        return this.mWrongCount;
    }
    static _handle: Stage;
    static get Handle(): Stage{return Stage._handle}

    constructor(data: FinderData) {
    super();
    Stage._handle= this;
    const bookID = App.Handle.appData.bookID;
    const level = App.Handle.appData.level;

    this.mBG = PIXI.Sprite.from(
    App.Handle.currentGame.getProductResource(`sf_${bookID}_${level}.png`)
        .texture
    );
    this.addChild(this.mBG);

    this.mEffectTexture = new PIXI.Sprite(App.Handle.currentGame.getResource(`magnifier.png`).texture)
    this.mEffectTexture.anchor.set(0.5)
    this.mEffectTexture.angle=-45

    this.mWrongCount = 0;

    this.mWrongStage = new PIXI.Container();
    this.mWrongStage.interactive = true;
    this.mWrongStage.buttonMode = true;
    this.mWrongStage.hitArea = new Rectangle(
    0,
    0,
    1280,
    520
    );
    this.addChild(this.mWrongStage);

    this.mExStage = new ExStage();
    this.mExStage.position.set(1280 / 2 - this.mExStage.width / 2, 520);
    this.addChild(this.mExStage);

    this.mQuizStage = new QuizStage(data);
    this.mQuizStage.position.set(0, 0);
    this.addChild(this.mQuizStage);

    // const debug = new Graphics();
    // debug.lineStyle(2, 0x0000,1)
    // debug.drawRect(0,0,this.width, this.height*0.7)
    // debug.endFill();
    // this.addChild(debug);

    this.mWrongStage.on("pointertap", (evt) => {
        this.mWrongCount += 1;
        console.log(`%c 오답갯수${this.mWrongCount}`,"font-weight:bold; color:red;");

        if(this.mEffect)this.mEffect.kill();this.removeChild(this.mEffectTexture);
        
        const pos = this.toLocal(evt.data.global);

        this.mEffectTexture.position.set(pos.x, pos.y);

        this.addChild(this.mEffectTexture)

        this.mEffect = gsap.timeline();
        this.mEffect.to(this.mEffectTexture,{x:this.mEffectTexture.x-10,y:this.mEffectTexture.y+10,angle:-50,duration:0.3})
        this.mEffect.to(this.mEffectTexture,{x:this.mEffectTexture.x+10,y:this.mEffectTexture.y,duration:0.3})
        this.mEffect.to(this.mEffectTexture,{x:this.mEffectTexture.x,angle:-45,duration:0.3})
        .eventCallback("onComplete",()=>{
            this.removeChild(this.mEffectTexture);
            this.mWrongStage.interactive = true;
            const wrongSND = App.Handle.currentGame.getResource(`sf_sfx_2.mp3`).sound;
            wrongSND.play();
        })
    });
}
    onStart() {
    //
    }

    clickedCorrect(){
        this.mWrongStage.interactive = false;
        if(this.mEffect)this.mEffect.kill();this.removeChild(this.mEffectTexture)
        gsap.delayedCall(3,()=>{this.mWrongStage.interactive = true;})
    }
}
