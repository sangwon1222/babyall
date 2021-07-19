import gsap from 'gsap'

import {App} from '../../../Core'
import { NineSlicePlane } from 'pixi.js';


export enum ChoiceSide{
    unknown = 0,
    left,
    right,
}

export class Choice2Side extends PIXI.Container{
    
    private mCorrectTexture: PIXI.Texture;  // 정답 텍스쳐 : 노란선
    private mWrongTexture: PIXI.Texture;    // 오답 택스쳐 : 남색알파 solid
    private mNormalTexture: PIXI.Texture;    // 대기 택스쳐 

    private mQuizIDX: number;

    private mLeft: PIXI.Sprite;
    private mRight: PIXI.Sprite;

    private mLeftCover: PIXI.Sprite;  //정오답 대기시 모션 줄 사진
    private mRightCover: PIXI.Sprite;

    private mAnswerSide: ChoiceSide;

    // 외부 추가 Child Container
    private mLeftExternalSlot: PIXI.Container;
    private mRightExternalSlot: PIXI.Container;

    constructor(quizIDX: number){
        super()
        this.mQuizIDX = quizIDX;
        this.mAnswerSide = ChoiceSide.unknown;

        this.mNormalTexture = App.Handle.currentGame.getResource("sq_box1_1.png").texture;

        this.mCorrectTexture = App.Handle.currentGame.getResource("sq_box1_2.png").texture;
        this.mWrongTexture = App.Handle.currentGame.getResource("sq_box1_3.png").texture;

        this.mLeft = new PIXI.Sprite(  this.mNormalTexture );
        this.mRight = new PIXI.Sprite(  this.mNormalTexture );
        this.mLeft.anchor.set(0.5);
        this.mRight.anchor.set(0.5);
        if(quizIDX!=3 ){
            this.mLeft.position.set(1280/2 - (1280/2)/2 -100, 720/2);
            this.mRight.position.set(1280/2 + (1280/2)/2 +100, 720/2);
        }
        else{
            this.mLeft.position.set(1280/2 - 220, 720/2 + 50);
            this.mRight.position.set(1280/2 + 220, 720/2 + 50);
        }
        this.addChild( this.mLeft );
        this.addChild( this.mRight );

        this.mLeftCover = new PIXI.Sprite();
        this.mLeftCover.anchor.set(0.5);
        this.mRightCover = new PIXI.Sprite();
        this.mRightCover.anchor.set(0.5);
        this.mLeftCover.alpha = 0;
        this.mRightCover.alpha = 0;
        this.mLeft.addChild( this.mLeftCover );
        this.mRight.addChild( this.mRightCover );

        this.mLeftExternalSlot = new PIXI.Container();
        this.mLeftExternalSlot.position.set( 0, 0)
        this.mRightExternalSlot = new PIXI.Container();
        this.mRightExternalSlot.position.set( 0, 0)

        this.mLeft.addChild( this.mLeftExternalSlot );
        this.mRight.addChild( this.mRightExternalSlot );
        
        // this.start( ChoiceSide.left );
    }
    
    start( answerSide: ChoiceSide ){
        this.mAnswerSide = answerSide;

        this.mLeft.interactive = true;
        this.mLeft.buttonMode = true;
        this.mRight.interactive = true;
        this.mRight.buttonMode = true;
        
        this.mLeft.once("pointerdown",()=>{
            console.log( "select Left");
            this.setCorrect( this.mAnswerSide == ChoiceSide.left );
            this.mRight.off("pointerdown");
            this.onResult( this.mAnswerSide == ChoiceSide.left );
        })
        this.mRight.once("pointerdown",()=>{
            console.log( "select Right");
            this.setCorrect( this.mAnswerSide == ChoiceSide.left );
            this.mLeft.off("pointerdown");
            this.onResult( this.mAnswerSide == ChoiceSide.right );
        })
        
    }

    setCorrect( left: boolean ){
        if( left == true ){
            this.mLeftCover.texture=this.mCorrectTexture;
            this.mRightCover.texture = this.mWrongTexture;
            this.mRightExternalSlot.alpha=0.4;
            gsap.to( this.mLeftCover, { alpha:1, duration:0.5}).yoyo(true).repeat(-1)
            gsap.to( this.mRightCover, { alpha:1, duration:0.5})
        }else{
            this.mLeftCover.texture=this.mWrongTexture;
            this.mRightCover.texture=this.mCorrectTexture;
            this.mLeftExternalSlot.alpha=0.4;
            gsap.to( this.mLeftCover, { alpha:1, duration:0.5})
            gsap.to( this.mRightCover, { alpha:1, duration:0.5}).yoyo(true).repeat(-1)
        }       
    }

    onResult(isCorrect: boolean){
        //
    }

    addToLeftSlot( element: PIXI.Sprite ){
        this.mLeftExternalSlot.addChild( element );
        element.anchor.set(0.5)
        if(this.mQuizIDX==3){element.scale.set(0.7)}
    }
    addToRightSlot( element: PIXI.Sprite ){
        this.mRightExternalSlot.addChild( element );
        element.anchor.set(0.5)
        if(this.mQuizIDX==3){element.scale.set(0.7)}
    }

    //선택 대기 중 이미지 애니메이션
    waitingAnimation(){
        gsap.to(this.mLeft.scale, {x:1.1,y:1.1 ,duration:0.5}).yoyo(true).repeat(1);
        gsap.to(this.mRight.scale,{x:1.1,y:1.1 ,duration:0.5}).yoyo(true).repeat(1);
    }
}