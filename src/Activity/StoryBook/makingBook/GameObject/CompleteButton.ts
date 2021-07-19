import { App } from '../../../Core';
import { Canvas } from './Canvas';
import { Stage } from './Stage';
import { Rectangle } from 'pixi.js';
import { SystemModule } from '@/store/System';
import Swal from 'sweetalert2';


export class CompleteButton extends PIXI.Sprite{
    
    private mComplete = App.Handle.currentGame.getResource(`out_on.png`).texture
    private mUnComplete = App.Handle.currentGame.getResource(`out_off.png`).texture

    constructor(){
        super()
        
        this.interactive = false;
        this.texture = this.mUnComplete;

        // const rect = new PIXI.Graphics();
        // rect.lineStyle(2,0x0000,1)
        // rect.beginFill(0x0000,1)
        // rect.drawRoundedRect(this.x, this.y, this.width,this.height ,25)
        // rect.endFill();
        // rect.position.set(0 , 0);
        // this.addChild(rect)

        this.hitArea = new PIXI.RoundedRectangle(this.x, this.y, this.width,this.height ,25)

        this
        .on("pointerdown", ()=>{
            Canvas.Handle.focusOut();
        })
        .on("pointerover", ()=>{
            Canvas.Handle.focusOut();
        })
        .on("pointertap",async ()=>{ 
            if( SystemModule.isDemoMode == true ){
                Swal.fire({ text: `체험판에서는 사용할수 없습니다.`});
                return;
            }
            Canvas.Handle.focusOut(); 
            this.alpha = 0;
            await this.saveAndGo();
            this.alpha = 1;
        })

    }
    
    async saveAndGo(){
        /**꾸민 캔버스 저장하고 나가기 기능 */
        await Stage.Handle.makeScreenShot();
        App.Handle.nextGame();
    }

    changeTexture(on: boolean){
        if(on){
            this.texture = this.mComplete;
            this.interactive = true;
            this.buttonMode  = true;
        }else{
            this.texture = this.mUnComplete;
            this.interactive = false;
            this.buttonMode  = false;
        }
    }

}