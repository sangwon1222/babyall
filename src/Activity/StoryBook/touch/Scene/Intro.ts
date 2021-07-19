import {App, SceneBase, Util} from "../../../Core"
import gsap from 'gsap';


export class Intro extends SceneBase{
    private mBG: PIXI.Sprite
    constructor(){
        super();
        this.mBG = PIXI.Sprite.from(App.Handle.currentGame.getProductResource(`lt_${App.Handle.appData.bookID}_bg.png`).texture);
        
    }
    async onInit(){
        this.addChild(this.mBG)
        await this.game.endLoadingScreen();
        this.start();
    }
    onStart(){
        console.log(`touch Intro 시작 !!`)

        // gsap.delayedCall(1, ()=>{
            this.game.goScene("activity")
        // })
    }
    correct(){
        //this.mSpriteArray[0].texture = App.Handle.currentGame.getResource(`sc_1019_1_6.png`).texture
    }
    onEnd(){
        // console.log()
    }
}