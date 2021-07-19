import { App } from '../../../Core'
import gsap from 'gsap';
import { Activity } from '../Scene';
import { ExStage,ExButtonIMG,QuizStage } from './';

export class ExButton extends PIXI.Container{
    private mClickFlag: boolean;
    private mID: number;
    private mSoundButton: ExButtonIMG;
    
    constructor(idx: number){
        super()
    
        this.mClickFlag = true;
        this.mID = idx
        
        this.makeButton(this.mID);
        
        this.clickStart();
        this.on("pointertap",()=>{   this.Clicked();  })
    }
    makeButton(id: number){
        const BG = PIXI.Sprite.from(App.Handle.currentGame.getResource(`box.png`).texture)
        BG.anchor.set(0.5)
        this.addChild(BG);
        
        this.mSoundButton = new ExButtonIMG(`sound.png`,`sound_down.png`,`sf_${App.Handle.appData.bookID}_${id+3}.png`)
        this.mSoundButton.position.set(-5,-5)
        this.addChild(this.mSoundButton)

        // const debug = new PIXI.Graphics();
        // debug.lineStyle(2,0x000000,0.05);
        // debug.drawRect(0,0,this.mSoundButton.width,this.mSoundButton.height)
        // debug.endFill();
        // this.mSoundButton.addChild(debug)
    }

    async Clicked(){
        ExStage.Handle.AllClickStop();
        QuizStage.Handle.AllClickStop();
        this.mSoundButton.onButtonOff();
        console.log(this.mClickFlag , this.mID)
        // QuizStage.Handle.onFlicker(this.mID)
        if(this.mClickFlag){           
            await this.soundOn(this.mID)        
        }
        this.mSoundButton.onButtonOn();
        ExStage.Handle.AllClickStart();
        QuizStage.Handle.AllClickStart();
    }
    soundOn(id: number): Promise<void>{
        return new Promise<void>(
            (resolve,reject)=>{
                gsap.to(this.mSoundButton,{y:this.mSoundButton.y+5,duration:0.5})
                const bookID = App.Handle.appData.bookID;
                console.warn(`${id}번째 사운드 출력`)
                const sound = App.Handle.currentGame.getProductResource(`sf_${bookID}_1_${id}.mp3`).sound
                sound.play();
                gsap.delayedCall(sound.duration,()=>{
                    gsap.to(this.mSoundButton,{y:this.mSoundButton.y-5,duration:0.5})
                    resolve()
                })
            }
        )
    }
    onNext(delay: number){
        this.changeIMG();
        gsap.delayedCall(delay,()=>{
            Activity.Handle.onNextStep();
        })
    }

    changeIMG(){
        gsap.to(this,{alpha:0,duration:0.5})
        .eventCallback("onComplete",()=>{
            this.mSoundButton.position.set(0,0)
            this.mSoundButton.onCorrectIMG();
        });
        gsap.delayedCall(0.5,()=>{
            gsap.to(this,{alpha:1,duration:0.5})
        })
    }

    clickStart(){
        this.buttonMode =  true;
        this.interactive = true;
    }

    clickStop(){
        this.buttonMode =  false;
        this.interactive = false;
    }

    offFlag(){
        this.mClickFlag = false;
    }

}