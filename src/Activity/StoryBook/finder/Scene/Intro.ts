import { App,SceneBase } from '../../../Core';
import gsap from 'gsap';

export class Intro extends SceneBase{
    private mBG: PIXI.Sprite;
    constructor(){
        super()
        const bookID = App.Handle.appData.bookID;
        const level = App.Handle.appData.level
        this.mBG = PIXI.Sprite.from(App.Handle.currentGame.getProductResource(`sf_${bookID}_${level}.png`).texture)

    }
    async onInit(){
        this.addChild(this.mBG)
        await this.game.endLoadingScreen();
        this.start();
    }
    onStart(){
        gsap.delayedCall(3,()=>{ this.game.goScene("activity") })
    }
}