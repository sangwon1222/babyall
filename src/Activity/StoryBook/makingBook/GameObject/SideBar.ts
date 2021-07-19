import { App } from '../../../Core';
import { TextStage } from './TextStage';
import { StickerStage } from './StickerStage';
import gsap from 'gsap';

export class SideBar extends PIXI.Container{
    static _handle: SideBar;
    static get Handle(): SideBar { return SideBar._handle}
    
    private mTextStage: TextStage;
    private mStickerStage: StickerStage;


    private mTapSound: PIXI.sound.Sound;
    
    constructor(){
        super()
        
        SideBar._handle=this;

        this.mTapSound = App.Handle.currentGame.getResource(`mb_sfx_1.mp3`).sound
        
        this.mTextStage = new TextStage();
        this.mStickerStage = new StickerStage();
        
        this.addChild(this.mTextStage)
      
    }
    
    onSticker(){
        // console.log(`[사이드바]:스티커 저장소를 켜겠어`)
        this.mTapSound.play();
        this.removeChildren();
        this.addChild(this.mStickerStage)
        this.addChild(this.mTextStage)
        gsap.to(this.mTextStage,{alpha:0,duration:0.3})
        .eventCallback("onComplete",()=>{
            this.removeChild(this.mTextStage);
            this.mTextStage.alpha=1;
            this.mStickerStage.stickerWheelFlag = true;
            this.mTextStage.paintBoxWheelFlag = false;
        })
    }

    onText(){
        this.mTapSound.play();
        // console.log(`[사이드바]:텍스트 저장소를 켜겠어`)
        this.removeChildren();
        this.addChild(this.mTextStage)
        this.addChild(this.mStickerStage)
        gsap.to(this.mStickerStage,{alpha:0,duration:0.3})
        .eventCallback("onComplete",()=>{
            this.removeChild(this.mStickerStage);
            this.mStickerStage.alpha=1;
            this.mTextStage.paintBoxWheelFlag = true;
            this.mStickerStage.stickerWheelFlag = false;
        })
    }

}