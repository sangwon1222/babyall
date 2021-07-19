// import gsap from "gsap";
import { App,GameBase,SceneBase } from "../../Core";
import { BGImage } from '../GameObject/BGImage';
import { Button } from '../GameObject/Button';
import { ResourceManager } from '@/Activity/Core/ResourceManager';
import { PetSceneBase } from './PetSceneBase';
import { MyPetModule } from '@/store/MyPet';
// import { CardGroup } from "../GameObject/CardGroup";

export class First extends PetSceneBase {
//   private mBgGroup: PIXI.Container;
//   // private mBG: PIXI.Sprite;
//   // private mSide: PIXI.Sprite;
//   private mBGMove: gsap.core.Tween;
//   private mSideMove: gsap.core.Tween;
//   private mTextMove: gsap.core.Tween;
    private mExitButton: Button;
     
    constructor() {
        super();
    }

    async onInit() {

        this.mBG = new BGImage( "bg_firstentry.png" );
        this.addChild( this.mBG );
        this.interactive = true;
        
        // this.mExitButton = new Button( "btn_exit.png" );
        // this.mExitButton.position.set( 32, 32 );
        // this.mExitButton.on("onClick",()=>{
        //     this.game.goScene("home");
        // })
        // this.addChild( this.mExitButton );

        this.mPlayer = new PIXI.spine.Spine( App.Handle.currentGame.getResource(`common_dog_firstentry.json`).spineData );
        this.mPlayer.position.set( 1280/2, 720/2);
        
        this.mSound = {};
        this.mSound['sfx/pet_open'] = this.game.getViewerResource( 'pet_open.mp3' ).sound;
        this.mSound['sfx/pet_gasp'] = this.game.getViewerResource( 'pet_gasp.mp3' ).sound;
        this.mSound['sfx/pet_good'] = this.game.getViewerResource( 'pet_good.mp3' ).sound;
        
        this.initSound();
        await this.game.endLoadingScreen()
        
        this.start();
    }
    onStart() {
        this.addChild( this.mPlayer );
        this.mPlayer.state.setAnimation( 0, "firstentry/enter", false );
        this._setupPlayerSoundEvent();
        this._setupPlayerAni();
        
    }

    _setupPlayerAni(){
        this.mPlayer.state.addListener({
            complete: (entry) => {
                // console.log( "Ani Finish:", entry.animation.name);
                if (entry.animation.name == "firstentry/enter") {
                    this.mPlayer.state.setAnimation(0, "firstentry/enter_click", true);
                    this.once("pointerdown",()=>{ this.mPlayer.state.setAnimation(0, "firstentry/open", false) })
                }else if (entry.animation.name == "firstentry/open") {
                    this.mPlayer.state.setAnimation(0, "firstentry/open_click", true);
                    this.once("pointerdown",()=>{ this.mPlayer.state.setAnimation(0, "firstentry/dog_ready", false) })
                }else if (entry.animation.name == "firstentry/dog_ready") {
                    // 받은 상태 저장
                    MyPetModule.setRecieved();
                    this.game.goScene("home");
                }


            },
        });
    }
}
