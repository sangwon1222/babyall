
import { App } from '../../../Core';
import { Rectangle } from 'pixi.js';
import { ResourceManager } from '@/Activity/Core/ResourceManager';
import gsap from 'gsap';

export class CardBG extends PIXI.NineSlicePlane{

    private mQuiz: PIXI.Sprite
    private mAfforDanceStage: PIXI.Container;

    constructor(background: string , quizSprite: string){
        super(App.Handle.currentGame.getResource(background).texture,30,30,30,30)
        this.width = 228+60;
        this.height = 412;
        this.pivot.set(this.width/2,this.height/2)
        this.position.set( (1280/2)*1.5 ,720/2)
        this.alpha=0;
        this.buttonMode = false;
        this.interactive = false;
        this.hitArea = new Rectangle(0,0,this.width,this.height)

        this.mQuiz = new PIXI.Sprite(App.Handle.currentGame.getProductResource(quizSprite).texture)
        this.mQuiz.anchor.set(0.5);
        this.mQuiz.position.set( this.width/2, this.height/2)
        this.addChild(this.mQuiz)

        this.mAfforDanceStage = new PIXI.Container();
        this.addChild(this.mAfforDanceStage)
        
        this.affordance();
    }

    affordance(){

        const circle = new PIXI.Sprite(App.Handle.currentGame.getViewerResource(`circle.png`).texture)
        circle.anchor.set(0.5)
        gsap.to(circle.scale,{x:1.1,y:1.1,duration:1}).repeat(-1).yoyo(true)
        gsap.to(circle,{alpha:0,duration:1,delay:1}).repeat(-1).yoyo(true)
        

        const finger = new PIXI.Sprite(App.Handle.currentGame.getViewerResource(`finger.png`).texture)
        finger.anchor.set(0.5)
        finger.position.set(0,100)
        gsap.to(finger,{y:finger.y-20,duration:1}).repeat(-1).yoyo(true)
        gsap.to(finger,{alpha:0,duration:1,delay:1}).repeat(-1).yoyo(true)

        this.mAfforDanceStage.position.set(this.width/2 , this.height )
    }

    wrong(delay?: number){
        this.tint=0xbcbcbc;
        this.mQuiz.alpha = 0.3;
        this.mAfforDanceStage.removeChildren();
        this.removeChild(this.mAfforDanceStage)
        if(delay)
        gsap.delayedCall(delay,()=>{
            this.tint=0xFFFFFF;
            this.mQuiz.alpha = 1;
        })
    }

    removeAffordance(){
        this.mAfforDanceStage.removeChildren();
        this.removeChild(this.mAfforDanceStage)
    }
}