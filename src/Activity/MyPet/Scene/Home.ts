import { gsap } from 'gsap'

import { App,GameBase,SceneBase } from "../../Core";
import Game from "../index"
import { BGImage } from '../GameObject/BGImage';
import { Button } from '../GameObject/Button';
import { Deco } from '../GameObject/Deco';
import { PetSceneBase } from './PetSceneBase';
import {shuffleArray} from '../../Core/Util';
import Axios from 'axios';
import Util from '@/Util';

import PIXISound from 'pixi-sound'

import Swal from 'sweetalert2';
import { ResourceManager } from '@/Activity/Core/ResourceManager';
// import { CardGroup } from "../GameObject/CardGroup";

export class Home extends PetSceneBase {
    private mPictureContainer: PIXI.Container;
    private mShotEffect: PIXI.Graphics;
    private mExitButton: Button;
    private mPhotoButton: Button;
    private mDecoButton: Button;

    private mPlayButton: Button;
    private mBathButton: Button;
    private mCleanButton: Button;
    private mEatButton: Button;
    private mDeco: Deco;
    private mBGname: string;

    private mClickStop: PIXI.Graphics;
    get game(): Game{ return (super.game as Game); }

    constructor() {
        super();
        this.mBGname = "bg_00.png";
    }

    async onInit() {
        
        console.log("DogCondition:", this.game.dogCondition );
        this.mPictureContainer = new PIXI.Container();
        this.addChild( this.mPictureContainer );
        
        this.mBG = new BGImage( this.mBGname );
        this.mPictureContainer.addChild( this.mBG );

        this.mPlayer = new PIXI.spine.Spine( App.Handle.currentGame.getResource(`common_dog01.json`).spineData );
        this.mPlayer.position.set( 1280/2, 720/2);
        this.mPictureContainer.addChild( this.mPlayer );

        this.mShotEffect = new PIXI.Graphics();
        this.mShotEffect.beginFill( 0xFFFFFF );
        this.mShotEffect.drawRect( 0,0, 1280, 720 );
        this.mShotEffect.endFill();
        this.mShotEffect.blendMode = PIXI.BLEND_MODES.ADD;
        this.mShotEffect.visible = false;
        
        this.mExitButton = new Button( "btn_exit.png" );
        this.mExitButton.position.set( 32, 32 );
        this.mExitButton.on("onClick",()=>{
            PIXISound.stopAll();
            App.Handle.exit();
        })
        this.addChild( this.mExitButton );

        this.mPhotoButton = new Button( "btn_photo.png" );
        this.mPhotoButton.position.set( 26, 407 );
        this.mPhotoButton.on("onClick",()=>{
            this.makeScreenShot();
            // App.Handle.exit();
        })
        this.addChild( this.mPhotoButton );

        this.mDecoButton = new Button( "btn_deco.png" );
        this.mDecoButton.position.set( 26, 555 );
        this.mDecoButton.on("onClick",()=>{
            this.mDeco.show( this.mBGname );
        })
        this.addChild( this.mDecoButton );

        this.mClickStop = new PIXI.Graphics();
        this.mClickStop.beginFill(0x0000,0.001);
        this.mClickStop.drawRect(0,0,1280,720);
        this.mClickStop.endFill();
        
        this.mClickStop.interactive = true;
        this.mClickStop.on("pointerdown",()=>{
            //console.log(`클릭방지`)
        })

        this.mPlayButton = new Button( "btn_ball.png" );
        this.mPlayButton.position.set( 1120, 100 );
        this.mPlayButton.on("onClick",()=>{
            this.addChild(this.mClickStop);
            const sound = App.Handle.currentGame.getResource(`mpet_1.mp3`).sound;
            if(sound!= undefined){
                PIXISound.stopAll();
                sound.play();
                gsap.delayedCall(sound.duration,()=>{ this.game.goScene("play") })
            }else{
                this.game.goScene("play")
            }
        })
        this.addChild( this.mPlayButton );

        this.mBathButton = new Button( "btn_shower.png" );
        this.mBathButton.position.set( 1120, 100 + (150*1) );
        this.mBathButton.on("onClick",()=>{
            this.addChild(this.mClickStop);
            const sound = App.Handle.currentGame.getResource(`mpet_2.mp3`).sound;
            if(sound!= undefined){
                PIXISound.stopAll();
                sound.play();
                gsap.delayedCall(sound.duration,()=>{ this.game.goScene("bath") })
            }else{
                this.game.goScene("bath")
            }
        })
        this.addChild( this.mBathButton );

        this.mCleanButton = new Button( "btn_clean.png" );
        this.mCleanButton.position.set( 1120, 100 + (150*2) );
        this.mCleanButton.on("onClick",()=>{
            this.addChild(this.mClickStop);
            const sound = App.Handle.currentGame.getResource(`mpet_3.mp3`).sound;
            if(sound!= undefined){
                PIXISound.stopAll();
                sound.play();
                gsap.delayedCall(sound.duration,()=>{ this.game.goScene("clean") })
            }else{
                this.game.goScene("clean")
            }
        })
        this.addChild( this.mCleanButton );

        this.mEatButton = new Button( "btn_meal.png" );
        this.mEatButton.position.set( 1120, 100 + (150*3) );
        this.mEatButton.on("onClick",()=>{
            this.addChild(this.mClickStop);
            const sound = App.Handle.currentGame.getResource(`mpet_4.mp3`).sound;
            if(sound!= undefined){
                PIXISound.stopAll();
                sound.play();
                gsap.delayedCall(sound.duration,()=>{ this.game.goScene("eat") })
            }else{
                this.game.goScene("eat")
            }
        })
        this.addChild( this.mEatButton );
        
        this.addChild( this.mShotEffect );

        this.mDeco = new Deco();
        this.mDeco.on("onSelectBG",(path: string)=>{
            this.mBGname = path;
            this.mBG.change( path );
        })
        this.addChild( this.mDeco );
        
        this.initSound();
        
        await this.game.endLoadingScreen()

        this.start();
    }

