
import { QuizTypeBase, QuizData } from './QuizTypeBase';
import { ListenButton } from './ListenButton';
import { QuizExampleBoxBase } from './QuizExampleBoxBase';
import { BoxFont } from './BoxFont';
import { App, Util } from '@/Activity/Core';
import { Activity } from '../Scene/Activity';
import gsap from 'gsap';
import { Rectangle } from 'pixi.js';


const debugMode = false;

const QuizTextStyle = new PIXI.TextStyle({
    fontFamily: "minigate",
    fontSize: 65,
    // fontStyle: "italic",
    fontWeight: "bold",
    fill: "#222d32",
    padding:20,
});

export class QuizBox extends PIXI.Container{
    
    private mBG: PIXI.Sprite;
    private mNormal: PIXI.Texture;
    private mWrong: PIXI.Texture;
    private mAnswer: PIXI.Texture;
    private mSelect: PIXI.Sprite;

    private mClickLock = false;
    private mSymbol: string;    //할당된 symbol
    private mImageIDX: string;  //할당된 이미지 인덱스
    private mImage: PIXI.Sprite;

    get selected(): boolean{ return true; }
    set selected(v: boolean){  
        if(v){
            this.mSelect.alpha=1;
        }else{
            this.mSelect.alpha=0;
        }
    }
    get corrected(): boolean{ return true }
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
        // this.mSolved = false;
        this.scale.set( 1 );

        this.mNormal = App.Handle.currentGame.getResource(`box_default_1_1.png`).texture;
        this.mWrong = App.Handle.currentGame.getResource(`box_wrong_1_2.png`).texture;
        this.mAnswer = App.Handle.currentGame.getResource(`box_answer_2.png`).texture;

        this.mSelect = new PIXI.Sprite(App.Handle.currentGame.getResource(`box_select_2.png`).texture);
        this.mSelect.alpha=0;
        this.mSelect.anchor.set(0.5)

        this.mBG = new PIXI.Sprite(this.mNormal);
        this.mBG.anchor.set(0.5);
        this.addChild(this.mBG)
        this.mBG.addChild(this.mSelect)

        this.mImage = new PIXI.Sprite();
        this.mImage.scale.set( 0.65 );
        this.mImage.texture = App.Handle.currentGame.getProductResource(
            `${this.mSymbol.toLowerCase()}_${this.mImageIDX}.png`
        ).texture;

        this.mImage.anchor.set(0.5)
        this.addChild( this.mImage );
        
        this.interactive = true;
        this.buttonMode = true;

