import { App } from '../../../Core'

import { QuizDataType1 } from '../Define';
import {Stick} from './'
import { Rectangle, Sprite } from 'pixi.js';
import gsap from 'gsap';
import { Activity } from '../Scene';
const map ={
    b:{ 0: ["ab_b_1_1.png","ab_b_2_1.png"], 1:["ab_b_1_2.png","ab_b_1_3.png","ab_b_2_2.png","ab_b_2_3.png"], 2:["ab_b_1_2.png","ab_b_1_3.png","ab_b_2_2.png","ab_b_2_3.png"]},
    e:{ 0: ["ab_e_1_1.png","ab_e_2_1.png"], 1:["ab_e_1_2.png","ab_e_1_3.png","ab_e_1_4.png","ab_e_2_2.png"], 2:["ab_e_1_2.png","ab_e_1_3.png","ab_e_1_4.png"], 3:["ab_e_1_2.png","ab_e_1_3.png","ab_e_1_4.png"] },
    f:{ 0: ["ab_f_1_1.png","ab_f_2_1.png"], 1:["ab_f_1_2.png","ab_f_1_3.png","ab_f_2_2.png"], 2:["ab_f_1_2.png","ab_f_1_3.png"] },
    h:{ 0: ["ab_h_1_1.png","ab_h_1_2.png","ab_h_2_1.png"], 1:["ab_h_1_1.png","ab_h_1_2.png","ab_h_2_2.png"], 2:["ab_h_1_3.png"] },
    i:{ 0: ["ab_i_1_1.png","ab_i_2_1.png"], 1:["ab_i_1_2.png","ab_i_1_3.png","ab_i_2_2.png"], 2:["ab_i_1_2.png","ab_i_1_3.png"] },
    m:{ 0: ["ab_m_1_1.png","ab_m_1_3.png","ab_m_2_1.png"], 1:["ab_m_1_2.png","ab_m_1_4.png","ab_m_2_2.png","ab_m_2_3.png"] , 2:["ab_m_1_1.png","ab_m_1_3.png","ab_m_2_2.png","ab_m_2_3.png"],3:["ab_m_1_2.png","ab_m_1_4.png"] },
    n:{ 0: ["ab_n_1_1.png","ab_n_1_3.png","ab_n_2_1.png"], 1:["ab_n_1_2.png","ab_n_2_2.png"], 2:["ab_n_1_1.png","ab_n_1_3.png"] },
    w:{ 0: ["ab_w_1_1.png","ab_w_1_3.png","ab_w_2_1.png","ab_w_2_3.png"], 1:["ab_w_1_2.png","ab_w_1_4.png","ab_w_2_2.png","ab_w_2_4.png"], 2:["ab_w_1_1.png","ab_w_1_3.png","ab_w_2_1.png","ab_w_2_3.png"],3:["ab_w_1_2.png","ab_w_1_4.png","ab_w_2_2.png","ab_w_2_4.png"] },
    z:{ 0: ["ab_z_1_1.png","ab_z_1_3.png","ab_z_2_1.png","ab_z_2_3.png"], 1:["ab_z_1_2.png","ab_z_2_2.png"], 2:["ab_z_1_1.png","ab_z_1_3.png","ab_z_2_1.png","ab_z_2_3.png"] }
}
const exceptionList = [ 'b', 'e', 'f', 'h', 'i', 'm', 'n', 'w', 'z']

export class QuizBox extends PIXI.Container{
    private mStage: PIXI.Container;
    private mLine: PIXI.Sprite;
    private mDotLineArray: Array<PIXI.Sprite>;
    private mStickArray: Array<PIXI.Sprite>;
    private mStepCount = 0 ;
    private mInfo: QuizDataType1
    private levelCon: PIXI.Container; 
    private levelDirec: number;
    
    
    get stage(): PIXI.Container{ return this.mStage }
    get directionlevel(): number {return this.levelDirec}

