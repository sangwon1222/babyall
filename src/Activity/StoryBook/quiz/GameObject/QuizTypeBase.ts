import { Choice2Side } from './Choice2Side';
import { Activity } from '../Scene';
import { App } from '@/Activity/Core';

export class QuizTypeBase extends PIXI.Sprite{
    
    protected mBG: PIXI.Sprite;
    private mWrongCount: number
    
    get activity(): Activity {
        return (this.parent as Activity)
    }
    get wrongCount(): number { return this.mWrongCount}
    set wrongCount(v: number) { this.mWrongCount = v}

    constructor(){
        super()
        this.mBG = new PIXI.Sprite();
        this.addChild( this.mBG );

        this.mWrongCount = 0;
    }


    setBackground( path: string ){
        this.mBG.texture = App.Handle.currentGame.getViewerResource(path).texture;
    }

    onStart(){
        //
    }

    endQuiz(){
        this.activity.onNextGame();
    }
}