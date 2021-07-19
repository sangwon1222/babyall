import { App } from '../../../Core'
import { Point, Rectangle } from 'pixi.js';
import { FinderData } from '../Define';
import { Activity } from '../Scene';
import { ExStage,QuizStage } from './';
import gsap from 'gsap';
import { Stage } from './Stage';

export class QuizRect extends PIXI.Sprite{

    private mQuizStep: number
    private mData: FinderData;
    private mOXdelay: number;
    private mEXdelay: number;

    private mEffect: any;
    private mEffectTexture: PIXI.Sprite;

    private mCorrectFlag = true;

    constructor(quizStep: number ,data: FinderData){
        super()
        const Osound = App.Handle.currentGame.getResource(`sf_sfx_1.mp3`).sound;
        this.mOXdelay = Osound.duration;
        const EXsound = App.Handle.currentGame.getProductResource(`sf_${App.Handle.appData.bookID}_1_${Activity.Handle.quizStep}.mp3`).sound
        this.mEXdelay = EXsound.duration;
        
        this.mData = data;
        this.mQuizStep = quizStep;
        
        this.mEffectTexture = new PIXI.Sprite(App.Handle.currentGame.getResource(`magnifier.png`).texture)
        this.mEffectTexture.anchor.set(0.5)
        this.mEffectTexture.angle=-45

        /**스타트 로딩화면 들어가면 클릭딜레이 제거 */
        gsap.delayedCall(1,()=>{ this.clickStart(); })

        this.hitArea = new Rectangle(0,0,this.mData[quizStep-1].w,this.mData[quizStep-1].h)
        console.warn(this.mData)
        // this.viewLine();
        
        this.on("pointertap",()=>{
            if(this.mCorrectFlag){
                this.RectClick()
            }
        })
        
    }
    viewLine(){
        const debug = new PIXI.Graphics();
        debug.lineStyle(2, 0x00FFFF, 1);
        debug.drawRect(-this.width/2 ,-this.height/2,this.mData[this.mQuizStep-1].w,this.mData[this.mQuizStep-1].h)
        this.addChild(debug);
    }

    async RectClick(){
        QuizStage.Handle.AllClickStop();
        ExStage.Handle.AllClickStop();
        await this.checkTotalStep();
        QuizStage.Handle.AllClickStart();
        ExStage.Handle.AllClickStart();
    }

    checkTotalStep(): Promise<void>{
        return new Promise<void>(
            (resolve, reject)=>{
                const totalQuiz = App.Handle.appData.level +2;
                if(this.mQuizStep <= totalQuiz){
                    console.warn(`Activity.Handle.quizStep=>${Activity.Handle.quizStep}`)
                    this.correct(this.mQuizStep);
                    gsap.delayedCall( this.mOXdelay+ this.mEXdelay ,()=>{
                        this.mCorrectFlag = false;
                        resolve()
                    })
                }
            }
        )
    }

    correct(id: number){
        Stage.Handle.clickedCorrect();
        if(this.mEffect)this.mEffect.kill();this.removeChild(this.mEffectTexture)
    
      this.mEffectTexture.position.set(this.mData[this.mQuizStep-1].w/2,this.mData[this.mQuizStep-1].h/2)
      this.addChild(this.mEffectTexture)
      this.mEffect = gsap.timeline();
      this.mEffect.to(this.mEffectTexture,{x:this.mEffectTexture.x-10,y:this.mEffectTexture.y+10,angle:-50,duration:0.3})
      this.mEffect.to(this.mEffectTexture,{x:this.mEffectTexture.x+10,y:this.mEffectTexture.y,duration:0.3})
      this.mEffect.to(this.mEffectTexture,{x:this.mEffectTexture.x,angle:-45,duration:0.3})
      .eventCallback("onComplete",()=>{
            this.removeChild(this.mEffectTexture);
            const Osound = App.Handle.currentGame.getResource(`sf_sfx_1.mp3`).sound;
            const EXsound = App.Handle.currentGame.getProductResource(`sf_${App.Handle.appData.bookID}_1_${id}.mp3`).sound
            Osound.play();
            this.effect(Osound.duration + EXsound.duration);
            ExStage.Handle.onCorrectMotion(id-1 , Osound.duration + EXsound.duration)
            gsap.delayedCall(Osound.duration,()=>{
                EXsound.play();
            })
      })
    }

    effect(time: number){
        const effectData = App.Handle.currentGame.getResource("common_find_circle.json").spineData;
        const effect = new PIXI.spine.Spine( effectData );
        const x = this.mData[this.mQuizStep-1].w/2;
        const y = this.mData[this.mQuizStep-1].h/2;
        effect.state.setAnimation( 0, "animation", false);
        effect.position.set( x,y );
        this.addChild( effect );
        // gsap.delayedCall(time,()=>{
        //     this.removeChild( effect )
        // })
    }

    clickStart(){
        this.interactive = true;
        this.buttonMode =  true;
    }

    clickStop(){
        this.interactive = false;
        this.buttonMode =  false;
    }

}