    constructor( ){
        super()
        const level = App.Handle.appData.level ;

        this.levelDirec = level;    
        this.mDotLineArray = [];
        this.mStickArray = [];
        
        this.levelCon = new PIXI.Container();

        this.mStage = new PIXI.Container();
        this.mStage.interactive= true;
        this.mStage.hitArea = new Rectangle( -1050/2 , -720/2 ,1050 , 740 )
        
        // // 알파벳블록유형1 클릭영역 
        // const debug = new PIXI.Graphics();
        // debug.lineStyle(2, 0xff000066, 1);
        // debug.drawRect( -1050/2 , -720/2 ,1050 , 740 )
        // this.addChild(debug);

        this.addChild(this.mStage);
        this.addChild(this.levelCon);
    }
    onStart( info: QuizDataType1 ){
        this.mDotLineArray = [];
        this.mStickArray = [];
        
        this.mStepCount= 0;
        this.mInfo = info;
        this.levelCon.removeChildren();

        //알파벳 틀라인 생성
        this.mLine = new PIXI.Sprite(App.Handle.currentGame.getProductResource(this.mInfo.guide).texture);
        this.mLine.anchor.set(0.5);
        this.mLine.scale.set(0.9);
        this.levelCon.addChild(this.mLine);

        //알파벳 방향 생성
        for (let i =0; i < this.mInfo.lines.length ; i++){
            
            const line = new PIXI.Sprite();
            const stick = new PIXI.Sprite();
            
            line.texture = App.Handle.currentGame.getProductResource(this.mInfo.lines[i]).texture;
            line.anchor.set(0.5);
            line.scale.set(0.9);
            line.visible = true;

            stick.texture = App.Handle.currentGame.getProductResource(this.mInfo.correct[i]).texture;
            stick.anchor.set(0.5);
            stick.visible = false;
            if(this.levelDirec == 2){line.visible =true;}
            else{line.visible =false;}
            this.mDotLineArray.push(line);
            this.levelCon.addChild(line)
            this.mStickArray.push(stick);
            this.levelCon.addChild(stick)
        }
        if(this.levelDirec == 1){this.mDotLineArray[this.mStepCount].visible =true;}

        // const debug = new PIXI.Graphics();
        // debug.lineStyle(2,0x00FF00,1);
        // debug.drawRect(0,0,this.width,this.height);
        // debug.endFill();
        // this.addChild(debug)
        
    }
    onCorrect( gPos: PIXI.IPoint  ){
        const correct = App.Handle.currentGame.getResource(`ab_sfx_1.mp3`).sound;
        correct.play();
        
        this.mDotLineArray[ this.mStepCount ].visible = false;
        this.mStickArray[ this.mStepCount ].visible = true;

        const localPos = this.mStage.toLocal( gPos );
        this.mStickArray[ this.mStepCount ].scale.set(0.9)
        this.mStickArray[ this.mStepCount ].x = localPos.x;
        this.mStickArray[ this.mStepCount ].y = localPos.y;
        gsap.to( this.mStickArray[ this.mStepCount ], {x:0, y:0, duration:0.5 } )
        .eventCallback("onComplete",()=>{
            this.mStepCount += 1;
            console.log(`총 획순:[${this.mDotLineArray.length}] 현재 획순:[${this.mStepCount}]`)
                
            if( this.mStepCount < this.mDotLineArray.length ){
                    this.mDotLineArray[ this.mStepCount ].visible = true;
            }else {
                this.levelCon.removeChildren();
                const end = new Sprite(App.Handle.currentGame.getProductResource(this.mInfo.correct[this.mInfo.correct.length-1]).texture)
                end.anchor.set(0.5)
                end.scale.set(0.9)
                this.levelCon.addChild(end)
                end.rotation=0.05;
                const endMove = gsap.to( end , 
                    {rotation:-0.05 ,duration:0.1,onComplete:()=>{  end.rotation=0;   }})
                endMove.yoyo(true);
                endMove.repeat(3);
                /**유형 1 사운드트랙  완성음*/
                const complete1= App.Handle.currentGame.getResource(`ab_sfx_4.mp3`).sound;
                const complete2= App.Handle.currentGame.getProductResource(this.mInfo.sound[0]).sound;
                complete1.play();
                gsap.delayedCall(1, ()=>{        
                    complete2.play()
                })
                gsap.delayedCall(2, ()=>{/**문항이동 음악 */
                    const nextSound = App.Handle.currentGame.getResource(`ab_sfx_3.mp3`).sound;
                    nextSound.play();
                    Activity._handle.NextType();
                })
            }
            if(this.levelDirec > 2){
                for(let i=0; i<this.mDotLineArray.length;i++){
                    this.mDotLineArray[i].visible =false;
                }
            }
        }) 
    }
    Wrong(){
        Activity.Handle.wrongCountTYPE1 +=1;
        console.error(`type1 오답수:${Activity.Handle.wrongCountTYPE1}`)
        console.error(`type2 오답수:${Activity.Handle.wrongCountTYPE2}`)
        const wrong = App.Handle.currentGame.getResource(`ab_sfx_2.mp3`).sound;
        wrong.play();
    }
    setStick( path: string, gPos: PIXI.IPoint ): boolean{
        console.warn(`정답:[${this.mInfo.correct[this.mStepCount]}],클릭한 이미지:[${path}]`)
        
        const symbol = App.Handle.appData.symbol.toLowerCase();
        // symbol == 'b' || symbol == 'f' || symbol == 'i'|| symbol == 'w' || symbol == 'z'
        if( exceptionList.includes(symbol) ){    
            console.warn( `클릭스틱:[${path}] 통과가능스틱:[${map[symbol][this.mStepCount]}]` )
            if( map[symbol][this.mStepCount].includes(  path ) == true ){
                this.onCorrect( gPos );
                return true;
            }else{
                this.Wrong();
                return false;
            }
        }else{
            if(  this.mInfo.correct[ this.mStepCount ] == path ){
                this.onCorrect(  gPos );
                return true;
            }else{
                this.Wrong();
                return false;
            }
        }
    }
    
}
