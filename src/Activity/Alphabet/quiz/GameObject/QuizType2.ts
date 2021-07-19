import { gsap, wrapYoyo } from 'gsap';

import { App } from '@/Activity/Core';
import Util from '@/Util'
import { QuizTypeBase, QuizData } from './QuizTypeBase';
import { BoxFont, FontMode } from './BoxFont';
import { QuizExampleBoxBase } from './QuizExampleBoxBase';
import { Activity } from '../Scene/Activity';
import { Rectangle } from 'pixi.js';
import { WordBlockSprite, WordEditSprite, WordQuizSprite } from './MarkerData';
import Axios from 'axios';
import { QuizDataTypeBase } from '../Define';


const debugMode = true;


export class QuizBox extends PIXI.Container{
    
    private mBoxFont: BoxFont;
    private mCorrectSymbol: string; //정답심볼 보관

    private mBG: PIXI.Sprite;
    private mFocusLine: PIXI.Sprite;
    private mNormalTexture: PIXI.Texture;
    private mWrong: PIXI.Sprite;
    
    constructor( correctSymbol: string){
        super();

        this.mCorrectSymbol = correctSymbol.slice(0,1);

        let idx = 1;
        if( this.mCorrectSymbol != this.mCorrectSymbol.toUpperCase() ){
            const check1 = ['b','d','f','h','i','k','l','t'];
            const check2 = ['g','j','p','q','t','y'];
            if( check1.includes( this.mCorrectSymbol ) ){
                idx = 2;
                this.y= 0;
            }else if( check2.includes( this.mCorrectSymbol ) ){
                idx = 2;
                this.y = 100;
            }else{
                this.y= 55;
                idx = 2;
            }
        }
        
        this.mNormalTexture = App.Handle.currentGame.getResource(`draw_box_1.png`).texture;

        this.mFocusLine = new PIXI.Sprite( App.Handle.currentGame.getResource(`draw_box_line_1.png`).texture );
        this.mFocusLine.anchor.set( 0.5 );
        this.mFocusLine.alpha=0;

        this.mBG = new PIXI.Sprite(this.mNormalTexture);
        this.mBG.anchor.set( 0.5 );

        this.addChild( this.mBG );

        this.mBoxFont = new BoxFont( correctSymbol );
        this.mBoxFont.setMode( FontMode.Normal );
        this.mBoxFont.scale.set(0.7);
        this.addChild( this.mBoxFont );

        this.mWrong = new PIXI.Sprite(App.Handle.currentGame.getResource(`draw_box_wrong_1.png`).texture)
        this.addChild(this.mWrong);
        this.mWrong.alpha=0;
        this.mWrong.anchor.set(0.5);
    }

    focusOn(){
        this.mWrong.alpha=0;
        this.addChild(this.mFocusLine);
        gsap.to(this.mFocusLine,{alpha:1,duration:0.5}).repeat(-1).yoyo(true);
        gsap.to(this.scale,{x:1.1,y:1.1,duration:0.5})
    }

    focusOut(){
        this.removeChild(this.mFocusLine);
        this.mWrong.alpha=1;
        gsap.to(this.scale,{x:0.9,y:0.9,duration:0.5})
    }

}

export class AnswerBox extends QuizExampleBoxBase{
    private mClickLock = false;
    private mBoxFont: BoxFont;
    private mSymbol: string; // A1, a1...

    get selected(): boolean{ return this.mBox.tint == this.mSelectColor }
    set selected(v: boolean){  
        v?this.mBox.tint=this.mSelectColor:this.mBox.tint=this.mNormalColor
        if( v ){
            if( this.mBoxFont.fontMode == FontMode.GuideLineWrong ) this.mBoxFont.fontMode = FontMode.GuideLineWrongSelected;
            if( this.mBoxFont.fontMode == FontMode.GuideLineCorrect ) this.mBoxFont.fontMode = FontMode.GuideLineCorrectSelected;
        }else{
            if( this.mBoxFont.fontMode == FontMode.GuideLineWrongSelected ) this.mBoxFont.fontMode = FontMode.GuideLineWrong;
            if( this.mBoxFont.fontMode == FontMode.GuideLineCorrectSelected ) this.mBoxFont.fontMode = FontMode.GuideLineCorrect;
        }
    }
    
