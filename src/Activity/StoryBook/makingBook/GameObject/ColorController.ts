import { App } from '../../../Core'


export class ColorController extends PIXI.Container{

    private mColorValue: number;
    private mChecked: PIXI.Sprite;
    private mCheckedDeco: PIXI.Sprite;

    private mUnChecked: PIXI.Sprite;

    private mBackground: PIXI.Sprite;
    private mContents: PIXI.Sprite;
    
    constructor(color: number, texture: string , checkbox?: string, bg?: string){
        super();
       
        this.mChecked = PIXI.Sprite.from(App.Handle.currentGame.getResource(checkbox).texture );
        this.addChild(this.mChecked);
        this.mChecked.alpha=0;

        this.mCheckedDeco = PIXI.Sprite.from(App.Handle.currentGame.getResource(`check_btn.png`).texture);
        this.mCheckedDeco.anchor.set(0.5);
        this.mCheckedDeco.position.set(this.mChecked.width/2,this.mCheckedDeco.height/3)
        
        if(bg){
            this.mUnChecked = new PIXI.Sprite(App.Handle.currentGame.getResource(bg).texture);
            this.addChild(this.mUnChecked)
            this.mContents = new PIXI.Sprite(App.Handle.currentGame.getResource(texture).texture )
            this.addChild(this.mContents)
        }else{
            this.mContents = new PIXI.Sprite(App.Handle.currentGame.getResource(texture).texture )
            this.addChild(this.mContents)
        }
        
        this.mColorValue = color;

        this.buttonMode  = true;
        this.interactive = true;
        this.on( "pointertap",(evt: PIXI.InteractionEvent)=>{
            this.onSelectColor( this.mColorValue );
        })

    }

    reCalcWidth( size: number ){

        if( this.width > this.height ){
            this.scale.set( size/this.width)
        }else{
            this.scale.set( size/this.height)
        }        
    }

    onSelectColor( colorValue: number){
        //
        console.log( "select Color:", colorValue);
    }

    clickButton(text: string){
        if(text =='text') this.mChecked.alpha=1;
        if(text =='paint') {
            this.removeChild(this.mChecked);
            this.addChild(this.mChecked);
            this.mChecked.addChild(this.mCheckedDeco)
            this.mChecked.alpha=1;
        }
    }

    initButton(text: string){
        if(text=='text')  this.mChecked.alpha=0;
        if(text=='paint') this.mChecked.alpha=0;
    }
}