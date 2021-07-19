import * as PIXI from "pixi.js";
window.PIXI = PIXI

import { gsap } from 'gsap'
import { ResourceManager } from '../ResourceManager';
import { ResourceLoadTable } from '../../Alphabet/Define';
import { App } from '../App';
import PIXISound from 'pixi-sound'

export class LoadingScreen extends PIXI.Container{
    
    private mBG: PIXI.Graphics;
    private mLogo: PIXI.Sprite;
    private mBI: PIXI.Sprite;
    private mCI: PIXI.Sprite;
    private mLoadingBar: PIXI.Sprite;
    private mLoadingBarBG: PIXI.Sprite;
    private mSpinAni: gsap.core.Tween;

    private mLoadingMinDelayT: number;
    private mStarted = false;

    private mGuideText: PIXI.Container;
    private mNextGameFlag: boolean;

    get nextGameFlag(): boolean { return this.mNextGameFlag }

    constructor(){
        super();

// ---------------------------------------------------------------------------------------------        
        this.mBG = new PIXI.Graphics();
        this.mBG.beginFill(0xcbe697);
        this.mBG.drawRect( 0,0, 1280, 720 );
        this.mBG.endFill();
        this.mBG.interactive = true;
        this.addChild( this.mBG );
        
        this.mBI = new PIXI.Sprite();    
        this.mCI = new PIXI.Sprite();    
        this.mLoadingBar = new PIXI.Sprite();    
        this.mLoadingBarBG = new PIXI.Sprite(); 
        
        this.addChild( this.mBI );
        this.addChild( this.mCI );
        this.addChild( this.mLoadingBarBG );
        this.addChild( this.mLoadingBar );
        
        this.mCI.position.set( 50, 50 );
        this.mBI.anchor.set( 0.5 );
        this.mBI.position.set( 1280/2, 230 );

        this.mLoadingBar.anchor.set( 0.5 );
        this.mLoadingBarBG.anchor.set( 0.5 );

        this.mLoadingBar.position.set( 1280/2, 720/2 +50 );
        this.mLoadingBarBG.position.set( 1280/2, 720/2 +50);

        
    }
    
    async init() {
        if(this.mGuideText) this.mGuideText.visible = false;
        
        const list: ResourceLoadTable ={
            image:[
                "bi.png",
                "ci.png",
                "loading_bar.png",
                "loading_bar_bg.png",
            ]
        }
        await ResourceManager.Handle.loadViewerResource("common", list)
        
        this.mBI.texture = ResourceManager.Handle.getViewerResource( 'common/bi.png' ).texture;
        this.mCI.texture = ResourceManager.Handle.getViewerResource( 'common/ci.png' ).texture;
        this.mLoadingBar.texture = ResourceManager.Handle.getViewerResource( 'common/loading_bar.png' ).texture;
        this.mLoadingBarBG.texture = ResourceManager.Handle.getViewerResource( 'common/loading_bar_bg.png' ).texture;
        
        this._createCloseBTN();
        this.mNextGameFlag = true;
    }

    _createCloseBTN(){
        const style = new PIXI.TextStyle({
            fontFamily: 'BPreplay',
            fontSize: 24,
            fill: '#ffffff',
            padding:10,
        });

        const guidestyle = new PIXI.TextStyle({
            fontFamily: 'BPreplay',
            fontSize: 16,
            fill: '#000',
            padding:1,
        });

        this.mGuideText = new PIXI.Container();
        this.mGuideText.width=1280;
        this.mGuideText.height=720;

        const bg = new PIXI.Graphics();
        bg.beginFill(0x93c340,1);
        bg.drawRoundedRect(0,0,260,70,50);
        bg.endFill();

        const text = new PIXI.Text('뒤로 가기',style)
        text.position.set( bg.width/2 - text.width/2 ,  bg.height/2 - text.height/2  )
        bg.addChild(text)

        bg.interactive = true;
        bg.buttonMode = true;
        
        bg.on("pointertap",async ()=>{
            this.mNextGameFlag = false;
            await App.Handle.forceExit();
            
            this.mGuideText.visible = false;
            gsap.to(this,{alpha:0,duration:0.5})
            .eventCallback('onComplete',()=>{
                this.mLoadingBar.angle = 0;
                this.mSpinAni.kill();
                this.visible = false;
                this.mNextGameFlag=true;
            })
            
        })

        const guide1 = new PIXI.Text('로딩시간이 길어질 시 네트워크 연결상태를 확인하고',guidestyle)
        const guide2 = new PIXI.Text('다시 시도해 주세요.',guidestyle)
        bg.addChild(guide1,guide2)
        guide1.position.set( (130)-guide1.width/2 , -50  );
        guide2.position.set( (130)-guide2.width/2 , -30  );

        this.mGuideText.addChild( bg);
        this.mGuideText.position.set( 1280/2, 720*0.8);
        bg.position.x = -130;
        this.addChild(this.mGuideText)
        this.mGuideText.visible = false;
    }

    start(){
        console.log( "loading start")
        this.mGuideText.visible = false;
        this.mLoadingMinDelayT = Date.now();
        this.mStarted = true;
        this.alpha = 1;
        this.mSpinAni = gsap.to( this.mLoadingBar, {angle:360, duration:1.0 } );
        this.mSpinAni.repeat(-1);

        gsap.delayedCall(1,()=>{
            this.mStarted = false;
            this.mGuideText.visible = true;
        })
    }

    async end(): Promise<void>{
        return new Promise<void>( (resolve, reject)=>{
            this.mGuideText.visible = false;
            if( this.mStarted == false ) {
                resolve();
                return false;
            }else{
                this.visible = true;
                this.alpha = 1;
               
                gsap.to( this, {alpha: 0, duration: 0.5} )
                .eventCallback( "onComplete",()=>{
                    console.log( "loading onComplete");
                    this.mLoadingBar.angle = 0;
                    this.mSpinAni.kill();
                    this.visible = false;
                    resolve();
                    return true;
                });

                // const currentDelay = Date.now() - this.mLoadingMinDelayT;
                // if( currentDelay < 2000 ){
                //     gsap.delayedCall( 2,()=>{
                //         gsap.to( this, {alpha: 0, duration: 0.5} )
                //         .eventCallback( "onComplete",()=>{
                //             //console.error( "loading onComplete delayed");
                //             this.mLoadingBar.angle = 0;
                //             this.mSpinAni.kill();
                //             this.visible = false;
                //             resolve();
                //         })
                //     })
                // }else{
                //     gsap.to( this, {alpha: 0, duration: 0.5} )
                //     .eventCallback( "onComplete",()=>{
                //         console.log( "loading onComplete");
                //         this.mLoadingBar.angle = 0;
                //         this.mSpinAni.kill();
                //         this.visible = false;
                //         resolve();
                //     })                
                // }
            }            
        })
    }
}