import {App, SceneBase, Util} from "../../../Core"
import gsap from 'gsap';

// 사용안함.
export class Intro extends SceneBase{
    constructor(){
        super();
        const backgroud = PIXI.Sprite.from(`sc_1019_1_1.png`);
        this.addChild(backgroud)
    }
    
    onStart(){
        gsap.delayedCall(1, ()=>{
            this.game.goScene("activity")
        })
    }
    correct(){
        //this.mSpriteArray[0].texture = App.Handle.currentGame.getResource(`sc_1019_1_6.png`).texture
    }
    
}