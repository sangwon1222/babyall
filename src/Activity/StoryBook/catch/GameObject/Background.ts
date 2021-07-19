import {App} from "../../../Core"
import {Activity} from "../Scene"
import gsap from 'gsap';

export class Background extends PIXI.Sprite{
    private mQuizBG:    string;
    private mCorrectBG: string;
    get  activity(): Activity{ return (App.Handle.currentGame.currentScene as Activity); }

    constructor(quizBG: string, correctBG: string){
        super()
        this.mQuizBG = quizBG
        this.mCorrectBG = correctBG
        this.texture = App.Handle.currentGame.getProductResource(this.mQuizBG).texture;
    }
    onCorrectBackground(){
            this.texture = App.Handle.currentGame.getProductResource(this.mCorrectBG).texture;
            gsap.delayedCall(0.5,()=>{
                console.log(`정답 bG`)
                this.activity.currentPage.onCorrectText(); 
            })
    }
}