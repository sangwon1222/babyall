import { App,Util } from '../../../Core';
import { Sticker } from './Sticker';
import { Canvas } from './Canvas';
import gsap from 'gsap';

export class ControlButton extends PIXI.Sprite{
    constructor( textureName: string ){
        super()
        this.texture = App.Handle.currentGame.getResource( textureName ).texture;
        this.anchor.set(0.5)

        this.interactive = true;
        this.buttonMode = true;

        this.on("pointerdown",( evt: PIXI.InteractionEvent )=>{
            this.onClick();
            evt.stopPropagation();
        })        
    }

    onClick(){
        //
    }
}

export enum ControlMode{
    none,
    rotate,
    scale,
    move
}

export class StickerController extends PIXI.Container{
    
    private mRecDraw: PIXI.Graphics;
    private mRotateButton: ControlButton;
    private mScaleButton: ControlButton;
    private mDeleteButton: ControlButton;
    private mSelectedSticker: Sticker;
    private mCurrentMode: ControlMode;

    constructor(){
        super();
        
        this.mCurrentMode = ControlMode.none;

        this.mRecDraw = new PIXI.Graphics();
        this.mRotateButton = new ControlButton( 'edit_rotation.png' );
        this.mScaleButton  = new ControlButton( 'edit_scale.png' );
        this.mDeleteButton = new ControlButton( 'edit_close.png' );

        this.mRecDraw.interactive = true;
        this.interactive = true;
        // this.buttonMode = true;
        this.on( "pointerdown", (evt)=>{  this.mCurrentMode = ControlMode.move;  })
        .on( "pointermove", (evt)=>{
            // console.log("move");
            if( this.mCurrentMode == ControlMode.rotate ){
                const lPos = this.parent.toLocal( evt.data.global )
                const r = Math.atan2( this.mRotateButton.y,  this.mRotateButton.x );
                this.rotateController( Math.atan2( lPos.y-this.y,  lPos.x-this.x) - r );
            }
            if( this.mCurrentMode == ControlMode.scale ){
                const lPos = this.parent.toLocal( evt.data.global )
                const deltaPos = new PIXI.Point( lPos.x-this.x, lPos.y-this.y );
                let f = deltaPos.x / ( (this.mSelectedSticker.texture.width *1.25 ) /2) ;
                if( f > 2.5 || f <-2.5  ) {   f = 2.5;   }
                if( f < 0.4 && f > -0.4 ){   f = 0.4    }
                // console.log(f)
                this.mSelectedSticker.scale.set( Math.abs(f) );

                this.mRecDraw.clear();
                this.mRecDraw.lineStyle(2, 0x000000, 1);
                this.mRecDraw.drawRect( -this.mSelectedSticker.width/2, -this.mSelectedSticker.height/2, this.mSelectedSticker.width, this.mSelectedSticker.height );
                this.mRecDraw.hitArea = new PIXI.Rectangle( -this.mSelectedSticker.width/2, -this.mSelectedSticker.height/2, this.mSelectedSticker.width, this.mSelectedSticker.height );

                this.mRotateButton.position.set( this.mSelectedSticker.width/2+30   ,   -this.mSelectedSticker.height/2)
                this.mScaleButton.position.set(  this.mSelectedSticker.width/2+30   ,   this.mSelectedSticker.height/2)
                this.mDeleteButton.position.set( -this.mSelectedSticker.width/2-30  ,   -this.mSelectedSticker.height/2  )
                
            }
            if( this.mCurrentMode == ControlMode.move ){
                //
                const lPos = this.parent.toLocal( evt.data.global )

                this.position.set(lPos.x , lPos.y  );
                this.moveController(lPos.x , lPos.y   );    

                if(lPos.x > 950){
                    this.mCurrentMode = ControlMode.none;
                    gsap.to(this,{x:800,duration:0.5})
                    gsap.to(this.mSelectedSticker,{x:800,duration:0.5})
                }
                
            }
        })
        .on( "pointerup", (evt: PIXI.InteractionEvent)=>{
            this.mCurrentMode = ControlMode.none;
            evt.stopPropagation();
        })
        .on( "pointerupoutside", (evt: PIXI.InteractionEvent)=>{
            this.mCurrentMode = ControlMode.none;
            evt.stopPropagation();
        })
        

        this.mDeleteButton.onClick=()=>{
            if( this.mSelectedSticker ){
                Canvas.Handle.deleteSticker(  this.mSelectedSticker )
            }
        }
        this.mRotateButton.onClick=()=>{
            this.mCurrentMode = ControlMode.rotate;
        }
        this.mScaleButton.onClick=()=>{
            this.mCurrentMode = ControlMode.scale;
        
        }

        this.mRecDraw.on("pointerdown",( evt: PIXI.InteractionEvent )=>{
            
            if( Util.getColorByPoint( this.mSelectedSticker , new PIXI.Point( evt.data.global.x, evt.data.global.y) ).a != 0 ){
                this.mCurrentMode = ControlMode.move;
                evt.stopPropagation();    
            }
            evt.stopPropagation();
        })     
        
        this.addChild( this.mRecDraw, this.mRotateButton, this.mScaleButton, this.mDeleteButton );

        this.hide();
    }

    rotateController( rad: number ){
        this.rotation = rad;
        if( this.mSelectedSticker ){
            this.mSelectedSticker.rotation = rad;
        }
    }
    moveController( x: number, y: number ){
        if( this.mSelectedSticker ){
            this.mSelectedSticker.position.set( x,y )
        }
    }
    
    
    show( sticker: Sticker ){
        console.log( "Show");
        this.rotation = sticker.rotation;
        this.mSelectedSticker = sticker;
        this.position.set( sticker.position.x, sticker.position.y );

        this.mRecDraw.clear();
        this.mRecDraw.lineStyle(2, 0x000000, 1);
        this.mRecDraw.drawRect( -sticker.width/2, -sticker.height/2, sticker.width, sticker.height );
        this.mRecDraw.hitArea = new PIXI.Rectangle( -sticker.width/2, -sticker.height/2, sticker.width, sticker.height )
        
        this.mRotateButton.position.set( sticker.width/2+30   ,   -sticker.height/2)
        this.mScaleButton.position.set(  sticker.width/2+30   ,   sticker.height/2)
        this.mDeleteButton.position.set( -sticker.width/2-30  ,   -sticker.height/2  )
        this.visible = true;
        this.mCurrentMode = ControlMode.move;
    }

    hide(  ){
        // console.log( "Hide");
        this.visible = false;
        this.mCurrentMode = ControlMode.none;
    }

    out(){
        this.mCurrentMode = ControlMode.none;
    }

}
