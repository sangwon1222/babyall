// import gsap from "gsap";
import { App,GameBase,SceneBase } from "../../Core";

import Game from "../index"

import { BGImage } from '../GameObject/BGImage';
import { Button } from '../GameObject/Button';
import PIXISound from 'pixi-sound'
// import { CardGroup } from "../GameObject/CardGroup";

export class PetSceneBase extends SceneBase {
    protected mBG: BGImage;
    protected mPlayer: PIXI.spine.Spine;
    protected mSound: { [key: string]: PIXI.sound.Sound };
    
    get game(): Game{ return (super.game as Game); }
    
    constructor() {
        super();
    }

    initSound(){
        this.mSound = {};
        this.mSound['sfx/pet_aftershower'] = this.game.getViewerResource( 'pet_aftershower.mp3' ).sound;
        this.mSound['sfx/pet_ani_broom'] = this.game.getViewerResource( 'pet_ani_broom.mp3' ).sound;
        this.mSound['sfx/pet_ani_broom_enter'] = this.game.getViewerResource( 'pet_ani_broom_enter.mp3' ).sound;
        this.mSound['sfx/pet_ani_eat'] = this.game.getViewerResource( 'pet_ani_eat.mp3' ).sound;
        this.mSound['sfx/pet_ani_feed'] = this.game.getViewerResource( 'pet_ani_feed.mp3' ).sound;
        this.mSound['sfx/pet_ani_run'] = this.game.getViewerResource( 'pet_ani_run.mp3' ).sound;
        this.mSound['sfx/pet_ani_shampoo'] = this.game.getViewerResource( 'pet_ani_shampoo.mp3' ).sound;
        this.mSound['sfx/pet_ani_shower'] = this.game.getViewerResource( 'pet_ani_shower.mp3' ).sound;
        this.mSound['sfx/pet_bark'] = this.game.getViewerResource( 'pet_bark.mp3' ).sound;
        this.mSound['sfx/pet_clean'] = this.game.getViewerResource( 'pet_clean.mp3' ).sound;
        this.mSound['sfx/pet_foodbowl'] = this.game.getViewerResource( 'pet_foodbowl.mp3' ).sound;
        this.mSound['sfx/pet_gasp'] = this.game.getViewerResource( 'pet_gasp.mp3' ).sound;
        this.mSound['sfx/pet_gasp_l'] = this.game.getViewerResource( 'pet_gasp_l.mp3' ).sound;
        this.mSound['sfx/pet_get'] = this.game.getViewerResource( 'pet_get.mp3' ).sound;
        this.mSound['sfx/pet_good'] = this.game.getViewerResource( 'pet_good.mp3' ).sound;
        this.mSound['sfx/pet_good2'] = this.game.getViewerResource( 'pet_good2.mp3' ).sound;
        this.mSound['sfx/pet_good3'] = this.game.getViewerResource( 'pet_good3.mp3' ).sound;
        this.mSound['sfx/pet_hungry'] = this.game.getViewerResource( 'pet_hungry.mp3' ).sound;
        this.mSound['sfx/pet_jump'] = this.game.getViewerResource( 'pet_jump.mp3' ).sound;
        this.mSound['sfx/pet_open'] = this.game.getViewerResource( 'pet_open.mp3' ).sound;
        this.mSound['sfx/pet_play'] = this.game.getViewerResource( 'pet_play.mp3' ).sound;
        this.mSound['sfx/pet_sound01'] = this.game.getViewerResource( 'pet_sound01.mp3' ).sound;
        this.mSound['sfx/pet_step'] = this.game.getViewerResource( 'pet_step.mp3' ).sound;
        this.mSound['sfx/pet_wash'] = this.game.getViewerResource( 'pet_wash.mp3' ).sound;
        
    }
    _setupPlayerSoundEvent(){

        this.mPlayer.state.addListener({
            event:(entry,event)=>{ 
                // console.log( event.data.name)
                

                if( this.mSound[event.data.name] !== undefined ){
                    PIXISound.stopAll();
                    this.mSound[event.data.name].play();
                }
            }
        });
    }
}
