
import { QuizTypeBase, QuizData } from './QuizTypeBase';
import { ListenButton } from './ListenButton';
import { QuizExampleBoxBase } from './QuizExampleBoxBase';
import { BoxFont } from './BoxFont';
import { App, Util } from '@/Activity/Core';
import { Activity } from '../Scene/Activity';
import gsap from 'gsap';
import { Rectangle } from 'pixi.js';

const debugMode = false;

export class QuizBox extends PIXI.Container{
    
    private mBG: PIXI.Sprite;
    private mNormal: PIXI.Texture;
    private mWrong: PIXI.Texture;
    private mSelect: PIXI.Sprite;
    private mAnswer: PIXI.Texture;

    private mClickLock = false;
    private mSymbol: string;    //할당된 symbol
    private mImageIDX: string;  //할당된 이미지 인덱스
    private mImage: PIXI.Sprite;

    private mRepeatSoundTimeLine: any

    get selected(): boolean{ return true }
    set selected(v: boolean){  
        if(v){
            this.mSelect.alpha=1;
        }else{
            this.mSelect.alpha=0;
        }
    }
    get corrected(): boolean{ return this.mBG.alpha == 1; }
    set corrected(v: boolean){  
        if(v){
            this.mBG.texture=this.mAnswer
        }else{
            this.mBG.texture=this.mWrong;
        }
    }
    
    get quizSection(){ return ( this.parent as QuizSection ) }
    get imageIDX(): string{ return this.mImageIDX }

    constructor( symbol: string, imageIDX: string ){
        super();
        
        this.mSymbol = symbol;
        this.mImageIDX = imageIDX;
        console.log( "imageIDX", this.mImageIDX );

        // this.mNormal = App.Handle.currentGame.getResource(`box_default_1_1.png`).texture;
        this.mNormal = App.Handle.currentGame.getResource(`box_default_1_2.png`).texture;
        this.mWrong = App.Handle.currentGame.getResource(`box_wrong_1_1.png`).texture;
        this.mAnswer = App.Handle.currentGame.getResource(`box_answer_1.png`).texture;

        this.mSelect = new PIXI.Sprite(App.Handle.currentGame.getResource(`box_select_1.png`).texture);
        this.mSelect.alpha=0;
        this.mSelect.anchor.set(0.5)
        
        this.mBG = new PIXI.Sprite(this.mNormal);
        this.mBG.anchor.set(0.5);
        this.addChild(this.mBG)
        this.mBG.addChild(this.mSelect)

        this.mImage = new PIXI.Sprite();
        this.mImage.scale.set( 0.9 );
        this.mImage.texture = App.Handle.currentGame.getProductResource(
            `${this.mSymbol.toLowerCase()}_${this.mImageIDX}.png`
        ).texture;

        this.mImage.anchor.set(0.5)
        this.addChild( this.mImage );
        
        this.interactive = true;
        this.buttonMode = true;

        this.on("pointertap",()=>{ 
            if( !this.mClickLock ) {
                if(this.mRepeatSoundTimeLine){this.mRepeatSoundTimeLine.kill()}
                this.onClick() 
            }
        })
    }

    clickLock( flag: boolean ){
        this.mClickLock = flag;
    }

    onClick(){
        this.quizSection.clickLock( true );
        this.selected = true;
        this.mBG.alpha=1;
        const selectSound = App.Handle.currentGame.getResource(`ab_sfx_3.mp3`).sound;
        selectSound.play();
        gsap.delayedCall(selectSound.duration,()=>{
            this.quizSection.selectExample( this.mImageIDX );
        })
    }
}

// 하단 퀴즈 영역
export class QuizSection extends PIXI.Container{
    
    private mSymbol: string;
    private mQuizData: QuizData;
    
    private mBoxes: Array<QuizBox>;
    private mQuizIDX: number;
    
    get currentSymbol(){ return this.mSymbol }
    get quizType(): QuizType3{ return ( this.parent as QuizType3 ) }

    constructor( quizData: QuizData, quizIDX: number ){
        super();
        this.mQuizIDX = quizIDX;
        this.mSymbol = App.Handle.appData.symbol.toLowerCase();

        console.log( quizData );

        this.mQuizData = quizData;
        
        const temp = [ this.mQuizData.example1, this.mQuizData.example2 ];
        Util.shuffleArray( temp );

        this.mBoxes =[];
        for( const imgIDX of temp ){
            const box = new QuizBox( this.mSymbol, imgIDX );
            this.mBoxes.push( box );
            this.addChild( box );
        }
        this.mBoxes[0].position.set( -275, 0)
        this.mBoxes[1].position.set( 275, 0)
        
    }

    // Example ( 예제를 선택했을때. )
    selectExample( imageIDX: string ){
        //
        (this.parent as QuizType3).destroy();
        
        for( const box of this.mBoxes){
            if( this.mQuizData.answer1.includes( box.imageIDX ) ){
               box.corrected = true; 
            }else{
                box.corrected = false; 
            }
        }

        if( this.mQuizData.answer1 == imageIDX ){
            this.quizType.onQuizStepCorrect();
            Activity.Handle.wrongCountList[this.mQuizIDX] = false;
        }else{
            this.quizType.onQuizStepWrong();
            Activity.Handle.wrongCountList[this.mQuizIDX] = true;
        }
        // if( this.mBox1.imageIDX == this.mQuizData.answer1 ) this.mBox1.corrected = true;
        // if( this.mBox2.imageIDX == this.mQuizData.answer1 ) this.mBox2.corrected = true;
            
    }

    repeatMotion(duration: number){
        for(let i=0; i<this.mBoxes.length; i++){
            const timeline = gsap.timeline();
            timeline.to( this.mBoxes[i].scale ,{x:0.8,y:0.8,duration:duration/2})
            timeline.to( this.mBoxes[i].scale ,{x:1,y:1,duration:duration/2})
        }
    }

    clickLock( flag: boolean){
        this.mBoxes[0].clickLock( flag );
        this.mBoxes[1].clickLock( flag );
    }
}

export class QuizType3 extends QuizTypeBase{
    private mListenButton: ListenButton;
    private mQuizSection: QuizSection;

    get appData(): any{ return App.Handle.appData; }
    
    constructor(quizDataList: Array<QuizData>, quizIDX: number){
        super(quizDataList,quizIDX);   
        const idx = Math.ceil(Math.random() * this.quizDataList.length)-1;
        
        this.mQuizSection = new QuizSection( this.quizDataList[idx], quizIDX );
        this.mQuizSection.position.set( 1280/2, 370 )
        
        this.addChild( this.mQuizSection );   

        this.mListenButton = new ListenButton( this.quizDataList[idx].sound );
        this.mListenButton.position.set( 1280/2, 62);
        this.mListenButton.settingQuizBox(this.mQuizSection);
        this.addChild( this.mListenButton );   
        
    }
    
    onStart(){
        console.log( "QuizType3 start")      
        this.setBackground(`bg_1.png`)
        gsap.delayedCall(1,()=>{
            this.playQuizSound();
        })
    }

    playQuizSound(){
        this.mListenButton.onClick();
    }

    destroy(){
        this.mListenButton.onClick=()=>{
            console.log(`반복 재생 스탑`)
        }
    }

}