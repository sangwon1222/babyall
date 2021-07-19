import { App } from '@/Activity/Core';
import gsap from 'gsap'
import { CompleteButton } from '../../makingBook/GameObject/CompleteButton';
import { SelectSide } from './QuizPanel';


export class QuizSet extends PIXI.Sprite{
    private mBarricade: Array<PIXI.Sprite>;
    private mPolice: PIXI.Sprite;
    private mPoliceTextureL: PIXI.Texture;
    private mPoliceTextureR: PIXI.Texture;
    // private mTimeOutSound: PIXI.sound.Sound;
    private mTimeOutSound: gsap.core.Timeline;

    constructor(){
        super();
        this.texture = App.Handle.currentGame.getViewerResource( "road_stopline.png").texture;
        this.anchor.set( 0.5, 0);
        this.visible = false;

        this.mBarricade = [];
        this.mBarricade[0] = new PIXI.Sprite( App.Handle.currentGame.getViewerResource( "barricade.png").texture )
        this.mBarricade[1] = new PIXI.Sprite( App.Handle.currentGame.getViewerResource( "barricade.png").texture )
        this.mBarricade[2] = new PIXI.Sprite( App.Handle.currentGame.getViewerResource( "barricade.png").texture )
        for( const spr of this.mBarricade ){
            spr.y = 200;
            spr.anchor.set( 0.5, 1 );
            this.addChild( spr );
        }
        this.mBarricade[0].x = -250;
        this.mBarricade[1].x = 20;
        this.mBarricade[2].x = 280;

        this.mPoliceTextureL = App.Handle.currentGame.getViewerResource("l_police.png").texture;
        this.mPoliceTextureR = App.Handle.currentGame.getViewerResource("r_police.png").texture;
        this.mPolice = new PIXI.Sprite( this.mPoliceTextureL );
        this.mPolice.anchor.set( 0.5, 1 );
        this.mPolice.x = 20;
        this.mPolice.y = 300;
        this.addChild( this.mPolice );
        this.mPolice.visible = false;

    }

    stop( t = 1){
        for( const b of  this.mBarricade ){
            b.visible = true;
        }
        this.mPolice.visible = false;
        this.position.y = -(403*t);
        this.visible = true;
    }

    start(){
        //
    }

    turnoff( idx: number ){
        for( const b of  this.mBarricade ){
            b.visible = true;
        }
        this.mBarricade[idx].visible = false;
    }

    displayPolice( side: SelectSide): Promise<void>{
        return new Promise<void>((resolve, reject)=>{
            const policeSound =  App.Handle.currentGame.getResource(`rm_sfx_10.mp3`).sound;
            policeSound.play();

            const policeCar = new PIXI.Sprite(App.Handle.currentGame.getResource(`police_car.png`).texture)
            policeCar.anchor.set(0.5)
            // policeCar.angle =90;
            policeCar.position.set(1280/2,720/2-50)
            this.addChild(policeCar)

            gsap.to(policeCar,{x:0,duration:0.8})

            // gsap.to(policeCar,{y:720/2-50,angle:15,duration:0.8})
            // gsap.to(policeCar,{x:0,angle:0,duration:1,delay:0.6})

            .eventCallback("onComplete",()=>{
                if( side == SelectSide.left ) {
                    this.mPolice.texture = this.mPoliceTextureL;
                }else{
                    this.mPolice.texture = this.mPoliceTextureR;
                }
                this.mPolice.visible = true; 
                this.mPolice.alpha = 0; 
                gsap.to( this.mPolice, {alpha:1, duration: 0.5})
                gsap.to(policeCar,{x:-800,duration:0.8,delay:0.5})
                .eventCallback("onComplete",()=>{this.removeChild(policeCar)})
            })
            
            gsap.delayedCall(policeSound.duration-1,()=>{
                resolve();
            })
        })
    }
}