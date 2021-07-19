import { gsap } from 'gsap';

import { App, Util } from '@/Activity/Core';
import { QuizTypeBase, QuizData } from './QuizTypeBase';
import { BoxFont, FontMode } from './BoxFont';
import { QuizExampleBoxBase } from './QuizExampleBoxBase';
import { ListenButton } from './ListenButton';
import { Activity } from '../Scene/Activity';
import { QuizDataType1 } from '../../block/Define';

const debugMode = false;

export class QuizBox extends PIXI.Container{
    
    private mBoxFont: BoxFont;
    private mCorrectSymbol: string; //정답심볼 보관

    private mBG: PIXI.Sprite;
    private mFocusLine: PIXI.Sprite;
    private mNormalTexture: PIXI.Texture;
    
    // // 선택된것인지 아닌지
    get focused(): boolean{ return this.mFocusLine.visible }
    set focused(v: boolean){ 
        this.mFocusLine.visible = v; 
    }

    // 문제를 푼것인지 아닌지.
    private mSolved: boolean;
    get solved(): boolean{ return this.mSolved }
    set solved(v: boolean){ 
        this.mSolved = v;
        if( this.mSolved == true ){
            this.mBoxFont.visible = true;
        }else {
            this.mBoxFont.visible = false;
        }
    }
    
    get symbol(): string{ return this.mBoxFont.symbol }
    set symbol(v: string){ 
        this.mBoxFont.setSymbol( v )
        // this.sizeType = this.getBoxSizeBySymbol( v );
    }
    
    constructor( correctSymbol: string){
        super();

        this.mCorrectSymbol = correctSymbol;
        this.mSolved = false;

        let idx = 1;
        if( this.mCorrectSymbol != this.mCorrectSymbol.toUpperCase() ){
            const check1 = ['b','d','f','h','i','k','l','t'];
            const check2 = ['g','j','p','q','t','y'];
            if( check1.includes( this.mCorrectSymbol ) ){
                idx = 3;
                this.y= 0;
            }else if( check2.includes( this.mCorrectSymbol ) ){
                idx = 3;
                this.y = 100;
            }else{
                this.y= 55;
                idx = 2;
            }
        }
        
        this.mNormalTexture = App.Handle.currentGame.getResource(`box_${idx}.png`).texture;
        
        this.mFocusLine = new PIXI.Sprite( App.Handle.currentGame.getResource(`box_line_${idx}.png`).texture );
        this.mFocusLine.anchor.set( 0.5 );
        gsap.to(this.mFocusLine , {alpha:0,duration:0.5}).repeat(-1).yoyo(true)

        this.mBG = new PIXI.Sprite(this.mNormalTexture);
        this.mBG.anchor.set( 0.5 );

        this.addChild( this.mBG,this.mFocusLine );

        this.mBoxFont = new BoxFont( correctSymbol );
        this.mBoxFont.setMode( FontMode.Normal );
        this.mBoxFont.scale.set(0.7);
        this.addChild( this.mBoxFont );
    }
}

export class AnswerBox extends PIXI.Container{
    private mClickLock = false;
    private mBoxFont: BoxFont;
    
    private mBG: PIXI.Sprite;
    private mQuizData: QuizData;
    private mSymbol: string;
    
    private mSelectLine: PIXI.Sprite;

    private mNormalTexture: PIXI.Texture;
    private mWrongTexture: PIXI.Texture;
    private mCorrectTexture: PIXI.Texture;

    get symbol(): string{ return this.mBoxFont.symbol }
    
    constructor( symbol: string , quizData: QuizData){
        super();
        this.mQuizData = quizData;
        this.mSymbol = symbol;

        this.mBoxFont = new BoxFont( symbol );
        
        let idx = 1;
        if( symbol[0] != symbol[0].toUpperCase() ){
            const check1 = ['b','d','f','h','i','k','l','t'];
            const check2 = ['g','j','p','q','t','y'];
            if( check1.includes( symbol[0] ) ){
                idx = 3;
                this.y= 0;
            }else if( check2.includes( symbol[0] ) ){
                idx = 3;
                this.y = 100;
            }else{
                this.y= 20;
                this.mBoxFont.y=20;
                idx = 2;
            }
        }
        this.mNormalTexture = App.Handle.currentGame.getResource(`box_default_${idx}.png`).texture;
        this.mWrongTexture = App.Handle.currentGame.getResource( `box_wrong_${idx}.png`).texture;
        this.mCorrectTexture = App.Handle.currentGame.getResource( `box_inner_answer_${idx}.png` ).texture;

        this.mBG = new PIXI.Sprite(this.mNormalTexture);
        this.mBG.anchor.set(0.5) ;

        this.mSelectLine = new PIXI.Sprite( App.Handle.currentGame.getResource(`box_inner_select_${idx}.png`).texture );
        this.mSelectLine.anchor.set(0.5 );
        this.mSelectLine.alpha=0;
        this.mSelectLine.y=10;
        this.addChild( this.mBG,this.mSelectLine );
        
        
        this.addChild( this.mBoxFont );
        
        this.interactive = true;
        this.buttonMode = true;
        this.mBoxFont.setMode( FontMode.Normal );
        
        this.on("pointertap",()=>{ 
            if( !this.mClickLock ) this.onClick() 
        })

    }


