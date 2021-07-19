import gsap from 'gsap'
import { App } from '../../../Core';
import { AnswerBox,ExamStickerBox } from './';
import { Rectangle } from 'pixi.js';

export class AnswerImg extends PIXI.Sprite {
    
    private mHintAni: gsap.core.Timeline;
    private mFocusAni: gsap.core.Timeline;

    private mBlink = true;
    private mTextureOpened: PIXI.Texture;
    private mId: number;

    get currentID(): number{ return this.mId}

    static _handle: AnswerImg
    static get Handle(): AnswerImg { return AnswerImg._handle}

    constructor(id: number, openImageFileName: string ){
        super()
        
        AnswerImg._handle = this;

        this.mId = id;
        this.mTextureOpened = App.Handle.currentGame.getProductResource(openImageFileName).texture;
        this.alpha = 0; // TODO 0 으로 
        this.texture = this.mTextureOpened;
        this.anchor.set(0.5)
        
    }

    finish(){
        if( this.mFocusAni )this.mFocusAni.kill();
        this.alpha = 1;
    }

    // 두번 깜박임.
    hint(){
        
        if( this.mFocusAni ){
            this.mFocusAni.pause();
        }
        if( this.mHintAni == null ){
            console.log(`HINT`)
            this.mHintAni = gsap.timeline({defaults:{  alpha:0.2  }});
            this.mHintAni.to(this,{alpha:1,duration:0.25} )
            this.mHintAni.to(this,{alpha:0.2,duration:0.25} )
            this.mHintAni.to(this,{alpha:1,duration:0.25} )
            this.mHintAni.to(this,{alpha:0.2,duration:0.25} )
            .eventCallback( "onComplete",()=>{ 
                this.mHintAni = null;
                if( this.mFocusAni ){ this.mFocusAni.play()  }                
            })
        }
    }

    focus( flag: boolean ){
        if( flag ){
            if( this.mFocusAni == null){
                console.log(`FOCUS`)
                this.mFocusAni = gsap.timeline({defaults:{  alpha:0.2  }});
                this.alpha = 0.2;
                this.mFocusAni.to(this,{alpha:1,duration:0.25} )
                this.mFocusAni.to(this,{alpha:0.2,duration:0.25} )
                this.mFocusAni.to(this,{alpha:1,duration:0.25} )
                this.mFocusAni.to(this,{alpha:0.2,duration:0.25} )
                this.mFocusAni.repeatDelay(3)
                this.mFocusAni.repeat(-1);
            }
        }else{
            if( this.mFocusAni )this.mFocusAni.kill();
            this.mFocusAni = null;
        }
    }
    effect(x: number, y: number){
        ExamStickerBox.Handle.clickOff();
        gsap.from(this.scale,{x:2,y:2,duration:0.5});
        gsap.from(this,{alpha:0,duration:0.5});
        console.log(`%c 정답&스티커 붙는 사운드 ExamStick 136` ,"font-weight:800; color:blue; padding-right:1rem; letter-spacing:-0.1rem")
        const effectData = App.Handle.currentGame.getResource("match_effect.json").spineData;
        const effect = new PIXI.spine.Spine( effectData );
        effect.state.setAnimation( 0, "animation", false);
        gsap.delayedCall(0.8,()=>{
            effect.position.set( x,y );
            this.parent.addChild( effect );
        })
    }

}