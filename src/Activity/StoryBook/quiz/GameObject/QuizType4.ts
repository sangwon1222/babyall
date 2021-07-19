import { App  } from '../../../Core';
import { Choice2Side } from './Choice2Side'
import { QuizTypeBase} from './QuizTypeBase'
import { NineSlicePlane } from 'pixi.js';
import { SoundButton } from './SoundButton';
import { ChoiceSide } from './Choice2Side';
import { ResultMark } from './ResultMark';
import { CardBG } from './CardBG';
import { ChoiceCards } from './ChoiceCards';
import gsap from 'gsap';
import { Stick } from '@/Activity/Alphabet/block/GameObject';

const TextStyle = new PIXI.TextStyle({
    fontFamily: 'minigate',
    fontSize: 50,
    fontWeight: 'bold',
    fill: '#000000',
});

const TextStyleSingle = new PIXI.TextStyle({
    fontFamily: 'minigate',
    fontSize: 80,
    fontWeight: 'bolder',
    fill: '#000000',
});

export class WordBox extends PIXI.Container{
    private mBG: PIXI.NineSlicePlane;
    private mTextContainer: PIXI.Container;
    private mText: PIXI.Text;
    private mMask: PIXI.NineSlicePlane;
    private mAnswerText: string;

    constructor( answerText: string, quizText: string){
        super( );
        this.mAnswerText = answerText;

        const startText = quizText.split("&")[0];
        let tempText = "";
        let boxText = "";

        for( let i=0; i< quizText.length; i++ ){
            if( quizText[i]=="&" ){
                boxText+= 'W';
                tempText +="W";
            }else{
                tempText +=quizText[i];
            }
        }
        const startTextSpr = new PIXI.Text( startText, TextStyle );
        const boxTextSpr = new PIXI.Text( boxText, TextStyle );

        
        // console.log( "startText", startText, "boxText",boxText);
        this.mBG = new PIXI.NineSlicePlane( App.Handle.currentGame.getViewerResource("sq_text_box.png").texture, 50, 50, 50, 50 )
        
        this.mBG.height = 90;
        this.addChild( this.mBG );

        this.mTextContainer = new PIXI.Container();
        this.addChild( this.mTextContainer );

        this.mText = new PIXI.Text( tempText, TextStyle );
        this.mText.y = -5;
        this.mTextContainer.addChild( this.mText );

        this.mBG.width = this.mText.width+150;
        this.mBG.pivot.set( this.mBG.width/2, this.mBG.height/2);

        this.mMask = new PIXI.NineSlicePlane( App.Handle.currentGame.getViewerResource("sq_box7.png").texture, 10, 10, 10, 10 )
        this.mMask.width = boxTextSpr.width+1;
        this.mMask.height = boxTextSpr.height + 4;

        this.mMask.x = startText.length==0?0:startTextSpr.width;
        this.mMask.y = -2;

        this.mTextContainer.addChild( this.mMask );
        
        this.mTextContainer.pivot.set( this.mText.width/2, this.mText.height/2)
    }

    showResult(): Promise<void>{
        return new Promise<void>(
            (resolve,reject)=>{
                this.mText.text = this.mAnswerText;
                this.mMask.alpha = 0;
                resolve();
                // gsap.to( this.mMask, {alpha:0, duration:0.5}).eventCallback("onComplete",()=>resolve()) 
            }
        )
    }
}

export class QuizType4 extends QuizTypeBase{
    
    private mWordBox: WordBox;
    private mSoundButton: SoundButton;
    private mResultMark: ResultMark;
    private mChoiceCards: ChoiceCards;
    
    constructor( quizIDX: number, quizAnswer: string, quizText: string, examples: Array<string>  ){
        super();
        /**
         * sq_bg1.png           => OX 화면
         * sq_bg2.png           => 양면 화면
         * sq_bg3.png           => 파란줄무늬 화면
        */
        
        const bookID = App.Handle.appData.bookID;
        this.setBackground( "sq_bg3.png" );
                
        //카드 생성.
        this.mChoiceCards = new ChoiceCards();
        this.mChoiceCards.position.set( 1280/2, 720/2 +50 )
        this.mChoiceCards.onResult = async ( isCorrect: boolean)=>{
            // console.log(`%c 사운드반복 끝`,"border-bottom:2px red solid;")
            this.mSoundButton.repeatSound(false);

            console.log( "onResult ", isCorrect );
            if(isCorrect == false ){ this.wrongCount +=1 }
            this.mSoundButton.clickLock(true);
            await this.mWordBox.showResult();
            await this.mResultMark.show( isCorrect  ,this.mSoundButton.soundDuration);
            //다음문제로 넘어간다.
            this.endQuiz();
        }
        this.addChild( this.mChoiceCards );
            
        if( App.Handle.appData.level != 3 ) { // 레벨'상'이면, 카드3개 다른 레벨은 2개
            const card1 = new CardBG(quizIDX)
            card1.isCorrect = true;
            const img1 = new PIXI.Text( examples[0], TextStyle )
            img1.anchor.set(0.5);
            card1.addToSlot( img1 );
            this.mChoiceCards.addCard( card1 );
            
            const card2 = new CardBG(quizIDX)
            let qtext = examples[1];
            if( examples.length>2 ){
                if( Math.random()>0.5){ qtext = examples[2] }
            }
            const img2 = new PIXI.Text( qtext, TextStyle )
            img2.anchor.set(0.5);
            card2.addToSlot( img2 );
            this.mChoiceCards.addCard( card2 );
            if( App.Handle.appData.level == 1 ){
                img1.style = TextStyleSingle;
                img2.style = TextStyleSingle;
            }
        }else{
            const card1 = new CardBG(quizIDX)
            card1.isCorrect = true;
            const img1 = new PIXI.Text( examples[0], TextStyle )
            img1.anchor.set(0.5);
            card1.addToSlot( img1 );
            this.mChoiceCards.addCard( card1 );

            const card2 = new CardBG(quizIDX)
            const img2 = new PIXI.Text( examples[1], TextStyle )
            img2.anchor.set(0.5);
            card2.addToSlot( img2 );
            this.mChoiceCards.addCard( card2 );

            const card3 = new CardBG(quizIDX)
            const img3 = new PIXI.Text( examples[2], TextStyle )
            img3.anchor.set(0.5);
            card3.addToSlot( img3 );
            this.mChoiceCards.addCard( card3 );
        }
        
        this.mWordBox = new WordBox( quizAnswer, quizText )
        this.mWordBox.position.set( 1280/2, 80)
        this.addChild( this.mWordBox )

        this.mSoundButton = new SoundButton(App.Handle.currentGame.getProductResource(`sq_${bookID}_${quizIDX}.mp3`).sound );
        this.mSoundButton.position.set( - this.mWordBox.width/2-50, 0)
        this.mWordBox.addChild( this.mSoundButton )

        this.mResultMark = new ResultMark();
        this.mResultMark.position.set( 1280/2, 720/2 );
        this.addChild( this.mResultMark );

        
    }

    async onStart(){
        await this.mSoundButton.repeatSound(true,this.mChoiceCards);
        await this.mChoiceCards.start();
        // this.mBackground.start( ChoiceSide.right );
    }
}