import * as PIXI from "pixi.js"
import { gsap, TweenMax } from 'gsap';

import { Mole } from './Mole';
import { App } from '@/Activity/Core';


const QuizTextStyle = new PIXI.TextStyle({
    fontFamily: "minigate",
    fontSize: 77,
    // fontStyle: "italic",
    fontWeight: "bold",
    fill: "#00ad98",
});

export class QuizBoard extends PIXI.Sprite{
    private mCard: PIXI.Sprite;
    private mQuizWord: PIXI.Sprite;
    
    private mEff: PIXI.spine.Spine;

    private mCardTextureNormal: PIXI.Texture;
    private mCardTextureCurrent: PIXI.Texture;
    private mCardTextureCorrect: PIXI.Texture;

    constructor( symbol: string, idx: number){
        super( App.Handle.currentGame.getResource("sign.png").texture );
        this.anchor.set( 0.5,1);

        this.mCardTextureNormal = App.Handle.currentGame.getResource("card.png").texture;
        this.mCardTextureCurrent = App.Handle.currentGame.getResource("card_question.png").texture;
        this.mCardTextureCorrect = App.Handle.currentGame.getResource("card_correct.png").texture;

        this.mCard = new PIXI.Sprite( this.mCardTextureNormal );
        this.mCard.anchor.set(0.5, 0.5 );
        this.mCard.position.set(0, -127 );
        this.addChild( this.mCard ); 

        this.mQuizWord = new PIXI.Sprite(
            App.Handle.currentGame.getProductResource(`${symbol.toLowerCase()}${idx+1}.png`).texture
        )
        this.mQuizWord.anchor.set( 0.5)
        this.mCard.addChild( this.mQuizWord );

        this.mEff = new PIXI.spine.Spine( App.Handle.currentGame.getResource("effect_success.json").spineData );
        this.mCard.addChild( this.mEff );
        
        this.turnOff();        
    }

    turnOff(delay=0){
        this.mEff.visible = false;
        this.mCard.texture = this.mCardTextureNormal
        if( delay == 0){
            this.scale.set(0.8);
        }else{
            TweenMax.to( this.scale, delay, {x:0.8, y:0.8});
        }
        this.tint = 0xAAAAAA;
        this.mCard.tint = 0xAAAAAA;
        this.mQuizWord.tint = 0xAAAAAA;        
    }
    turnOn(delay=0 ){
        this.mEff.visible = false;
        this.mCard.texture = this.mCardTextureCurrent;
        this.tint = 0xffffff;
        this.mCard.tint = 0xffffff;
        this.mQuizWord.tint = 0xffffff;        
        if( delay == 0){
            this.scale.set(1);
        }else{
            TweenMax.to( this.scale, delay, {x:1, y:1});
        }        
    }

    correct(){
        this.mCard.texture = this.mCardTextureCorrect;
        this.mEff.visible = true;
        this.mEff.state.setAnimation(0,"effect_success", false);
        this.mEff.state.addListener({
            complete: (entry) => {
                if (entry.animation.name == "effect_success") {
                    this.mEff.visible = false;        
                }
            },
        });
        const t = gsap.timeline();
        t.set( this.mCard.scale, {x:1, y:1} )
        t.fromTo( this.mCard.scale, {x:1, y:1, duration: 0.5}, {x:1.5, y:1.5} )
        t.fromTo( this.mCard.scale, {x:1.5, y:1.5, duration: 0.5}, {x:1, y:1} )

    }

}

export class QuizBox extends PIXI.Container{
    static debugMode = false;
    
    private mQuizIndex: number;
    private mBoards: Array<QuizBoard>;
    private mSound: PIXI.sound.Sound;

    constructor( symbol: string ){
        super();
        this.mSound = App.Handle.currentGame.getProductResource(`${symbol.toLowerCase()}.mp3`).sound;

        this.mQuizIndex = -1;
        this.mBoards=[
            new QuizBoard(symbol,0),
            new QuizBoard(symbol,1)
        ]
        this.mBoards[0].x = -100;
        this.mBoards[1].x = 100;
        for( const spr of this.mBoards ){ this.addChild( spr ) }
        if( QuizBox.debugMode ){
            // 중심 표시
            const debugCenter = new PIXI.Graphics();
            debugCenter.lineStyle(2, 0xFF0000, 1);
            debugCenter.moveTo( 0, -10 );
            debugCenter.lineTo( 0, 10);
            debugCenter.moveTo( -10, 0 );
            debugCenter.lineTo( 10, 0);
            this.addChild(debugCenter);
        }
    }

    startQuizStep( quizStepIDX: number ){
        this.mSound.play();
        this.mQuizIndex = quizStepIDX;
        if( this.mQuizIndex == 1 || this.mQuizIndex == 3 ){
            this.mBoards[0].turnOn(0.3);
            this.mBoards[1].turnOff(0.3);
        }else if( this.mQuizIndex == 2 || this.mQuizIndex == 4 ){
            this.mBoards[0].turnOff(0.3);
            this.mBoards[1].turnOn(0.3);
        }
        App.Handle.currentGame.getResource("ac_sfx_3.mp3").sound.play()
    }
    correct(){
        this.mSound.play();
        console.log( "CORRECT",this.mQuizIndex);
        if( this.mQuizIndex == 1 || this.mQuizIndex == 3 ){
            this.mBoards[0].correct();
        }else if( this.mQuizIndex == 2 || this.mQuizIndex == 4 ){
            this.mBoards[1].correct();
        }
    }
}
