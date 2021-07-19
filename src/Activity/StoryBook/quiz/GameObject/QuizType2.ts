import { App  } from '../../../Core';
import { Choice2Side } from './Choice2Side'
import { QuizTypeBase} from './QuizTypeBase'
import { NineSlicePlane } from 'pixi.js';
import { SoundButton } from './SoundButton';
import { ChoiceSide } from './Choice2Side';
import { ResultMark } from './ResultMark';
import {shuffleArray} from '../../../Core/Util';

const TextStyle = new PIXI.TextStyle({
    fontFamily: 'minigate',
    fontSize: 50,
    fontWeight: 'bold',
    fill: '#000000',
});

export class WordBox extends PIXI.Container{
    private mBG: PIXI.NineSlicePlane;
    private mText: PIXI.Text;
    get text(): string{ return this.mText.text }
    set text(v: string){ 
        this.mText.text = v; 
        this.resetPos();
    }
    
    constructor(){
        super( );
        this.mBG = new PIXI.NineSlicePlane( App.Handle.currentGame.getViewerResource("sq_text_box.png").texture, 50, 50, 50, 50 );
        this.mBG.height = 90;
        
        this.addChild( this.mBG );

        this.mText = new PIXI.Text( "", TextStyle );
        this.mText.anchor.set(0.5);
        this.mText.position.y = 40;
        this.mBG.addChild( this.mText );
    }
    resetPos(){
        this.mBG.width = this.mText.width+150;
        this.mBG.pivot.set( this.mBG.width/2, this.mBG.height/2);
        this.mText.x = this.mBG.width/2; 
    }
}

export class QuizType2 extends QuizTypeBase{
    
    private mChoice: Choice2Side;
    private mWordBox: WordBox;
    private mSoundButton: SoundButton;
    private mResultMark: ResultMark;
    private mCorrectSide: ChoiceSide;

    constructor( quizIDX: number, quizText: string ){
        super();
        const bookID = App.Handle.appData.bookID;
        this.setBackground( `sq_bg2.png` );
        
        this.mChoice = new Choice2Side(3)
        this.mChoice.onResult = async ( isCorrect: boolean)=>{
            // console.log(`%c 사운드반복 끝`,"color:red;font-weight:bold;")
            this.mSoundButton.repeatSound(false);
            console.log( "onResult ", isCorrect );
            if(isCorrect == false ){ this.wrongCount +=1 }
            this.mSoundButton.clickLock(true);
            await this.mResultMark.show( isCorrect ,this.mSoundButton.soundDuration );
            //다음문제로 넘어간다.
            this.endQuiz();
        }
        this.addChild(this.mChoice)
        
        const img1 = new PIXI.Sprite( App.Handle.currentGame.getProductResource(`sq_${bookID}_3.png`).texture )
        img1.anchor.set(0.5,1);
        const img2 = new PIXI.Sprite( App.Handle.currentGame.getProductResource(`sq_${bookID}_4.png`).texture )
        img2.anchor.set(0.5,1);
        
        const list = [ img1, img2 ];
        shuffleArray( list );
        this.mChoice.addToLeftSlot( list[0] );
        this.mChoice.addToRightSlot( list[1] );
        if( list[0] == img1 ){
            this.mCorrectSide = ChoiceSide.left;
        }else{
            this.mCorrectSide = ChoiceSide.right;
        }

        this.mWordBox = new WordBox()
        this.mWordBox.text = quizText;
        this.mWordBox.position.set( 1280/2, 70)
        this.mWordBox.interactive = true;
        this.mWordBox
        .on("pointerdown",(evt)=>{ evt.stopPropagation(); })
        .on("pointerup",(evt)=>{ evt.stopPropagation(); })

        this.addChild( this.mWordBox )

        this.mSoundButton = new SoundButton(App.Handle.currentGame.getProductResource(`sq_${bookID}_${quizIDX}.mp3`).sound );
        this.mSoundButton.position.set( - this.mWordBox.width/2-100, 0)
        this.mWordBox.addChild( this.mSoundButton )

        this.mResultMark = new ResultMark();
        this.mResultMark.position.set( 1280/2, 720/2 );
        this.addChild( this.mResultMark );
    }

    async onStart(){
        this.mSoundButton.repeatSound(true,this.mChoice);
        this.mChoice.start( this.mCorrectSide );
    }
}