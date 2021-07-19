import { Activity } from '../Scene';
import gsap from 'gsap';
import { AnswerBox,SpeakBox,ExamStickerBox } from './';
import { App, Util } from '../../../Core';
export class ExamSticker extends PIXI.Container {
    
    private mExamSticker: PIXI.Sprite;
    private mCloseSticker: PIXI.Sprite;
    private mTextureOpened: PIXI.Texture;
    private mTextureClosed: PIXI.Texture;
    
    private mDragFlag: boolean;

    private mId: number;
    
    get isOpened(): boolean{ return this.mExamSticker.texture == this.mTextureOpened}
    get stickerIDX(): number { return this.mId}

    constructor(id: number, openImageFileName: string, closeImageFileName?: string ){
        super()
        this.mId = id;        
        
        this.mTextureOpened = App.Handle.currentGame.getProductResource(openImageFileName).texture
        if(closeImageFileName){this.mTextureClosed = App.Handle.currentGame.getProductResource(closeImageFileName).texture}
        this.mExamSticker= new PIXI.Sprite();
        this.mExamSticker.texture = this.mTextureOpened
        this.mExamSticker.anchor.set(0.5);
        gsap.to(this.mExamSticker,{rotation:0.05,duration:1}).repeat(-1).yoyo(true);

        this.mCloseSticker= new PIXI.Sprite();
        this.mCloseSticker.texture = this.mTextureClosed
        this.mCloseSticker.anchor.set(0.5)
        
        this.addChild(this.mCloseSticker)
        this.addChild(this.mExamSticker)    

        this.clickOff();
        // this.alpha=0.3;
        this.mExamSticker
        .on("pointerdown",(evt)=>{
            const localPos = this.parent.toLocal( new PIXI.Point( evt.data.global.x,  evt.data.global.y) );
            this.dragStart()
            this.parent.addChild(this.mExamSticker)
            gsap.to(this.mExamSticker.scale,{x:1.6,y:1.6,duration:0.5})
            this.mExamSticker.position.set(localPos.x ,localPos.y )
        })
        .on("pointermove", (evt: PIXI.InteractionEvent)=>{
            if(this.mDragFlag){
                const localPos = this.parent.toLocal( new PIXI.Point( evt.data.global.x,  evt.data.global.y) );
                this.mExamSticker.position.set( localPos.x , localPos.y  )
            }
        })
        .on("pointertap",(evt)=>{
            const localPos = this.parent.parent.toLocal( new PIXI.Point( 
                evt.data.global.x,  
                evt.data.global.y
                ) );
            this.dragEnd(localPos);
            gsap.to(this.mExamSticker.scale,{x:1.3,y:1.3,duration:0.5})
        })
        .on("pointerupoutside",(evt)=>{
            const localPos = this.parent.parent.toLocal( new PIXI.Point( 
                evt.data.global.x,  
                evt.data.global.y
                ) );
            this.dragEnd(localPos);
            gsap.to(this.mExamSticker.scale,{x:1.3,y:1.3,duration:0.5})
        })
    }

    dragStart(){
        this.mDragFlag=true;
    }

    async dragEnd(gPos: PIXI.IPoint){
        this.mDragFlag=false;
        const Rect = AnswerBox.Handle.getBox(Activity.Handle.currentStep);

        if(gPos.x < 900 ){
            await this.stickerCheck()
        }else{
            /**박스 밖에 놔서 오답 */
            console.log(`x값=>[${gPos.x}] // 그림박스 밖에 놔서 오답`)
            this.wrongSound()
            gsap.to(this.mExamSticker,{ x: this.x , y: this.y , duration:0.5})
            await SpeakBox.Handle.onSpeak();
            ExamStickerBox.Handle.CountWrong();    
        }
        
        // if(Rect.hitArea.contains( gPos.x , gPos.y ) && gPos.x < 900 ){
        //     await this.stickerCheck()
        // }else{
        //     /**렉트 밖에 놔서 오답 */
        //     console.log(`x값=>[${gPos.x}] // 렉트 밖에 놔서 오답`)
        //     this.wrongSound()
        //     gsap.to(this.mExamSticker,{ x: this.x , y: this.y , duration:0.5})
        //     await SpeakBox.Handle.onSpeak();
        //     ExamStickerBox.Handle.CountWrong();
        // }
    }
    

    // fadeOut(): Promise<void>{
    //     return new Promise<void>( 
    //         ( resolve, reject )=>{
    //             gsap.to( this.mExamSticker, { alpha:0, duration: 0.2 })
    //             .eventCallback("onComplete",()=>{
    //                 this.removeChild(this.mExamSticker)
    //                 resolve();
    //             })
    //         }
    //     );
    // }
    fadeOut(){
        this.mExamSticker.alpha=0;
        this.removeChild(this.mExamSticker)
    }

    async stickerCheck(){
        
        console.warn(`클릭한 스티커의 인덱스 :${this.mId}`)
        const isCorrect = (this.mId == Activity.Handle.currentStep + 1);
        if(isCorrect){
            this.fadeOut();                            /**해당스틱 사라짐 */
            AnswerBox.Handle.setClose(this.mId);        /**맞춘 스티커 나타남 */
            await this.correctSound()                   /**정답음 띠로링 사운드 */
            await this.WordSound(this.mId)              /**정답 단어사운드 출력 */
            
            const stage = Activity.Handle.onNextQuiz();
        }else{
            /**렉트안에 들어갔지만 이미지가 안맞아서 오답 */
            this.wrongSound()
            gsap.to(this.mExamSticker,{ x: this.x , y: this.y , duration:0.5})
            SpeakBox.Handle.onSpeak();
            ExamStickerBox.Handle.CountWrong();
        }
    }

    WordSound(idx: number): Promise<void>{
        return new Promise<void>(
            (resolve,reject)=>{
                const wordSND = App.Handle.currentGame.getProductResource(`lt_${App.Handle.appData.bookID}_${idx}_1.mp3`).sound;
                wordSND.play();
                gsap.delayedCall(wordSND.duration,()=>{
                    resolve();
                })
            }
        )
    }

    correctSound(): Promise<void>{
        return new Promise<void>(
            (resolve,reject)=>{
                const snd = App.Handle.currentGame.getResource(`lt_sfx_3.mp3`).sound;
                const correctSND = App.Handle.currentGame.getResource(`lt_sfx_1.mp3`).sound;

                snd.play();
                gsap.delayedCall(snd.duration,()=>{
                    correctSND.play();
                })
                
                gsap.delayedCall(snd.duration+correctSND.duration,()=>{
                    resolve();
                })
            }
        )
    }

    wrongSound(): Promise<void>{
        return new Promise<void>(
            (resolve,reject)=>{
                const X = App.Handle.currentGame.getResource(`lt_sfx_2.mp3`).sound;
                X.play();
                gsap.delayedCall(X.duration,()=>{
                    resolve();
                })
            }
        )
    }

    clickOff(){
        this.mExamSticker.interactive = false;
        this.mExamSticker.buttonMode  = false;
        this.mDragFlag = false;
    }

    clickOn(){
        this.mExamSticker.interactive = true;
        this.mExamSticker.buttonMode  = true;
        this.alpha=1;
    }

}