    get corrected(): boolean{ return this.mBox.tint == this.mCorrectColor }
    set corrected(v: boolean){ 
        v?this.mBox.tint=this.mCorrectColor:this.mBox.tint=this.mNormalColor;
        if( v ){
            if( this.mBoxFont.fontMode == FontMode.GuideLineWrong ) this.mBoxFont.fontMode = FontMode.GuideLineWrongSelected;
            if( this.mBoxFont.fontMode == FontMode.GuideLineCorrect ) this.mBoxFont.fontMode = FontMode.GuideLineCorrectSelected;
        }else{
            if( this.mBoxFont.fontMode == FontMode.GuideLineWrongSelected ) this.mBoxFont.fontMode = FontMode.GuideLineWrong;
            if( this.mBoxFont.fontMode == FontMode.GuideLineCorrectSelected ) this.mBoxFont.fontMode = FontMode.GuideLineCorrect;
        }
    }
    
    get symbol(): string{ return this.mSymbol }
    
    constructor( symbol: string){
        super();

        this.mSymbol = symbol;

        this.mBoxFont = new BoxFont( this.mSymbol );
        if( symbol[1] == '1'){
            this.mBoxFont.setMode( FontMode.GuideLineCorrect );
        }else{
            this.mBoxFont.setMode( FontMode.GuideLineWrong );
        }
        this.mRoot.addChild( this.mBoxFont );
        
        this.mBox.texture = this.mBoxTextureShadow;

        // const debug = new PIXI.Graphics();
        // debug.lineStyle(2,0x0000,1)
        // debug.drawRect(-this.width/2,-this.height/2,this.width,this.height)
        // debug.endFill();
        // this.addChild(debug)

        this.interactive = true;
        this.buttonMode = true;
        this.on("pointertap",()=>{ 
            if( !this.mClickLock ) this.onClick() 
        })

        this.sizeType = this.getBoxSizeBySymbol( symbol );
    }

    clickLock( flag: boolean ){
        this.mClickLock = flag;
    }

    onClick(){
        this.selected = true;
        const qtype1 = (this.parent.parent.parent as QuizType2 );
    }
}

// 왼쪽 퀴즈 영역
export class QuizSection extends PIXI.Container{
    
    private mBoxes: Array<QuizBox>;
    private mQuizData: QuizData;
    
    constructor( quizData: QuizData ){
        super();

        this.mQuizData = quizData;
        
        const example = [];
        if( this.mQuizData.quiz1 != undefined && this.mQuizData.quiz1 != "") example.push( this.mQuizData.quiz1 );
        if( this.mQuizData.quiz2 != undefined && this.mQuizData.quiz2 != "") example.push( this.mQuizData.quiz2 );

        let starty = 0 ;
        const offsetY = 200;
        
        this.mBoxes =[];
        for( let i=0; i<example.length; i++){
            const box = new QuizBox( example[i] );
            box.position.set( 0,starty );
            box.pivot.y=box.height/2;
            this.mBoxes.push( box );
            this.addChild( box );
            starty += offsetY;
        }
        this.focus();
    }

    focus(idx?: number){
        const level = App.Handle.appData.level;
        if(level!==3){this.mBoxes[0].focusOn(); return}
        if(idx==undefined) {
            this.mBoxes[0].focusOn();
            this.mBoxes[1].focusOut();
        }else {
            this.mBoxes[1].focusOn(); 
            this.mBoxes[0].focusOut(); 
            gsap.to(this.mBoxes[0],{y:this.mBoxes[0].y-50,duration:0.5});
        }
    }

}

// 오른쪽 퀴즈 영역
export class AnswerSection extends PIXI.Container{
    
