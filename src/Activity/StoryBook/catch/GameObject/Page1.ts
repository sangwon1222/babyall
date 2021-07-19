import {App, SceneBase, Util} from "../../../Core"
import { Card ,PageBase } from '.'
import {gsap} from "gsap"
import { Activity } from '../Scene';
import { CatchData } from '../Define';
import { Background } from './';

export class Page1 extends PageBase{
    private mBackground: Background;
    private mDimmed: PIXI.Graphics;
    private mCard: Card;
    

    constructor(data: CatchData){
        super(data);
        
        this.mBackground = new Background(`sc_${data.bookID}_${data.pageNum}_1.png`,`sc_${data.bookID}_${data.pageNum}_6.png`);
        this.mCard = new Card(
            `sc_${data.bookID}_${data.pageNum}_4.png`,
            `sc_${data.bookID}_${data.pageNum}_5.png`,
            `sc_${data.bookID}_${data.pageNum}_1.mp3`
            );
        this.mCorrectText = new PIXI.Sprite(App.Handle.currentGame.getProductResource(`sc_${data.bookID}_${data.pageNum}_7.png`).texture);
        this.mCorrectText.alpha=0;

        this.mDimmed = new PIXI.Graphics();
        this.mDimmed.beginFill(0x000000,1);
        this.mDimmed.drawRect(0,0,1280+20,720+20);
        this.mDimmed.endFill();
        this.mDimmed.width = 1280+20;
        this.mDimmed.height = 720 +20;
        this.mDimmed.pivot.set(this.mDimmed.width/2,this.mDimmed.height/2);
        this.mDimmed.position.set(this.mDimmed.width/2 -10,this.mDimmed.height/2)
        this.mDimmed.alpha=0;

        this.addChild(this.mBackground)
        this.addChild(this.mButtonSprite)
        this.addChild(this.mExampleText)
        this.addChild(this.mDimmed)
        this.addChild(this.mCard)
        this.addChild(this.mCorrectText)
        
    }

    onText() {
        const exampleSound = App.Handle.currentGame.getProductResource(`sc_${this.catchData.bookID}_${this.catchData.pageNum}.mp3`).sound
        exampleSound.play();
        gsap.to(this.mExampleText, {alpha:1, duration:exampleSound.duration, onComplete:()=>{
            gsap.to(this.mDimmed,{alpha:0.4,duration:0.5})
            this.mCard.settingCard();
            gsap.to(this.mExampleText, {alpha:0,duration:0.5}) 
        }})
    }

    offDimmed(){
        gsap.to(this.mDimmed,{alpha:0,duration:0.5})
    }

    onCorrectText(){
        const exampleSound = App.Handle.currentGame.getProductResource(`sc_${this.catchData.bookID}_${this.catchData.pageNum}.mp3`).sound
        exampleSound.play();

        gsap.to(this.mExampleText,{ alpha:1, duration:exampleSound.duration,onComplete:()=>{
            const correctSound = App.Handle.currentGame.getProductResource(`sc_${this.catchData.bookID}_${this.catchData.pageNum}_1.mp3`).sound
            correctSound.play();
        
            gsap.to(this.mCorrectText,{alpha:1, duration:correctSound.duration,onComplete:()=>{
                this.activity.onNextPage();
                // this.activity.wrongCount+=1;
            }})
        }})
    }
    
    onBackground(){ 
        this.removeChild(this.mButtonSprite)
        
        this.mBackground.onCorrectBackground();
    }
}