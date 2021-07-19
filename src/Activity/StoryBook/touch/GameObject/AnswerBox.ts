import { App } from '../../../Core'
import { AnswerImg } from './AnswerImg'
import { TouchData } from '../Define';
import gsap from 'gsap';
import { Activity } from '../Scene';

export class AnswerBox extends PIXI.Container{
    private mAnswerStage: PIXI.Container;
    private mAnswerArray: Array<AnswerImg>;
    private mData: TouchData
    private mId: number;
    private mBlink: any;
    private mBlinkFlag: boolean;
    static _handle: AnswerBox
    static get Handle(): AnswerBox{return AnswerBox._handle}

    get quizStep(): number { return this.mId}
    get currentAnswer(): AnswerImg{ return this.mAnswerArray[this.mId] }

    constructor(data: TouchData){
        super()
        AnswerBox._handle = this;
        this.mData = data
        // console.warn(this.mData)
        this.mId=0;
        this.mAnswerArray =[];
        this.mBlinkFlag = false;
        this.mAnswerStage = new PIXI.Container();
        this.setAnswer();
        this.addChild(this.mAnswerStage)
        
    }

    setAnswer(){
        /**정답 스틱 */
        const level = App.Handle.appData.level;
        const correctCount = level +2;
        // console.warn(`현재 레벨: [${level}] , 정답 갯수: [${correctCount}]`)
        for (let i=0; i<5; i++){
            const answerImg = new AnswerImg(i+1 , `lt_${App.Handle.appData.bookID}_${i+1}_1.png`);
            if(i >= correctCount && level < 4){
                answerImg.visible = true;
                answerImg.finish();
            }
            if( level == 1 ){
                if( this.mData[i].hideFlag ){
                    answerImg.visible = false;
                }
            }
            if( level == 2 ){
                if( i == 4 && this.mData[i].hideFlag ){
                    answerImg.visible = false;
                }
            }
            
            answerImg.hitArea = new PIXI.Rectangle(
                this.mData[i].x - answerImg.width /2,
                this.mData[i].y - answerImg.height /2,
                answerImg.width *2,
                answerImg.height*2
                )
            answerImg.position.set(this.mData[i].x+ answerImg.width/2 ,this.mData[i].y+ answerImg.height/2)

        //    this.viewPassLine(i , answerImg);
            
            this.mAnswerArray.push(answerImg)
            this.mAnswerStage.addChild(this.mAnswerArray[i])
        }
        // console.warn(this.mData[0].x)
        // console.warn(this.mData[0].y)
    }
    
    getBox(id: number){
        return this.mAnswerArray[id];
    }

    setClose(id: number){
        console.warn(`${id}번째 진행중`)
        this.mId = id
        this.mAnswerArray[id-1].finish();
        this.mAnswerArray[id-1].effect(this.mAnswerArray[id-1].x,this.mAnswerArray[id-1].y);
    }

    viewPassLine(id: number , who: AnswerImg){
        const debug = new PIXI.Graphics();
        debug.lineStyle(2,0xff00,1)
        debug.drawRect(
            this.mData[id].y - who.height /2,
            this.mData[id].x - who.width /2,
            who.width *2,
            who.height*2
            )
        debug.endFill();
        this.addChild(debug)
    }
  
}