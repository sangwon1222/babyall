import gsap from 'gsap'
import {App ,Util} from '../../../Core'
import { QuizBox, GameType1,StickBox } from './';
import { QuizDataType1 } from '../Define';
import { Activity } from '../Scene';

export class Stick extends PIXI.Sprite{
    private mPath: string;
    private mBoxInCheck: boolean;
    private mReturnPos: PIXI.Point;
    private mDragFlag = false;
    private mDeltaByClick = new PIXI.Point(0,0);
    private levelScale: number;

    get path(): string{
        return this.mPath;
    }

    constructor( path: string){
        super();

         //크기 난이도      첫번째 유형
         const level = App.Handle.appData.level ;

         this.levelScale = level;
        if(this.levelScale == 1){  this.scale.set(1)  }
        else { gsap.to(this.scale, {x:0.8,y:0.8,duration:1}) }
        // =================================================

        this.mPath = path;
        this.texture = App.Handle.currentGame.getProductResource(path).texture;

        this.interactive = true;
        this.anchor.set(0.5);
        
        this.on("pointermove",( evt )=>{
            if( this.mDragFlag ){
                this.onDragging( evt );
            }
        });
    }

    focusPointerUp( globalMPos: PIXI.IPoint ){
        if( this.mDragFlag == false ) return;
        this.mDragFlag = false;
        this.buttonMode = false;
        this.onDragEnd( globalMPos ); 
    }
    checkTouchDown( gMpos: PIXI.IPoint ): boolean{
        if( Util.getColorByPoint( this , new PIXI.Point( gMpos.x, gMpos.y) ).a != 0 ){
            this.mDragFlag = true;
            const localPos = this.parent.toLocal( new PIXI.Point( gMpos.x,  gMpos.y) );
        
            this.mDeltaByClick.x = localPos.x - this.x
            this.mDeltaByClick.y = localPos.y - this.y
            
            this.buttonMode = true;
            this.onDragStart(); 
            return true;
        }else{
            return false;
        }
    }
    
    onDragStart(){
        this.buttonMode = true;
        this.mReturnPos = new PIXI.Point( this.x, this.y );
    }
    onDragging( evt: PIXI.InteractionEvent  ){
        const localPos = this.parent.toLocal( new PIXI.Point( evt.data.global.x,  evt.data.global.y) );
        const x = localPos.x  - this.mDeltaByClick.x;
        const y = localPos.y  - this.mDeltaByClick.y;
        this.position.set( 
            localPos.x - this.mDeltaByClick.x,
            localPos.y - this.mDeltaByClick.y
        )
        if( localPos.x > 350 || localPos.y > 550 || localPos.y < -80){
            this.mDragFlag=false;
            this.buttonMode = false;
            const wrong = App.Handle.currentGame.getResource(`ab_sfx_2.mp3`).sound;
            wrong.play();
            gsap.to( this, {x: this.width/2 ,y: this.height/2, duration:0.5,ease:'back'})
        }
    }
    onDragEnd( globalMPos: PIXI.IPoint  ){
        // // QuizBox위에서 놓았는지 검사.
        // const qbox = Activity.Handle.getCurrentQuizBox();
        // const localMPos = qbox.stage.toLocal( globalMPos );
        // if( qbox.stage.hitArea.contains( localMPos.x, localMPos.y) ){
        //     console.log( "Drop in QuizBox ");
        //     this.mBoxInCheck = true;
        // } else{
        //     console.log( "Drop out QuizBox ");
        //     this.mBoxInCheck = false;
        // }
        // const gPos = this.toGlobal( new PIXI.Point( 0,0) )
        // this.stickCheck( gPos );
    }
    
    stickCheck( gPos: PIXI.IPoint ){

        // const qbox = Activity.Handle.getCurrentQuizBox();
        // const sbox = Activity.Handle.getCurrentStickBox();
        // if(this.mBoxInCheck == true ){ 
        //     const result = qbox.setStick( this.mPath, gPos );
        //     if( result == true){
        //         sbox.onCorrect( );
        //         this.visible = false;
        //         this.x = this.mReturnPos.x;
        //         this.y = this.mReturnPos.y;
        //     }else{
        //         sbox.onWrong( );
        //         gsap.to( this, {x: this.mReturnPos.x ,y: this.mReturnPos.y, duration:0.5,ease:'back'}) 
        //     }
            
        // }else{ 
        //     // 
        // }
    }

}