// import gsap from "gsap";
import { App,GameBase,SceneBase } from "../../Core";

import Game from "../index"

import { BGImage } from '../GameObject/BGImage';
import { Button } from '../GameObject/Button';
import { PetSceneBase } from './PetSceneBase';
// import { CardGroup } from "../GameObject/CardGroup";

export class Bath extends PetSceneBase {
//   private mBgGroup: PIXI.Container;
//   // private mBG: PIXI.Sprite;
//   // private mSide: PIXI.Sprite;
//   private mBGMove: gsap.core.Tween;
//   private mSideMove: gsap.core.Tween;
//   private mTextMove: gsap.core.Tween;
    private mExitButton: Button;
    private mPhotoButton: Button;
    private mDecoButton: Button;

    private mPlayButton: Button;
    private mBathButton: Button;
    private mCleanButton: Button;
    private mEatButton: Button;
    
    get game(): Game{ return (super.game as Game); }

    constructor() {
        super();
    }

    async onInit() {
        this.mBG = new BGImage( "bg_02.png" );
        this.addChild( this.mBG );

        // this.mExitButton = new Button( "btn_exit.png" );
        // this.mExitButton.position.set( 32, 32 );
        // this.mExitButton.on("onClick",()=>{
        //     this.game.goScene("home");
        // })
        // this.addChild( this.mExitButton );

        this.mPlayer = new PIXI.spine.Spine( App.Handle.currentGame.getResource(`common_dog01.json`).spineData );
        this.mPlayer.position.set( 1280/2, 720/2);
        this.addChild( this.mPlayer );

        this.initSound();
        this.start();
    }

    onStart(){
        this._setupPlayerSoundEvent();
        this._setupPlayerAni();
    }

    _setupPlayerAni(){
        this.mPlayer.state.setAnimation( 0, "02_shower/02_enter", false );
        this.mPlayer.state.addListener({
            
            complete: (entry) => {
                // console.log( "Ani Finish:", entry.animation.name);
                if (entry.animation.name == "02_shower/02_enter") {
                    this.mPlayer.state.setAnimation(0, "02_shower/02_ready", true);
                    const temp = this.mPlayer.slotContainers[ 
                        this.mPlayer.skeleton.findSlotIndex("02_click") 
                    ];

                    // console.log( temp );
                    temp.interactive = true;
                    temp.buttonMode = true;
                    temp.on("pointerdown",()=>{
                        temp.interactive = false;
                        temp.buttonMode = false;
                        this.mPlayer.state.setAnimation(0, "02_shower/02_action", false);                    
                    })
                }else if (entry.animation.name == "02_shower/02_action") {
                    this.game.dogCondition.needBath -= 1;
                    if( this.game.dogCondition.needBath < 0 ) this.game.dogCondition.needBath = 0;

                    const temp = this.mPlayer.slotContainers[ 
                        this.mPlayer.skeleton.findSlotIndex("02_click") 
                    ];
                    temp.interactive = false;
                    temp.buttonMode = false;                   
                    //this.game.goScene("home");
                    if( this.game.dogCondition.needBath>0){
                        this.game.goScene("home");
                    }else{
                        this.mPlayer.state.setAnimation(0, "02_shower/02_reaction", false); 
                    }
                    
                }else if (entry.animation.name == "02_shower/02_reaction") {
                    this.game.goScene("home");
                }


            },
        });
    }
}
