import { App } from '@/Activity/Core';
import gsap from 'gsap'

export class SignalSign extends PIXI.Sprite{
    private mLight: PIXI.Sprite;
    private mLightTexture: Array<PIXI.Texture>;
    private mQuitTween: gsap.core.Tween;
    private mTimerSound: PIXI.sound.Sound;

    constructor(){
        super();
        this.texture = App.Handle.currentGame.getViewerResource("traffic_light.png").texture;
        this.mTimerSound = App.Handle.currentGame.getViewerResource("rm_sfx_2.mp3").sound;

        this.anchor.set( 0.5, 0 );
        this.mLight = new PIXI.Sprite();
        this.mLight.anchor.set( 0.5, 0 );
        this.addChild( this.mLight );

        this.mLightTexture = [
            App.Handle.currentGame.getViewerResource("traffic_light_green.png").texture,
            App.Handle.currentGame.getViewerResource("traffic_light_yellow.png").texture,
            App.Handle.currentGame.getViewerResource("traffic_light_red.png").texture,
        ];

        this.mLight.texture = this.mLightTexture[0];
    }
    
    stop( waitDelaySec: number){
        this.mLight.texture = this.mLightTexture[1];
        gsap.delayedCall( 1, ()=>{ 
            this.mLight.texture = this.mLightTexture[2] 
            this.mTimerSound.play({loop:true})
            this.mQuitTween = gsap.delayedCall( waitDelaySec, ()=>{ 
                console.log( "make QuitTween")
                this.mTimerSound.stop();
                this.mQuitTween = null;
                this.onWaitTimeOut();                
                this.start();
            })        
        });
    }

    removeWaitTimeCallback(){
        this.mTimerSound.stop();
        if( this.mQuitTween && this.mQuitTween.isActive ){
            this.mQuitTween.kill();
            this.mQuitTween = null;
            console.log( "cancel QuitTween")                
        }
    }
    // 입력 대기시간이 지나감.
    onWaitTimeOut(){
        //
        
    }

    start(){
        if( this.mQuitTween && this.mQuitTween.isActive ){
            this.mQuitTween.kill();
            this.mQuitTween = null;
        }
        this.mTimerSound.stop();
        this.mLight.texture = this.mLightTexture[0];
    }
}
