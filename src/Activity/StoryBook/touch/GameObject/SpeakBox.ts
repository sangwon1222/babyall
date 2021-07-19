import { App } from '../../../Core';
import gsap from 'gsap';
import { AnswerBox } from './';
import { TouchData } from '../Define';
import { AnswerImg } from './AnswerImg';
import { ExamStickerBox } from './ExamStickerBox';


const style = {
    fontFamily : 'minigate',
    fontSize: 30,
    fill : '#000000',
};

class Label extends PIXI.Sprite{

    private mText: PIXI.Text;
    get show(): boolean{
        return this.visible;
    }
    set show( v: boolean ){
        if( v ){
            if(!this.visible){
                this.visible = true;
                gsap.to( this, { alpha:1, duration: 0.2})
            }
        }else{
            if( this.visible ){
                gsap.to( this, { alpha:0, duration: 0.2}).eventCallback("onComplete",()=>{ this.visible = false} )
            }
        }        
    }

    get text(): string{
        return this.mText.text;
    }
    set text( v: string){ this.mText.text = v }

    constructor( text: string){
        super(App.Handle.currentGame.getResource(`speakbox_bg.png`).texture);
        this.anchor.set(0.5)
        this.mText = new PIXI.Text( text ,style);
        this.mText.anchor.set(0.5)
        this.addChild( this.mText );

        this.visible = (App.Handle.appData.level<3)
    }
}

export class SpeakBox extends PIXI.Container{
    // private mSpeakBox: PIXI.Container;
    private mLabel: Label;
    private mSpeakerButton: PIXI.Sprite;
    private mData: TouchData
    private mCurrentQuizIDX: number;

    static _handle: SpeakBox;
    static get Handle(): SpeakBox { return SpeakBox._handle}

    constructor(data: TouchData){
        super();
        SpeakBox._handle = this;

        this.mData = data;

        this.mLabel = new Label("");
        this.mLabel.show = false;
        this.mLabel.position.set(880/2,this.mLabel.height/2 + 10)
        this.addChild(this.mLabel)
        
        this.mSpeakerButton = new PIXI.Sprite( App.Handle.currentGame.getResource(`sound.png`).texture );
        this.mSpeakerButton.anchor.set(0.5)
        this.mSpeakerButton.position.set(this.mLabel.x - this.mLabel.width/2 - this.mSpeakerButton.width/2, this.mSpeakerButton.height/2+10)
        
        this.mSpeakerButton.on("pointertap", async ()=>{
            this.onSpeak();
        })
        this.addChild(this.mSpeakerButton)
        
    }

    initQuiz( QuizIDX: number ){
        this.mCurrentQuizIDX = QuizIDX;
        this.mLabel.text =  this.mData[this.mCurrentQuizIDX].text;
        this.onSpeak();
    }

    onSpeak(): Promise<void>{
        
        ExamStickerBox.Handle.clickOff();
        
        const correctCount = App.Handle.appData.level +2;
        const currentStep = this.mCurrentQuizIDX;
        return new Promise<void>( (resolve, reject)=>{
            if( currentStep < correctCount){  
                this.mLabel.text = this.mData[currentStep].text;
            }
            
            // AnswerBox.Handle.clickedBlink()
            
            this.mLabel.show = (App.Handle.appData.level<3);
            const quizSound = App.Handle.currentGame.getProductResource(`lt_${App.Handle.appData.bookID}_${currentStep+1}.mp3`).sound;
            quizSound.play();

            this.onSoundPlayLock( true );
            this.mSpeakerButton.texture = App.Handle.currentGame.getResource(`sound_down.png`).texture;
            this.mSpeakerButton.interactive = false;
            this.mSpeakerButton.buttonMode = false;
            gsap.delayedCall( quizSound.duration,()=>{
                ExamStickerBox.Handle.clickOn();
            })
            gsap.delayedCall( quizSound.duration+0.5,()=>{
                this.mLabel.show = false;
                this.mSpeakerButton.texture = App.Handle.currentGame.getResource(`sound.png`).texture;
                this.mSpeakerButton.interactive = true;
                this.mSpeakerButton.buttonMode = true;  
                this.onSoundPlayLock( false );      
                resolve();
            })
        });
    }

    onSoundPlayLock( flag: boolean){
        //
    }
}