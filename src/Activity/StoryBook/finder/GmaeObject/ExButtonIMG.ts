import { App } from '../../../Core';
import gsap from 'gsap';
import { ExButton } from './';

export class ExButtonIMG extends PIXI.Sprite{
    private mOn: string;
    private mOff: string;
    private mCorrect: string;
    private mClickFlag= true;

    get exButton(): ExButton{ return (this.parent as ExButton) }
    constructor(soundOn: string, soundOff: string, correct: string ){
        super()
        this.mOn = soundOn;
        this.mOff = soundOff;
        this.mCorrect = correct
        // `sound_down.png`
        this.texture = App.Handle.currentGame.getResource(this.mOn).texture ;
        this.anchor.set(0.5)
    }
    onCorrectIMG(){
        this.mClickFlag=false;
        this.exButton.offFlag();
        this.texture = App.Handle.currentGame.getProductResource(this.mCorrect).texture ;
    }
    onButtonOff(){
        if(this.mClickFlag){
            this.texture = App.Handle.currentGame.getResource(this.mOff).texture ;
        }
    }
    onButtonOn(){
        if(this.mClickFlag){
            this.texture = App.Handle.currentGame.getResource(this.mOn).texture ;
        }
    }
}