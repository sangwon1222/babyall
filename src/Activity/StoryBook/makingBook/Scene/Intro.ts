import { SceneBase, App } from '../../../Core';
import { Stage } from '../GameObject/Stage';
import gsap from 'gsap';

export class Intro extends SceneBase{

    private mStage: Stage;
    private mBGM: PIXI.sound.Sound;

    constructor(){
        super()
        this.mBGM = App.Handle.currentGame.getResource(`mb_bgm.mp3`).sound;

        this.mStage = new Stage();
    }
    async onInit(){
        this.addChild(this.mStage)
        await this.game.endLoadingScreen();
        this.start();
    }

    onStart(){
        // this.mBGM.play({loop:true})
        gsap.delayedCall(1,()=>{
            this.game.goScene("activity")
        })
    }

    async onEnd(){
        // this.mBGM.stop();
        // await this.game.startEOPScreen(0);
    }

}