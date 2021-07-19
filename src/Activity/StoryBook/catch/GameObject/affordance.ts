import { App } from '../../../Core'
import gsap from 'gsap'
import { Rectangle } from 'pixi.js';
import { Card } from './';
import { Activity } from '../Scene';
export class Affordance extends PIXI.Container{
    private mHands: PIXI.Sprite;
    private mCircle: PIXI.Sprite;

    get  activity(): Activity{ return (App.Handle.currentGame.currentScene as Activity); }
    
    constructor(){
        super()
        this.mHands = new PIXI.Sprite(App.Handle.currentGame.getResource(`finger.png`).texture)
        this.mHands.y= 40;
        this.mCircle = new PIXI.Sprite(App.Handle.currentGame.getResource(`circle.png`).texture)
        this.mCircle.anchor.set(0.5)
        this.mCircle.position.set(this.mHands.width/2, this.mCircle.height)
        this.addChild(this.mCircle)
        this.addChild(this.mHands)
        
        this.hitArea = new Rectangle(0 , 0 , this.width , this.height +50 )

    }
    onHand(){
        gsap.to(this.mHands , {y: + 80 ,duration:1 }).repeat(-1).yoyo(true)
        gsap.to(this.mCircle.scale , {x:1.5,y:1.5 ,duration:2 }).repeat(-1)
    }
}