        this.on("pointertap",()=>{ 
            if( !this.mClickLock ) this.onClick() 
        })
    }

    clickLock( flag: boolean ){
        this.mClickLock = flag;
    }

    onClick(){
        this.selected = true;
        this.interactive = false;
        this.buttonMode = false;
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
    private mSize: PIXI.Point;
    private mQuizData: QuizData;
    private mCorrectImageIDX: Array<string>;
    private mAnswerImageIDX: Array<string>;
    
    private mBoxes: Array<QuizBox>;
     
    private mQuizIDX: number;
    get currentSymbol(){ return this.mSymbol }
    get quizType(): QuizType4n5{ return ( this.parent as QuizType4n5 ) }

    constructor( quizData: QuizData, quizIDX: number ){
        super();
        this.mQuizIDX = quizIDX;
        this.mSymbol = App.Handle.appData.symbol.toLowerCase();
        // this.mSymbol = 'A';
        this.mSize = new PIXI.Point( 1000, 300 );

        // console.log( quizData );

        this.mQuizData = quizData;

        this.mCorrectImageIDX = [];
        if( this.mQuizData.answer1 != "" ) this.mCorrectImageIDX.push( this.mQuizData.answer1 );
        if( this.mQuizData.answer2 != "" ) this.mCorrectImageIDX.push( this.mQuizData.answer2 );
        
        this.mAnswerImageIDX = [];
        
        const temp = [];
        if( this.mQuizData.example1 != undefined && this.mQuizData.example1 != "" )temp.push( this.mQuizData.example1 );
        if( this.mQuizData.example2 != undefined && this.mQuizData.example2 != "" )temp.push( this.mQuizData.example2 );
        if( this.mQuizData.example3 != undefined && this.mQuizData.example3 != "" )temp.push( this.mQuizData.example3 );
        if( this.mQuizData.example4 != undefined && this.mQuizData.example4 != "" )temp.push( this.mQuizData.example4 );
        if( this.mQuizData.example5 != undefined && this.mQuizData.example5 != "" )temp.push( this.mQuizData.example5 );
        if( this.mQuizData.example6 != undefined && this.mQuizData.example6 != "" )temp.push( this.mQuizData.example6 );
        Util.shuffleArray( temp );

        this.mBoxes = [];
        for( const imgIDX of temp ){
            const box = new QuizBox( this.mSymbol, imgIDX );
            this.mBoxes.push( box );
            this.addChild( box );    
        }
        if( temp.length == 4 ){
            this.mBoxes[0].position.set( -185, -145 );
            this.mBoxes[1].position.set( 185, -145 );

            this.mBoxes[2].position.set( -185, 145 );
            this.mBoxes[3].position.set( 185, 145 );
        }else if( temp.length == 5){
            this.mBoxes[0].position.set( -185, -145 );
            this.mBoxes[1].position.set( 185, -145 );
            
            this.mBoxes[2].position.set( -370, 145 );
            this.mBoxes[3].position.set( 0, 145 );
            this.mBoxes[4].position.set( 370, 145 );
        }else if( temp.length == 6){
            this.mBoxes[0].position.set( -370, -150 );
            this.mBoxes[1].position.set( 0, -150 );
            this.mBoxes[2].position.set( 370, -150 );

            this.mBoxes[3].position.set( -370, 145 );
            this.mBoxes[4].position.set( 0, 145 );
            this.mBoxes[5].position.set( 370, 145 );
        }
        
        
    }

  
    // Example ( 예제를 선택했을때. )
    selectExample( imageIDX: string ){

        this.mAnswerImageIDX.push( imageIDX );
        if( this.mAnswerImageIDX.length == 2){
            // this.mListenButton.repeatDestroy();
            (this.parent as QuizType4n5).destroy();

            console.log( this.mAnswerImageIDX , this.mCorrectImageIDX );
            let chk = true;
            for( const v of this.mAnswerImageIDX ){
                if( !this.mCorrectImageIDX.includes(v) ) {
                    chk = false;
                    break;
                }
            }
            
            for( const box of this.mBoxes){
                if( this.mCorrectImageIDX.includes( box.imageIDX ) ){
                    box.corrected = true; 
                }else{
                    box.corrected = false; 
                }
                console.log(box.corrected)
            }
            
            if( chk ){
                this.quizType.onQuizStepCorrect()
                Activity.Handle.wrongCountList[this.mQuizIDX] = false;
            }else{
                this.quizType.onQuizStepWrong();
                Activity.Handle.wrongCountList[this.mQuizIDX] = true;
            }
        }
    }

    //정답으로 표시를 바꾼다.
    showAnswer(){
        // this.mBoxes[0].solved = true;        
        // this.mBoxes[1].solved = true;        
        // this.mBoxes[0].symbol = this.mQuizData.quiz1;        
        // this.mBoxes[1].symbol = this.mQuizData.quiz2;        
        // this.mBoxes[0].focused = false;        
        // this.mBoxes[1].focused = false;        
    }

    clickLock( flag: boolean){
        for( const box of this.mBoxes ){
            box.clickLock( flag );        
        }
    }

    repeatMotion(duration: number){
        for(let i=0; i<this.mBoxes.length; i++){
            const timeline = gsap.timeline();
            timeline.to( this.mBoxes[i].scale ,{x:0.8,y:0.8,duration:duration/2})
            timeline.to( this.mBoxes[i].scale ,{x:1,y:1,duration:duration/2})
        }
    }
}

export class QuizType4n5 extends QuizTypeBase{
    private mListenButton: ListenButton;
    private mQuizSection: QuizSection;

    get appData(): any{ return App.Handle.appData; }
    
    constructor(quizDataList: Array<QuizData>, quizIDX: number ){
        super(quizDataList, quizIDX);   
        const idx = Math.ceil(Math.random() * this.quizDataList.length)-1;        
        
        this.mQuizSection = new QuizSection( this.quizDataList[idx],quizIDX );
        this.mQuizSection.position.set( 1280/2, 410 )
        
        this.addChild( this.mQuizSection );   

        const textBox = new PIXI.Sprite(App.Handle.currentGame.getResource(`sign.png`).texture);
        textBox.anchor.set(0.5);
        textBox.position.set(1280/2,62);
        this.addChild(textBox)

        const quizText = new PIXI.Text(this.quizDataList[idx].quiz1,QuizTextStyle);
        quizText.anchor.set( 0.5 );
        quizText.position.set(641,52)
        this.addChild( quizText );

        this.mListenButton = new ListenButton( this.quizDataList[idx].sound );
        this.mListenButton.position.set( 358, 62);
        this.mListenButton.settingQuizBox(this.mQuizSection);
        this.addChild( this.mListenButton );   
    }
    
    onStart(){
        console.log( "QuizType4 ,5 start")
        const level = App.Handle.appData.level;
        console.log(`%c 레벨${level}`,"border:1px red solid;")
        this.setBackground(`bg_${level+1}.png`);
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