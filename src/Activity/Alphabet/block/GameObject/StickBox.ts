import {App ,Util} from '../../../Core'
import { QuizDataType1 } from '../Define';
import {Stick} from './'
import gsap from 'gsap';

export class StickBox extends PIXI.Container{
    private mOneStick= true;
    private mOneStickLevel: number;
    //---------------------------------
    private mStickArray: Array<Stick>
    private mStage: PIXI.Container;
    private mCurrentFocusIDX: number ;
    private mWrongCount: number; 
    private mStick: Stick;
    private mWrong: Stick;

    get stage(): PIXI.Container{ return this.mStage}
    
    constructor(){
        super()
        const level = App.Handle.appData.level -1 ;
        this.mOneStickLevel = level;
        this.mWrongCount = level; 
        // ===================================보기제시 난이도=====
        if(this.mOneStickLevel == 0){
            this.mOneStick = true;
        }else{
            this.mOneStick = false;
        }
        this.mStage = new PIXI.Container();
        this.mStage.x = -(450/2);
        this.mStage.y = -(560/2);

        this.mStickArray = [];
        this.mCurrentFocusIDX = 0;
        this.addChild(this.mStage)
         
        this.interactive = true;
        this.on("pointerdown",( evt: PIXI.InteractionEvent )=>{

            const temp = this.mStickArray.slice(0).reverse();
            for( const stick of temp ){
                if( stick.checkTouchDown( evt.data.global ) == true ) {
                    this.mStage.removeChild( stick );
                    this.mStage.addChild( stick );
                    break;
                }
            }
        });

        this.on("pointerup",( evt )=>{
            for( const stick of this.mStickArray ){
                stick.focusPointerUp( evt.data.global );
            }
        })
        
    }
    
    onStart( info: QuizDataType1){    
        if(info.correct.length<1){
            this.mWrongCount = 1;
        }
        this.mStage.removeChildren();

        for (let i=0; i < info.correct.length-1; i++){
            console.warn(`스틱 리스트 => ${info.correct}`)
            this.mStick = new Stick(info.correct[i] );
            this.mStick.visible = !this.mOneStick;
            this.mStickArray.push(this.mStick)
        }
        if(this.mOneStick == true){
            //난이도 하/ 오답 안보이게 하기.
            console.log("스틱배열 길이=>",this.mStickArray.length)
            console.log("오답 길이=>",info.wrong)
        }else{
            for (let i=0; i< this.mWrongCount; i++){
                this.mWrong = new Stick( info.wrong[i] );
                // console.log(info.wrong[i])
                this.mStickArray.push(this.mWrong)
            }
        }

        const shuffledStick = this.mStickArray.slice(0);
        Util.shuffleArray(shuffledStick);
        // let offset = 0;
        for (let i=0; i< shuffledStick.length; i++){
            shuffledStick[i].anchor.set(0.5);
            shuffledStick[i].position.set(450/2,560/2);
            /**스틱 흟뿌리기 */
            if(i == 0 ) {gsap.to(shuffledStick[i],{x:0     ,  y:150   ,duration:1}) } else
            if(i == 1 ) {gsap.to(shuffledStick[i],{x:200   ,  y:150   ,duration:1}) } else
            if(i == 2 ) {gsap.to(shuffledStick[i],{x:0     ,  y:450 ,duration:1}) } else
            if(i == 3 ) {gsap.to(shuffledStick[i],{x:200   ,  y:450 ,duration:1}) }
            else{ shuffledStick[i].position.set(  450/2 , 560/2);}
            this.mStage.addChild(shuffledStick[i])
        }
        this.mStickArray[this.mCurrentFocusIDX].visible = true;
    }

    onCorrect(){
        //난이도 보기제시
        if( this.mOneStick == true ){
            // 현재 스틱 스틱에서 false
            for(let i=0; i<this.mStickArray.length;i++){
                this.mStickArray[i].visible = false
            }
            console.log( this.mStickArray );
            this.mCurrentFocusIDX += 1;
            if( this.mCurrentFocusIDX < this.mStickArray.length ){
                this.mStickArray[this.mCurrentFocusIDX].visible = true;
                console.log(`${this.mCurrentFocusIDX+1}번째 스틱 생성`)
            }
        }
    }
    onWrong(){
        //
    }
}