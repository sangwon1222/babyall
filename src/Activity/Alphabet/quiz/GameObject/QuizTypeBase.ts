import { Activity } from '../Scene';
import { App } from '@/Activity/Core';
import { gsap } from 'gsap';
import { QuizDataTypeBase } from '../Define';



export interface QuizData{
    answer1: string;    //정답1
    answer2: string;    //정답2
    level: number;      /**수정자 이상원 */
    quiz1: string;      //보기1
    quiz2: string;      //보기2

    example1: string;   //예제1
    example2: string;   //예제2
    example3: string;   //예제3
    example4: string;   //예제4            
    example5: string;   //예제5            
    example6: string;   //예제6            
    sound: string;      //예제 사운드            
}


export class QuizTypeBase extends PIXI.Container{
    private mQuizData: Array<QuizDataTypeBase>;

    private mQuizResultMark: PIXI.Sprite;
    private mQuizCorrectTex: PIXI.Texture;
    private mQuizWrongTex: PIXI.Texture;
    private mQuizDataList: Array<QuizData>;
    private mQuizIDX: number; // 몇번째 퀴즈인가?
    private mBG: PIXI.Sprite;

    get activity(){ 
        return ( this.parent.parent as Activity);
    }

    get quizData(): Array<QuizDataTypeBase> { return this.mQuizData; }

    get quizIDX(): number{ return this.mQuizIDX }
    get quizDataList(): Array<QuizData>{ return this.mQuizDataList }
    
    constructor( quizDataList: Array<QuizData>, quizIDX: number , drawData?: Array<QuizDataTypeBase> ){
        super();

        this.mBG = new PIXI.Sprite(App.Handle.currentGame.getResource(`bg.png`).texture );
        this.addChild(this.mBG)
        this.mQuizIDX = quizIDX;
        this.mQuizDataList = quizDataList;

        this.mQuizCorrectTex = App.Handle.currentGame.getResource("correct.png").texture; 
        this.mQuizWrongTex = App.Handle.currentGame.getResource("wrong.png").texture; 
        
        this.mQuizResultMark = new PIXI.Sprite();
        this.mQuizResultMark.zIndex = 1;
        this.mQuizResultMark.position.set( 1280/2, 720/2 )
        this.mQuizResultMark.anchor.set( 0.5 )
        this.addChild( this.mQuizResultMark );
        this.mQuizResultMark.texture = this.mQuizCorrectTex;
        this.mQuizResultMark.visible = false;
    }

    setBackground(path: string){
        this.mBG.texture = App.Handle.currentGame.getResource(path).texture;
    }

    onQuizStepCorrect(type2?: string): Promise<void>{
        return new Promise<void>((resolve,reject)=>{
            this.sortChildren();
            this.mQuizResultMark.texture = this.mQuizCorrectTex;
            this.mQuizResultMark.visible = true;
            this.mQuizResultMark.alpha = 0;
            const correctSound = App.Handle.currentGame.getResource(`ab_sfx_1.mp3`).sound;
            correctSound.play();
            gsap.to( this.mQuizResultMark, { alpha:1, duration:0.5})
            gsap.delayedCall( 1, ()=>{ 
                gsap.to( this.mQuizResultMark, { alpha:0, duration:0.5}) 
            });
            
            gsap.delayedCall( 2, ()=>{
                this.mQuizResultMark.visible = false;
                if(type2==undefined){  Activity.Handle.nextQuiz();  }
                resolve();
            })
        })
    }

    onQuizStepWrong(type2?: string): Promise<void>{
        return new Promise<void>((resolve,reject)=>{
            this.sortChildren();
            this.mQuizResultMark.texture = this.mQuizWrongTex;
            this.mQuizResultMark.visible = true;
            this.mQuizResultMark.alpha = 0;
            const wrongSound = App.Handle.currentGame.getResource(`ab_sfx_2.mp3`).sound;
            wrongSound.play();
            gsap.to( this.mQuizResultMark, { alpha:1, duration:0.5})
            gsap.delayedCall( 1, ()=>{ 
                gsap.to( this.mQuizResultMark, { alpha:0, duration:0.5}) 
            });
            
            gsap.delayedCall( 2, ()=>{
                this.mQuizResultMark.visible = false;
                if(type2==undefined){  Activity.Handle.nextQuiz();  }
                resolve();
            })
        })
    }

    onStart(){
        //
    }
    
    onEnd(){
        //
    }
}