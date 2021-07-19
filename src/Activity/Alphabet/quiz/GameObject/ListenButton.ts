import { gsap } from 'gsap';
import { App } from '@/Activity/Core';
import { groupD8 } from 'pixi.js';


export class ListenButton extends PIXI.Sprite{
    
    private mNormalTexture: PIXI.Texture;   // 보통상태 이미지
    private mActiveTexture: PIXI.Texture;   // 사운드 송출 동안 이미지
    private mSound: PIXI.sound.Sound;       // 송출 사운드
    
    private mRepeatSound: any;
    private mQuizBox: any;
    
    constructor( soundpath: string ){
        super();
        this.anchor.set( 0.5 );
        this.mNormalTexture = App.Handle.currentGame.getResource("sound_nor.png").texture;
        this.mActiveTexture = App.Handle.currentGame.getResource("sound_act.png").texture;
        this.texture =  this.mNormalTexture;
        const rsc = App.Handle.currentGame.getProductResource( soundpath );
        // console.log( rsc );
        this.mSound = rsc?rsc.sound : null;
        
        this.interactive = true;
        this.buttonMode = true;
        this.on("pointerdown",(evt)=>{
            this.onClick();
        })
    }

    settingQuizBox(quizbox: any){
        this.mQuizBox = quizbox;
    }

    onClick (){
        this.mSound.stop();
        if(this.mRepeatSound)this.mRepeatSound.kill();
        if( this.texture != this.mNormalTexture ) return;

        if(this.mQuizBox){this.mQuizBox.repeatMotion(this.mSound.duration);} 

        //사운드 플레이
        this.mSound.play();
        this.texture = this.mActiveTexture;

        gsap.delayedCall( this.mSound.duration, ()=>{
            this.texture = this.mNormalTexture;
            this.mRepeatSound = gsap.delayedCall(5,()=>{  this.onClick();  })
        })
    }

    repeatDestroy(){
        if(this.mRepeatSound)this.mRepeatSound.kill();
    }

    getDuration(): number{
        return this.mSound.duration;
    }
}