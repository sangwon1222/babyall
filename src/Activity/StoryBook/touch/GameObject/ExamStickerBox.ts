import { Util, App } from '../../../Core'
import { ExamSticker } from './'
import gsap from 'gsap';
import { AnswerBox } from '@/Activity/Alphabet/quiz/GameObject/QuizType1';
import { AnswerImg } from './AnswerImg';
import { Activity } from '@/Activity/StoryBook/touch/Scene';

const height = 200;
const width = 200;
const startx = 1280-400;
const scale = 1.2;
export class ExamStickerBox extends PIXI.Container{
    private mExamStage: PIXI.Container;
    private mExamArray: Array<ExamSticker>;
    private mWrongCount: number;

    // private mDimmed: PIXI.Sprite;
    private mDimmed: any;

    private mCorrect: PIXI.Sprite;

    get wrongCount(): number { return this.mWrongCount}
    static _handle: ExamStickerBox;
    static get Handle(): ExamStickerBox{return ExamStickerBox._handle}

    constructor(){
        super()
        ExamStickerBox._handle = this;

        this.mWrongCount =0;
        this.mExamArray =[];
        this.mCorrect = new PIXI.Sprite();

        const line = new PIXI.Sprite(App.Handle.currentGame.getResource(`ex_bg_line.png`).texture);
        line.position.set(1280-line.width,0);
        this.addChild(line);

        this.mExamStage = new PIXI.Container();
        this.mExamStage.x = startx;
        this.addChild(this.mExamStage)

        if(Activity.Handle.currentStep>-1)this.setExams();

        this.mDimmed = new PIXI.Sprite(App.Handle.currentGame.getResource(`ex_bg_1.png`).texture);
        this.mDimmed.position.set(1280-this.mDimmed.width,0);
        this.addChild(this.mDimmed)
        this.mDimmed.alpha=0;
    }

    setExams(){
        this.mExamArray =[];
        const allExam =[];
        for (let i=0; i< 8; i++){
            const exam = new ExamSticker(i+1,`lt_${App.Handle.appData.bookID}_${i+1}.png`, `lt_${App.Handle.appData.bookID}_${i+1}_2.png`);
            exam.scale.set(scale);
            allExam.push(exam); 
        }

        const offsetx = 200;
        const halfHeight = 720/2;
        const offsety = [halfHeight -220 , halfHeight , halfHeight +220];

        this.mCorrect = allExam[ Activity.Handle.currentStep]
        
        const list = [0,1,2,3,4,5,6,7];
        list.splice(Activity.Handle.currentStep,1)
        Util.shuffleArray(list);

        this.mExamArray = [ this.mCorrect , allExam[list[0]] , allExam[list[1]], ];
        const shuffledArray = this.mExamArray.slice(0);
        Util.shuffleArray(shuffledArray);

        for ( let i=0; i<this.mExamArray.length;i++ ){
            shuffledArray[i].x = offsetx;
            shuffledArray[i].y = offsety[i];
            // offsety += height ;
            this.mExamStage.addChild(shuffledArray[i])
        }
    }

    nextStep(){
        this.mExamStage.removeChildren();
        this.setExams();
    }

    CountWrong(){
        this.mWrongCount += 1;
    }

    clickOff(){
        this.mDimmed.alpha=1;
        for(let i=0; i<this.mExamArray.length;i++){
            this.mExamArray[i].clickOff();
        }
    }
    clickOn(){
        this.mDimmed.alpha=0;
        for(let i=0; i<this.mExamArray.length;i++){
            this.mExamArray[i].clickOn();
        }
    }

}