    clickLock( flag: boolean ){
        this.mClickLock = flag;
    }

    onClick(){
        this.mClickLock = true;
        gsap.to(this.mSelectLine,{alpha:1,duration:0.5}).repeat(2).yoyo(true);
        const qtype1 = (this.parent.parent.parent as QuizType1 );
        qtype1.quizSection.selectExample( this,this.symbol );
    }

    correct(){
        const correct = [];
        if(  this.mQuizData.answer1 != undefined && this.mQuizData.answer1 != "" ) correct.push( this.mQuizData.answer1 );
        if(  this.mQuizData.answer2 != undefined && this.mQuizData.answer2 != "" ) correct.push( this.mQuizData.answer2 );

        if ( correct.includes(this.mSymbol) ) {
            this.mBG.texture = this.mCorrectTexture;
        }else{
            this.mBG.texture = this.mWrongTexture;
        }
    }

    // wrong(){
    //     this.mBG.texture = this.mWrongTexture;
    // }
}

// 상단 퀴즈 영역
export class QuizSection extends PIXI.Container{
    private mSelected: Array<string>;
    
    private mBoxes: Array<QuizBox>;
    private mSize: PIXI.Point;
    private mQuizData: QuizData;
    
    private mQuizCount: number;

    constructor( quizData: QuizData ){
        super();
        this.mSelected=[];

        this.mQuizData = quizData;
        const offset = 200;
        const example = [  this.mQuizData.quiz1, this.mQuizData.quiz2 ];
        let startx = (((example.length)* -offset)/2) + (offset/2) ;
        
        this.mBoxes =[];
        for( let i=0; i<example.length; i++){
            const box = new QuizBox( example[i] );
            box.position.x = startx;
            this.mBoxes.push( box );
            this.addChild( box );
            startx += offset;
        }
        
        this.makeQuiz();
      
    }

    makeQuiz(){
        this.mBoxes[0].solved = false;
        this.mBoxes[0].focused = false;
        this.mBoxes[1].solved = false;
        this.mBoxes[1].focused = false;
        this.mQuizCount = 0;
        if( this.mQuizData.answer1 != undefined && this.mQuizData.answer1 != "" ){
            this.mQuizCount += 1;
        }else{
            this.mBoxes[0].solved = true;
        }
        if( this.mQuizData.answer2!=undefined && this.mQuizData.answer2 != "" ){
            this.mQuizCount += 1;
        }else{
            this.mBoxes[1].solved = true;
        }
        
        for(let i=0; i<this.mBoxes.length; i++){
            this.mBoxes[i].focused = !this.mBoxes[i].solved;
        }
        // answer1:'A', answer2:'', quiz1:'A',quiz2:'a',   example1:'A',example2:'B',example3:'',example4:'' } 
    }

    // Example ( 예제를 선택했을때. )
    selectExample( answerBox: AnswerBox , symbol: string ){
        this.mQuizCount  -= 1;
        const selectSound = App.Handle.currentGame.getResource(`ab_sfx_3.mp3`).sound;
        selectSound.play();

        this.mSelected.push(symbol)
        // 소문자인지 대문자인지 검사해서 빈칸을 채운다.
        if( symbol == symbol.toUpperCase() ){
            this.mBoxes[0].symbol = symbol;
            this.mBoxes[0].focused = false;
            this.mBoxes[0].solved = true;
        }else{
            this.mBoxes[1].symbol = symbol;
            this.mBoxes[1].focused = false;
            this.mBoxes[1].solved = true;
        }

        // 문제 다풀었으면 정답확인하자~
        const qtype1 = ( this.parent as QuizType1 );
        if( this.mQuizCount == 0 ){
            (this.parent as QuizType1).destroy();
            qtype1.answerSection.clickLock( true );
            gsap.delayedCall( 0.5, ()=>{
                qtype1.answerSection.checkQuizResult(answerBox,this.mSelected);
                this.showAnswer()
            })
        }
    }

