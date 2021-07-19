import {App, Util} from "../../../Core"
import gsap from 'gsap';
import { CardBG } from './CardBG';
import { PageBase } from './PageBase';

export class Card extends PIXI.Sprite{
    static _handle: Card;
    static get Handle(): Card { return Card._handle}

    private mCorrectBG: CardBG;
    private mWrongBG: CardBG;
    private mQuizSound: PIXI.sound.Sound;
    private mSpeaker: PIXI.spine.Spine;

    private mSoundTimeLine: gsap.core.Tween;

    // private mXBG: CardBG

    get activity() {  return (this.parent as PageBase).activity }

    constructor(correctPath: string , wrongPath: string , sound: string){
        super()

        Card._handle = this;
        this.mQuizSound = App.Handle.currentGame.getProductResource(sound).sound

        this.mCorrectBG = new CardBG(`box_1.png`,correctPath);
        this.mWrongBG = new CardBG(`box_1.png`,wrongPath);
        const O = new CardBG(`box_3.png`,correctPath);
        // this.mXBG = new CardBG(`box_2.png`,wrongPath)
        O.position.set(this.mCorrectBG.width/2,this.mCorrectBG.height/2)
        // this.mXBG.position.set(this.mWrongBG.width/2,this.mWrongBG.height/2)
        this.addChild(this.mWrongBG)
        this.addChild(this.mCorrectBG)
        this.mCorrectBG.addChild(O)
        // this.mWrongBG.addChild(this.mXBG)

        this.mSpeaker = new PIXI.spine.Spine(App.Handle.currentGame.getResource(`common_speaker.json`).spineData);
        this.mSpeaker.position.set(1280* (3/4) , 100);
        this.addChild(this.mSpeaker)
        this.mSpeaker.alpha=0;

        this.mCorrectBG.on("pointertap",()=>{
            this.cardClickOff();
            gsap.to(O,{alpha:1,duration:0.1}).repeat(4).yoyo(true)
            this.mCorrectBG.removeAffordance();
            O.removeAffordance();
            this.correctCardMotion();
        })
        this.mWrongBG.on("pointertap",()=>{
            
            this.wrongMotion();
        });
    }
    correctCardMotion(){
        if(this.mSoundTimeLine){ this.mSoundTimeLine.kill(); }
        this.mSoundTimeLine = null;
        
        this.mWrongBG.wrong();
        gsap.to(this.mWrongBG.scale,{x:0.7,y:0.7,duration:0.5,ease:"elastic"})
        
        const correctSound = App.Handle.currentGame.getResource(`sc_sfx_3.mp3`).sound
        correctSound.play({volume:5});
        gsap.to(this.mCorrectBG.scale,{x:1.1,y:1.1,duration:correctSound.duration,ease:"bounce"})
        gsap.delayedCall(correctSound.duration,()=>{
            this.removeChildren();    
            this.activity.currentPage.onBackground();
            this.activity.currentPage.offDimmed();
            this.cardClickOn();
        })  
    }
    wrongMotion(){
        this.cardClickOff();

        this.activity.wrongCount+=1;
        console.log(`틀린갯수:[${this.activity.wrongCount}]`)

        if(this.mSoundTimeLine){ this.mSoundTimeLine.kill(); }
        
        const wrongSound = App.Handle.currentGame.getResource(`sc_sfx_4.mp3`).sound
        wrongSound.play();

        gsap.to(this.mWrongBG.scale,{x:0.7,y:0.7,duration:wrongSound.duration,ease:"elastic"})
        .eventCallback("onComplete",()=>{
            gsap.to(this.mWrongBG.scale,{x:1,y:1,duration:wrongSound.duration,ease:"elastic"})
        })
        
        this.mWrongBG.wrong(wrongSound.duration);
        this.mCorrectBG.wrong(wrongSound.duration);

        gsap.delayedCall(wrongSound.duration+1,()=>{
            this.soundPlayAndHintMotion(true)
            this.cardClickOn();
        })
    }
    cardClickOff(){
        this.mWrongBG.interactive=false;
        this.mCorrectBG.interactive = false;
    }
    cardClickOn(){
        this.mWrongBG.interactive=true;
        this.mCorrectBG.interactive = true;
    }
    settingCard(){
        const cardSound = App.Handle.currentGame.getResource(`sc_sfx_2.mp3`).sound
        cardSound.play();
        gsap.delayedCall(0.5 ,()=>{
            this.soundPlayAndHintMotion(true)
        })
        
        gsap.delayedCall(0.5 + this.mQuizSound.duration,()=>{
            this.mCorrectBG.interactive = true;
            this.mCorrectBG.buttonMode =  true;
            this.mWrongBG.interactive = true;
            this.mWrongBG.buttonMode =  true;
            const randomCard = [this.mCorrectBG , this.mWrongBG];
            Util.shuffleArray(randomCard)
            gsap.to( randomCard[0]  ,   {x:this.mCorrectBG.x -160, alpha:1,duration:1})
            gsap.to( randomCard[1]  ,   {x:this.mWrongBG.x +160, alpha:1,duration:1})
        })
    }

    soundPlayAndHintMotion(wrong: boolean){
        this.mSpeaker.alpha=0;
        if(this.mSoundTimeLine){ this.mSoundTimeLine.kill(); }
        
        this.mQuizSound.stop()
        this.mQuizSound.play()

        const correctCardMotion = gsap.timeline();
        correctCardMotion.to(this.mCorrectBG,{rotation:0.05,duration:0.2});
        correctCardMotion.to(this.mCorrectBG,{rotation:-0.05,duration:0.2});
        correctCardMotion.to(this.mCorrectBG,{rotation:0,duration:0.2});

        const wrongCardMotion = gsap.timeline();
        wrongCardMotion.to(this.mWrongBG,{rotation:0.05,duration:0.2});
        wrongCardMotion.to(this.mWrongBG,{rotation:-0.05,duration:0.2});
        wrongCardMotion.to(this.mWrongBG,{rotation:0,duration:0.2});

        this.mSpeaker.alpha=1;
        this.mSpeaker.state.setAnimation(0,"speaker_in",false);
        this.mSpeaker.state.addAnimation(0,"speaker_ing",false,this.mSpeaker.state.data.skeletonData.findAnimation(`speaker_in`).duration);
        this.mSpeaker.state.addAnimation(0,"speaker_out",false,this.mSpeaker.state.data.skeletonData.findAnimation(`speaker_in`).duration+this.mSpeaker.state.data.skeletonData.findAnimation(`speaker_ing`).duration);
        // this.mSpeaker.state.data.skeletonData.findAnimation(`speaker_in`);

        if(wrong){
            this.mSoundTimeLine=gsap.delayedCall(3 + this.mQuizSound.duration,()=>{
                this.soundPlayAndHintMotion(true)
            })
        }else{
            //
        }
    }
}