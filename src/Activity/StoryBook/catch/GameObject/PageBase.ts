import { App } from '../../../Core'
import Game from '../index';
import { Activity } from '../Scene'
import { Background,ButtonSprite } from './';
import { CatchData } from '../Define';
import { Card } from './Card';

export class PageBase extends PIXI.Container{
    protected mButtonSprite: ButtonSprite;
    protected mExampleText: PIXI.Sprite;
    protected mCorrectText: PIXI.Sprite;
    private mData: CatchData
    
    get activity() {  
        return (this.parent as Activity) 
    }
    get catchData(){ return this.mData }
        
    constructor( data: CatchData){
        super();
        this.mData = data;
        
        console.log("bookID=>",data.bookID,"pageNum=>",data.pageNum,"pageType=>",data.pageType)
        this.mButtonSprite = new ButtonSprite(`sc_${data.bookID}_${data.pageNum}_2.png`);
        this.mExampleText = new PIXI.Sprite(App.Handle.currentGame.getProductResource(`sc_${data.bookID}_${data.pageNum}_3.png`).texture);
        this.mExampleText.alpha=0;
        
    }

    // 해당 페이지의 작동을 시작한다.
    startAct(){
        this.mButtonSprite.affordance();
    }
    
    onBackground(){  /** */  }
    onText(){/** */  }
    onCorrectText(){/**/ }
    offDimmed(){/** */}
}