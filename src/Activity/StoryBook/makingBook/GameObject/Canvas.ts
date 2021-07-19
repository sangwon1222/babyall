import { App,Util } from '../../../Core';
import { Rectangle } from 'pixi.js';
import gsap from 'gsap'
import { Sticker } from './Sticker';
import { StickerController } from './StickerController';
import { CompleteButton } from './CompleteButton';

export class Canvas extends PIXI.Container{

    private mCanvas= new PIXI.Sprite(App.Handle.currentGame.getResource(`canvas_bg.png`).texture);
    private mStickerContainer= new PIXI.Container();
    private mTextContainer= new PIXI.Container();

    private mStickerController: StickerController;
    private mCompleteButton = new CompleteButton();

    private mStickerArray: Array<Sticker>

    static _handle: Canvas;
    static get Handle(): Canvas { return Canvas._handle}

    get controller(): StickerController{  return this.mStickerController }

    constructor(){
        super()
        Canvas._handle = this;
        this.addChild(this.mCanvas)

        this.mStickerArray = [];
        this.mStickerController = new StickerController();
        this.addChild( this.mStickerContainer , this.mTextContainer , this.mStickerController );

        this.mCompleteButton = new CompleteButton();
        this.addChild(this.mCompleteButton)
        this.mCompleteButton.position.set(this.width/2,15)

        this.interactive = true;
        this.hitArea = new Rectangle(0,0,1280-300,720)
        
        const text = PIXI.Sprite.from(App.Handle.currentGame.getProductResource(`mb_${App.Handle.appData.bookID}_title.png`).texture)
        this.mTextContainer.addChild( text )
        text.tint = 0x000000;

        this.on("pointerdown",(evt: PIXI.InteractionEvent)=>{
            this.focusOut();   

            const temp = this.mStickerArray.slice(0).reverse();
            for( const sticker of temp ){
                if( sticker.checkSticker( evt ) == true ) { break; }
            }
        })
    }

    focusOut(){
        if( this.mStickerController.visible == true ){ 
            this.mStickerController.hide(); 
        }
    }

    tintCanvas(tint: number){
        this.mCanvas.tint = tint;
    }

    tintText(tint: number , idx: number){
        const text = PIXI.Sprite.from(App.Handle.currentGame.getProductResource(`mb_${App.Handle.appData.bookID}_title.png`).texture)
        this.mTextContainer.removeChildren(  )
        this.mTextContainer.addChild( text )
        text.tint = tint;
        
    }

    makeSticker( textureName: string ){
        const sticker = new Sticker(textureName);
        sticker.position.set( this.width/2 ,this.height/2)
        sticker.anchor.set(0.5)
        sticker.scale.set(0.75)
        this.mStickerContainer.addChild(sticker)
        this.mStickerArray.push(sticker)

        
         if(this.mStickerArray.length < 3 ){
            this.mCompleteButton.changeTexture(false)
         }else{
            if(this.mStickerArray.length ==3 ){ 
                const completeSound = App.Handle.currentGame.getResource(`mb_sfx_4.mp3`).sound;
                completeSound.play();
            }
            this.mCompleteButton.changeTexture(true)
         }
    }

    selectSticker(sticker: Sticker){
        this.mStickerContainer.removeChild(sticker)
        this.mStickerContainer.addChild(sticker)
    }

    deleteSticker( sticker: Sticker ){
        this.mStickerContainer.removeChild(sticker)
        this.mStickerArray.splice(this.mStickerArray.indexOf(sticker),1);
        this.mStickerController.hide();

        if(this.mStickerArray.length < 3 ){ this.mCompleteButton.changeTexture(false) }
    }

        /**캔버스 비우기 기능 */
    // AllDelete(){
    //     this.mStickerContainer.removeChildren();
    //     this.mStickerArray = [];
    //     gsap.to(this.mCompleteButton,{alpha:0,duration:0.2,onComplete:()=>{
    //         this.removeChild(this.mCompleteButton)
    //     }})
    // }
}