    onStart(){
        this._setupPlayerSoundEvent();
        this._setupPlayerAni();
    }

    _alertPopUp(){
        const dimmed = new PIXI.Graphics();
        dimmed.beginFill(0x000000,0.6);
        dimmed.drawRect(0,0,1280,720);
        dimmed.endFill();
        dimmed.position.set(0,0);
        this.addChild(dimmed);
        
        const bg = new PIXI.Sprite( App.Handle.currentGame.getResource(`popup_quit_box.png`).texture );
        bg.anchor.set(0.5);
        bg.position.set(1280/2,720/2);
        dimmed.addChild(bg);
        gsap.from(bg.scale,{x:0,y:0,duration:0.5});

        const style= new PIXI.TextStyle({
            fontFamily: "minigate",
            fontSize: 24,
            // fill: "#00ad98",
            fill: "#000000",
        });

        const text = new PIXI.Text(`My Room에 저장되었습니다.`,style)
        text.anchor.set(0.5);
        bg.addChild(text);

        dimmed.interactive = true;
        dimmed.on("pointertap",()=>{ 
            this.removeChild(dimmed);
            dimmed.removeChild(bg);
         })
    }

    makeScreenShot(){
        const renderTexture = PIXI.RenderTexture.create( {width:1280, height:720} );
        App.Handle.renderer.render(this.mPictureContainer, renderTexture);
        this.mShotEffect.visible = true;
        this.mShotEffect.alpha = 1;
        gsap.to( this.mShotEffect, { alpha:0, duration:0.5})
        .eventCallback( "onComplete",()=>{ 
            this.mShotEffect.visible = false;
            this._alertPopUp()
        })

        const canvas = App.Handle.renderer.extract.canvas(renderTexture);
        canvas.toBlob((b)=>{
            // 서버로 전송
            const fd = new FormData();
            fd.set('screenshot', b);
            Axios.post( 
                `${ Util.Config.restAPIProd }/learning/child/mypet/screenshot`,
                fd
            )
            // if (navigator.msSaveBlob) {
            //     navigator.msSaveBlob(b, "capture.png");
            // }else{
            //     navigator
            //     const link = document.createElement('a');
            //     link.download = "capture.png";
            //     link.href = canvas.toDataURL('image/png');
            //     document.body.appendChild(link);
            //     link.click();
            //     document.body.removeChild(link);
            // }
        },'image/png');
        //document.body.appendChild(canvas);
        //window.open(canvas.toDataURL('image/png'));
    }
    _setupPlayerAni(){
        const tags = []
        if( this.game.dogCondition.needBath>0 ){ 
            tags.push( 'bath' )
        }
        if( this.game.dogCondition.needClean>0 ){
            tags.push( 'clean' )
        }
        if( this.game.dogCondition.needEat>0 ){
            tags.push( 'eat' )
        }
        if( this.game.dogCondition.needPlay>0 ){
            tags.push( 'play' )
        }
        shuffleArray( tags )
        // console.log( this.game.dogCondition, tags );

        if( tags.length == 0 ){
            this.mPlayer.state.setAnimation( 0, "defalt/00_defalt", true );
        }else{
            if( tags[0] == "bath" ){
                this.mPlayer.state.setAnimation( 0, "defalt/02_defalt", true );    
            }else if( tags[0] == "clean" ){
                this.mPlayer.state.setAnimation( 0, "defalt/03_defalt", true );    
            }else if( tags[0] == "eat" ){
                this.mPlayer.state.setAnimation( 0, "defalt/04_defalt", true );    
            }else if( tags[0] == "play" ){
                this.mPlayer.state.setAnimation( 0, "defalt/01_defalt", true );    
            }
        }
        
        this.mPlayer.state.addListener({
            complete: (entry) => {
                // console.log( "Ani Finish:", entry.animation.name);
                if (entry.animation.name == "01_play/01_enter") {
                    this.mPlayer.state.setAnimation(0, "01_play/01_ready", true);
                    const temp = this.mPlayer.slotContainers[ 
                        this.mPlayer.skeleton.findSlotIndex("01_click") 
                    ];
                    // console.log( temp );
                    temp.interactive = true;
                    temp.buttonMode = true;
                    temp.on("pointerdown",()=>{
                        console.log("click");
                        this.mPlayer.state.setAnimation(0, "01_play/01_action", false);                    
                    })
                }else if (entry.animation.name == "01_play/01_action") {
                    const temp = this.mPlayer.slotContainers[ 
                        this.mPlayer.skeleton.findSlotIndex("02_click") 
                    ];
                    temp.interactive = false;
                    temp.buttonMode = false;                   
                    //this.game.goScene("home");
                    this.mPlayer.state.setAnimation(0, "01_play/01_reaction", false); 
                }else if (entry.animation.name == "01_play/01_reaction") {
                    this.game.goScene("home");
                }
            },
        });
    }
}
