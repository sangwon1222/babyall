import * as PIXI from "pixi.js";
window.PIXI = PIXI
import { gsap } from 'gsap'

import { ResourceLoadTable } from '@/Activity/Alphabet/Define';
import { ResourceManager } from '../ResourceManager';

export class EOP extends PIXI.Container{
    private mBG: PIXI.Graphics;
    private mSpine: PIXI.spine.Spine;
    private mButton: PIXI.Sprite;
    private mSound: { [key: string]: PIXI.sound.Sound };
    
    constructor(){
        super();

        this.mBG = new PIXI.Graphics();
        this.mBG.beginFill(0x000000);
        this.mBG.drawRect( 0,0, 1280, 720 );
        this.mBG.endFill();
        this.mBG.alpha = 0.4;
        this.addChild( this.mBG );
        
        this.mBG.interactive = true;
        
    }

    async init(isSB: boolean ){
        this.removeChild( this.mSpine );
        this.removeChild( this.mButton );
                
        const list: ResourceLoadTable ={
            image:[
                'btn_eop_ok.png'
            ],
            spine:[
                "common_eop.json",
                "common_eop_sb.json",
            ],
            sound:[
                "1eop_ending.mp3",
                "2eop_text.mp3",
                "321go.mp3",
                "eop_goodjob.mp3",
                "4eop_gone.mp3",
                "3eop_nut.mp3"
            ]
        }
        await ResourceManager.Handle.loadViewerResource("common", list)
        if(isSB){
            this.mSpine = new PIXI.spine.Spine( ResourceManager.Handle.getViewerResource( 'common/common_eop_sb.json' ).spineData );
        }else{
            this.mSpine = new PIXI.spine.Spine( ResourceManager.Handle.getViewerResource( 'common/common_eop.json' ).spineData );
        }
        this.mSpine.position.set( 1280/2, 720/2 )

        this.mButton = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/btn_eop_ok.png").texture );
        this.mButton.interactive = true;
        this.mButton.buttonMode = true;
        this.mButton.anchor.set( 0.5 );
        this.mButton.position.set( 1280/2, 720/2 + 200 )

        this.mSound = {};
        this.mSound['sfx/1eop_ending'] = ResourceManager.Handle.getViewerResource( 'common/1eop_ending.mp3' ).sound;
        this.mSound['sfx/2eop_text'] = ResourceManager.Handle.getViewerResource( 'common/2eop_text.mp3' ).sound;
        this.mSound['sfx/eop_goodjob'] = ResourceManager.Handle.getViewerResource( 'common/eop_goodjob.mp3' ).sound;
        this.mSound['sfx/4eop_gone'] = ResourceManager.Handle.getViewerResource( 'common/4eop_gone.mp3' ).sound;
        this.mSound['sfx/3eop_nut'] = ResourceManager.Handle.getViewerResource( 'common/3eop_nut.mp3' ).sound;
        
    }
    clear(){
        this.removeChild( this.mSpine );
        this.removeChild( this.mButton );
         
    }
    async start( typeIDX: number ): Promise<void>{
        console.log( "eop start", typeIDX)
        return new Promise<void>( (resolve,reject)=>{
                
            this.mSpine.state.addListener({
                event:( entry, event)=>{
                    console.log( "Spine Event:" ,event.data.name )
                    if( this.mSound[event.data.name] !== undefined ){
                        this.mSound[event.data.name].play();
                    }
                },
                complete: (entry) => {
                    if( typeIDX == 1 ){
                        this.mSpine.state.clearListeners( )
                        resolve();                    
                    }
                    if( typeIDX == 0 ){
                        this.mButton.interactive = true;
                        this.mButton.visible = true;
                        this.mButton.once("pointertap",()=>{
                            this.mSpine.state.clearListeners( )
                            resolve();
                        }) 
                        this.mButton.scale.set( 0.01 );
                        gsap.to( this.mButton.scale, { x:1, y:1, duration: 1, ease: "bounce.out" })
                    }
                },
            });
            if( typeIDX == 0 ){
                this.addChild( this.mSpine );
                this.addChild( this.mButton );
                this.mButton.interactive = false;
                this.mButton.visible = false;
                // gsap.set( this.mButton.scale, { x:0.01, y:0.01 })
                this.mSpine.state.setAnimation(0,"eop02", false);   
                
            }else{
                this.addChild( this.mSpine );
                this.mSpine.state.setAnimation(0,"eop01", false);
            }
            
        })        
    }
    
}