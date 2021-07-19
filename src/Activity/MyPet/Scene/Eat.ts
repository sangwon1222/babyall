// import gsap from "gsap";
import { App,GameBase,SceneBase } from "../../Core";
import { BGImage } from '../GameObject/BGImage';
import { Button } from '../GameObject/Button';
import Game from "../index"
import { PetSceneBase } from './PetSceneBase';

export class Eat extends PetSceneBase {
    private mExitButton: Button;
    get game(): Game{ return (super.game as Game); }

    constructor() {
        super();
    }

    async onInit() {
        this.mBG = new BGImage( "bg_04.png" );
        this.addChild( this.mBG );

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
        this.mPlayer.state.setAnimation( 0, "04_meal/04_enter", false );
        this.mPlayer.state.addListener({
            
            complete: (entry) => {
                // console.log( "Ani Finish:", entry.animation.name);
                if (entry.animation.name == "04_meal/04_enter") {
                    this.mPlayer.state.setAnimation(0, "04_meal/04_ready", true);
                    const temp = this.mPlayer.slotContainers[ 
                        this.mPlayer.skeleton.findSlotIndex("04_click") 
                    ];

                    // console.log( temp );
                    temp.interactive = true;
                    temp.buttonMode = true;
                    temp.on("pointerdown",()=>{
                        temp.interactive = false;
                        console.log("click");
                        this.mPlayer.state.setAnimation(0, "04_meal/04_action", false);                    
                    })
                }else if (entry.animation.name == "04_meal/04_action") {
                    
                    this.game.dogCondition.needEat -= 1;
                    if( this.game.dogCondition.needEat < 0 ) this.game.dogCondition.needEat = 0;
                    
                    const temp = this.mPlayer.slotContainers[ 
                        this.mPlayer.skeleton.findSlotIndex("02_click") 
                    ];
                    temp.interactive = false;
                    temp.buttonMode = false;                   
                    //this.game.goScene("home");
                    if( this.game.dogCondition.needEat>0){
                        this.game.goScene("home");
                    }else{
                        this.mPlayer.state.setAnimation(0, "04_meal/04_reaction", false); 
                    }
                }else if (entry.animation.name == "04_meal/04_reaction") {
                    this.game.goScene("home");
                }


            },
        });
    }
}