    // //정답으로 표시를 바꾼다.
    showAnswer(){
        this.mBoxes[0].solved = true;        
        this.mBoxes[1].solved = true;        
        this.mBoxes[0].symbol = this.mQuizData.quiz1;        
        this.mBoxes[1].symbol = this.mQuizData.quiz2;        
        this.mBoxes[0].focused = false;        
        this.mBoxes[1].focused = false;        
    }
}

// 하단 퀴즈보기 영역
export class AnswerSection extends PIXI.Container{
    
    private mQuizRoot: PIXI.Container;
    private mExampleBoxes: Array<AnswerBox>;
    private mQuizData: QuizData;
    private mQuizIDX: number;
    constructor( quizData: QuizData,quizIDX: number ){
        super();
        
        console.log("->",quizData);
        this.mQuizIDX = quizIDX;
        this.mQuizData = quizData;

        this.mQuizRoot = new PIXI.Container();
        this.addChild( this.mQuizRoot );

        const offset = 280;
        const example = []
        
        if(  this.mQuizData.example1 != undefined && this.mQuizData.example1 != "" ) example.push( this.mQuizData.example1 );
        if(  this.mQuizData.example2 != undefined && this.mQuizData.example2 != "" ) example.push( this.mQuizData.example2 );
        if(  this.mQuizData.example3 != undefined && this.mQuizData.example3 != "" ) example.push( this.mQuizData.example3 );
        if(  this.mQuizData.example4 != undefined && this.mQuizData.example4 != "" ) example.push( this.mQuizData.example4 );

        Util.shuffleArray( example );

        // const startx = (((example.length)* -offset)/2) + (offset/2) ;
        let startx = 0;
        
        this.mExampleBoxes =[];
        for( let i=0; i<example.length; i++){
            const exBox = new AnswerBox( example[i] , this.mQuizData );
            if(i>0){
                if(this.mExampleBoxes[i-1].width == 300){
                    startx += this.mExampleBoxes[i-1].width+10
                }else{
                    startx += this.mExampleBoxes[i-1].width+40
                }
                
            }
            exBox.x = startx;
            this.mExampleBoxes.push( exBox );
            this.mQuizRoot.addChild( exBox );
            
        }
        this.mQuizRoot.x = -this.mQuizRoot.width/2 + 160;
    }   

    get quizType(): QuizType1{ return ( this.parent as QuizType1 ) }

    checkQuizResult(answerBox: AnswerBox,symbol: Array<string>){
        const correctAnswer = [];
        if( this.mQuizData.answer1!=undefined && this.mQuizData.answer1 != "" ){ correctAnswer.push(this.mQuizData.answer1) }
        if( this.mQuizData.answer2!=undefined && this.mQuizData.answer2 != "" ){ correctAnswer.push(this.mQuizData.answer2) }

        let chk = true;
        
        for( let i=0; i< correctAnswer.length; i++ ){
            if( correctAnswer.includes( symbol[i] ) == false ){
                chk = false;
            }
        }

        for( let i=0; i< this.mExampleBoxes.length; i++ ){
            this.mExampleBoxes[i].correct();
        }

        
        if( chk ){  
            this.quizType.onQuizStepCorrect();
            Activity.Handle.wrongCountList[ this.mQuizIDX ] = false;
        }else{      
            this.quizType.onQuizStepWrong(); 
            Activity.Handle.wrongCountList[ this.mQuizIDX ] = true;
        }
        
    }
    
    clickLock( flag: boolean){
        for( const box of this.mExampleBoxes ){
            box.clickLock( flag );
        }
    }
}

export class QuizType1 extends QuizTypeBase{
    private mListenButton: ListenButton;

    private mQuizSection: QuizSection;
    private mAnswerSection: AnswerSection;
    
    get answerSection(): AnswerSection{ return this.mAnswerSection }
    get quizSection(): QuizSection{ return this.mQuizSection }

    constructor( quizDataList: Array<QuizData>, quizIDX: number ){
        super(quizDataList, quizIDX);
        
        const idx = Math.ceil(Math.random() * this.quizDataList.length)-1;
        this.mQuizSection = new QuizSection( this.quizDataList[idx] );

        this.mQuizSection.position.set( 1280/2, 114 )
        this.mAnswerSection = new AnswerSection( this.quizDataList[idx], quizIDX );
        this.mAnswerSection.position.set( 1280/2, 450 )
        this.addChild( this.mQuizSection );
        this.addChild( this.mAnswerSection );

        this.mListenButton = new ListenButton( this.quizDataList[idx].sound );
        this.mListenButton.position.set( 386, 120);
        this.addChild( this.mListenButton );
    }
    
    onStart(){
        console.log( "QuizType1 start")
        this.setBackground(`bg.png`)
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