import { App } from '../../../Core'
import { ExButton } from './';

export class ExStage extends PIXI.Container{
    static _handle: ExStage;
    static get Handle(): ExStage {return ExStage._handle}

    private mlevel = App.Handle.appData.level;
    private mExButtonArray: Array<ExButton>

    constructor(){
        super()
        
        ExStage._handle = this;

        this.mExButtonArray=[];
        this.makeExButton();

    }

    makeExButton(){
        const exCount = this.mlevel +2
        const valueX = new ExButton(1)
        let offsetX = valueX.width/2;
        for(let i=4; i<exCount+4; i++){
            
            const exButton = new ExButton(i-3)
            exButton.pivot.set(0.5,0.5)
            exButton.position.set(offsetX , 205/2)
            offsetX += exButton.width+50
            
            this.mExButtonArray.push(exButton)
            this.addChild(exButton)
        }
    }

    onCorrectMotion(id: number ,delay: number) {
        this.mExButtonArray[id].onNext(delay);
    }

    AllClickStart(){
        for(let i=0 ; i<this.mExButtonArray.length; i++){
            this.mExButtonArray[i].clickStart();
        }
    }
    AllClickStop(){
        for(let i=0; i<this.mExButtonArray.length;i++){
            this.mExButtonArray[i].clickStop();
        }
    }

}