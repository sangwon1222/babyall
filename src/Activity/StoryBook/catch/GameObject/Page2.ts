import {App, SceneBase, Util} from "../../../Core"
import { PageBase } from '.'
import {gsap} from "gsap"
import { Activity } from '../Scene';
import { CatchData } from '../Define';
import { Background } from './';
import { Card } from '@/Activity/Alphabet/touch/GameObject/Card';


export class Page2 extends PageBase{
    private mBackground: Background;
    
    
    constructor(data: CatchData){
        super(data);

        this.mBackground = new Background(`sc_${data.bookID}_${data.pageNum}_1.png`,`sc_${data.bookID}_${data.pageNum}_6.png`);
        this.addChild(this.mBackground)
        this.addChild(this.mButtonSprite)
    }
    onText(){
        this.addChild(this.mExampleText)
        const exampleSound = App.Handle.currentGame.getProductResource(`sc_${this.catchData.bookID}_${this.catchData.pageNum}.mp3`).sound
        exampleSound.play()
        gsap.to(this.mExampleText,{alpha:1,duration:exampleSound.duration,onComplete:()=>{
            this.activity.onNextPage();
        }})
    }
}