import { QuizRect } from './QuizRect';
import { App } from '../../../Core';
import { FinderData } from '../Define';
import gsap from 'gsap';

export class QuizStage extends PIXI.Container{
    static _handle: QuizStage;
    static get Handle(): QuizStage { return QuizStage._handle}

    private mQuizRectArray: Array<QuizRect>
    private mbookID: number
    private mData: FinderData;
    
    constructor(data: FinderData){
        super()
        QuizStage._handle = this;

        this.mData = data;
        this.mQuizRectArray = [];
        this.mbookID = App.Handle.appData.bookID;
        this.makeQuizIMG();
    }

    makeQuizIMG(){
        const IMGCount = App.Handle.appData.level +2;
        for (let i=4; i< IMGCount+4; i++){
            const quizRect = new QuizRect(i-3,  this.mData)
            const mineX = quizRect.width/2;
            const mineY = quizRect.height/2;
            this.mQuizRectArray.push(quizRect)
            quizRect.position.set(this.mData[i-4].x + mineX,this.mData[i-4].y + mineY) ;
            this.addChild(quizRect)
        }
    }

    AllClickStart(){
        for (let i=0;i<this.mQuizRectArray.length;i++){
            this.mQuizRectArray[i].clickStart();
        }
    }
    AllClickStop(){
        for (let i=0;i<this.mQuizRectArray.length;i++){
            this.mQuizRectArray[i].clickStop();
        }
    }
    
}