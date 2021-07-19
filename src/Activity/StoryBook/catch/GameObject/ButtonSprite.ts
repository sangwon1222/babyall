import {App, SceneBase, Util} from "../../../Core"
import gsap from 'gsap';
import { Activity } from "../Scene/Activity"
import { Rectangle } from 'pixi.js';
import { Affordance } from './affordance';

export class ButtonSprite extends PIXI.Sprite{
    static _handle: ButtonSprite;
    static get Handle(): ButtonSprite {return ButtonSprite._handle}

    private mAffordance: Affordance;
    private mQuiz: PIXI.Sprite;
    private mRect: any;

    get  activity(): Activity{ return (App.Handle.currentGame.currentScene as Activity); }

    constructor(path: string){
        super()
        ButtonSprite._handle = this;
        this.mQuiz = new PIXI.Sprite(App.Handle.currentGame.getProductResource(path).texture )
        this.mQuiz.buttonMode = false;
        this.addChild(this.mQuiz)

        this.mAffordance = new Affordance()
        //화살표 클릭 시 
        this.mAffordance.on("pointertap",()=>{
            this.arrowClick();
        })
        //그림 클릭 시 
        this.mQuiz.on("pointerdown",(evt: PIXI.InteractionEvent)=>{
            this.spriteClick(evt)
        })

        this.mQuiz.on("pointermove",(evt: PIXI.InteractionEvent)=>{
            if(Util.getColorByPoint(this.mQuiz, new PIXI.Point( evt.data.global.x , evt.data.global.y ) ).a != 0  ){
                this.mQuiz.buttonMode = true;
            }else{
                this.mQuiz.buttonMode = false;
            }
        })
    }

    spriteClick(evt: PIXI.InteractionEvent){
        if(Util.getColorByPoint(this.mQuiz, new PIXI.Point( evt.data.global.x , evt.data.global.y ) ).a != 0  ){
            this.arrowClick();
            const clickSound = App.Handle.currentGame.getResource(`common_click.mp3`).sound
            clickSound.play();
        }else{ 
            console.log(`클릭영역이 아닙니다.`) 
        }
    }

    affordance(){
        // 퀴즈 이미지의 터치 이벤트 활성화
        this.mQuiz.interactive = true;
        
        const rect = Util.getCropSize(this.mQuiz)
        this.mRect = rect;
        // console.log(`화살표 방향의 좌표 [${this.mRect.x}],[${this.mRect.y}],[${this.mRect.w}],[${this.mRect.h}]`)
        const arrowX = this.mRect.x + (this.mRect.w/2) - (this.mAffordance.width/2)
        const arrowY = this.mRect.y + (this.mRect.h/2) - (this.mAffordance.height/2);
        this.mAffordance.position.set( arrowX , arrowY+20 )
       
        this.mAffordance.onHand();
        this.mAffordance.buttonMode = true;
        this.mAffordance.interactive = true;
        this.addChild(this.mAffordance)
    }
    arrowClick(){
        this.removeChild(this.mAffordance)
        this.mQuiz.buttonMode = false;
        this.mQuiz.interactive = false;
        this.activity.currentPage.onText();
    }
}