    private mBG: PIXI.Sprite;
    private mDrawData: Array<QuizDataTypeBase>;
    private mMarkerData: any;

    private mQuiz: WordQuizSprite;

    private mExampleBoxes: Array<AnswerBox>;
    private mQuizData: QuizData;
    private mQuizIDX: number;

    get quizType(): QuizType2{ return ( this.parent as QuizType2 ) }


    constructor( quizData: QuizData, quizIDX: number , drawData?: Array<QuizDataTypeBase> ){
        super();
        this.mBG = new PIXI.Sprite(App.Handle.currentGame.getResource(`draw_box_big.png`).texture);
        this.addChild(this.mBG);

        this.mDrawData = drawData;
        this.mQuizIDX = quizIDX;
        this.mQuizData = quizData;
        
        const level = App.Handle.appData.level;
        let caseFlag = 1;
        if(level==1){caseFlag=1}
        if(level==2){caseFlag=2}
        if(level==3){caseFlag=1}
        
        this.readyResource(caseFlag)

        this.pivot.set(this.width/2,this.height/2)

    }   

    async readyResource( caseFlag){

        const symbol = App.Handle.appData.symbol.toLowerCase();
        let sliceNameList = [];
        console.log( symbol, caseFlag );

        const rscProduct =[]

        if( caseFlag == 1 ){
            const info = this.mDrawData[0];
            rscProduct.push( info.guide );
            for( const v of info.correct){
                rscProduct.push( v );                
            }
            sliceNameList = [];
            for( const v of info.lines){
                sliceNameList.push( v.replace("line_","") )
            }
        }else{
            console.log( this.mDrawData[2] );
            const info = this.mDrawData[2];
            rscProduct.push( info.guide );
            for( const v of info.correct){
                rscProduct.push( v );                
            }
            sliceNameList = [];
            for( const v of info.lines){
                sliceNameList.push( v.replace("line_","") )
                
            }
        }
        //------------------------------------------
        const texSlice = [];
        for( let i=0; i< sliceNameList.length; i++ ){
            texSlice.push(App.Handle.currentGame.getProductResource(sliceNameList[i]).texture )
        }
        //------------------------------------------
        
        this.mQuiz = new WordQuizSprite( 
            App.Handle.currentGame.getResource("marker_2.png").texture,
            App.Handle.currentGame.getResource("marker_1.png").texture,
            App.Handle.currentGame.getProductResource(`ab_line_${symbol.toLowerCase()}_${caseFlag}.png`).texture,
            App.Handle.currentGame.getProductResource(`ab_${symbol.toLowerCase()}_${caseFlag}.png`).texture,
            texSlice
        );

        const response = await Axios.get( `${Util.Config.restAPIProd}/learning/alphabet/block/${symbol.toUpperCase()}` );
        if(caseFlag==1)this.mMarkerData = response.data.infolist.upperCase
        if(caseFlag==2)this.mMarkerData = response.data.infolist.lowerCase
        // console.error(this.mMarkerData)

        this.mQuiz.changeColor(0x1683E9);
        this.mQuiz.loadData(this.mMarkerData);
            
        this.addChild( this.mQuiz );
        const w = App.Handle.currentGame.getProductResource(`ab_line_${symbol.toLowerCase()}_${caseFlag}.png`).texture.width/2;
        const h = App.Handle.currentGame.getProductResource(`ab_line_${symbol.toLowerCase()}_${caseFlag}.png`).texture.height/2;
        this.mQuiz.position.set(this.width/2-w,this.height/2-h);
        

        //라인 (한 획) 통과
        this.mQuiz.on( WordQuizSprite.EVT_LineComplete, (param)=>{
            console.log('line complete',param);
            const lineCompleteSound = App.Handle.currentGame.getResource(`ab_sfx_4.mp3`).sound;
            const nextLineSound = App.Handle.currentGame.getResource(`ab_sfx_6.mp3`).sound;
            
            lineCompleteSound.play();
            gsap.delayedCall(lineCompleteSound.duration,()=>{  nextLineSound.play();  })
            
        })

        const level = App.Handle.appData.level;
        
        //정답
        this.mQuiz.on( WordQuizSprite.EVT_WordComplete, async ()=>{
            if(level === 3){
                const alphabetSound = App.Handle.currentGame.getProductResource(`${symbol}.mp3`).sound;
                alphabetSound.play();
                if(caseFlag==2){
                    //레벨 3 진행시 소문자 진행 후 다음 게임으로 전환
                    Activity.Handle.wrongCountList[this.mQuizIDX] = false;
                    
                    await this.quizType.onQuizStepCorrect();
                }else{
                    //레벨 3 진행시 대문자 진행 후 소문자로 전환
                    console.log('WORD Correct complete');
                    await this.quizType.onQuizStepCorrect(`type2`);
                    this.mQuiz.removeChildren();
                    this.removeChild(this.mQuiz);
                    this.readyResource(2);
                    this.quizType.quizSection.focus(1);
                }
            }else{
                Activity.Handle.wrongCountList[this.mQuizIDX] = false;
                const alphabetSound = App.Handle.currentGame.getProductResource(`${symbol}.mp3`).sound;
                alphabetSound.play();
                await this.quizType.onQuizStepCorrect();
            }
        }) 
        
        //오답
        this.mQuiz.on( WordQuizSprite.EVT_WrongComplete, async ()=>{
            console.log('WORD Wrong complete')
            await this.quizType.onQuizStepWrong("type2"); 
            Activity.Handle.wrongCountList[this.mQuizIDX] = true;
            await this.mQuiz.displayWriteAniProc();

            if(level === 3){
                if(caseFlag==2){
                    //레벨 3 진행시 소문자 진행 후 다음 게임으로 전환
                    const alphabetSound = App.Handle.currentGame.getProductResource(`${symbol}.mp3`).sound;
                    gsap.delayedCall(1,()=>{  
                        alphabetSound.play();
                        gsap.delayedCall(alphabetSound.duration,()=>{ Activity.Handle.nextQuiz();  })
                    })
                }else{
                    //레벨 3 진행시 대문자 진행 후 소문자로 전환
                    console.log('WORD Wrong complete');
                    gsap.delayedCall(2,()=>{ 
                        this.mQuiz.removeChildren();
                        this.removeChild(this.mQuiz);
                        this.readyResource(2);
                        this.quizType.quizSection.focus(1);
                     })
                }
            }else{
                const alphabetSound = App.Handle.currentGame.getProductResource(`${symbol}.mp3`).sound;
                
                gsap.delayedCall(1,()=>{  
                    alphabetSound.play();
                    gsap.delayedCall(alphabetSound.duration,()=>{ Activity.Handle.nextQuiz();  })
                })
            }
        })
    }
    
    clickLock( flag: boolean){
        for( const box of this.mExampleBoxes ){
            box.clickLock( flag );
        }
    }
}

export class QuizType2 extends QuizTypeBase{

    private mQuizSection: QuizSection;
    private mAnswerSection: AnswerSection;
    
    get answerSection(): AnswerSection{ return this.mAnswerSection }
    get quizSection(): QuizSection{ return this.mQuizSection }

    constructor(quizDataList: Array<QuizData>, quizIDX: number , drawData?: Array<QuizDataTypeBase>){
        super(quizDataList, quizIDX,drawData);
    
        const idx = Math.ceil(Math.random() * this.quizDataList.length)-1;
        this.mQuizSection = new QuizSection( this.quizDataList[idx] );

        this.mQuizSection.position.set( 266, 720/2+10 )
        this.mAnswerSection = new AnswerSection( this.quizDataList[idx], quizIDX ,drawData);
        this.mAnswerSection.position.set( 1280/2 +120, 720/2 )
       
        this.addChild( this.mAnswerSection );
        this.addChild( this.mQuizSection );
    }
    
    async onStart(){
        console.log( "QuizType2 start");
        this.setBackground(`draw_bg.png`);
    }
}