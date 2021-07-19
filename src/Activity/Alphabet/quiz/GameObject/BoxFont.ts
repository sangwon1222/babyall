import { App } from '@/Activity/Core';

export enum FontMode{
    blank,          // 안보이는 상태
    Normal,         // 일반상태
    Line,           // 외곽라인, 몸체투명
    LineSelected,   // 외곽라인, 몸체 하얀색
    GuideLineWrong,
    GuideLineCorrect,
    GuideLineWrongSelected,
    GuideLineCorrectSelected,    
}

export class BoxFont extends PIXI.Container{
    
    private mSymbol: string;
    get symbol(): string{ return this.mSymbol[0] }
    get symbolAll(): string{ return this.mSymbol }

    private mFontMode = FontMode.Line;
    private mIsSelected = false;
    private mSelected = false;
    
    private mBody: PIXI.Sprite;
    private mLine: PIXI.Sprite;
    private mWrongGuide: PIXI.Sprite;
    private mCorrectGuide: PIXI.Sprite;

    get fontMode(): FontMode{ return this.mFontMode }
    set fontMode(v: FontMode){ 
        this.mFontMode = v;
        this._updateModeState(); 
    }
    constructor( symbol: string ){
        super()
        
        this.mSymbol = symbol;

        this.mBody = new PIXI.Sprite();
        this.mLine = new PIXI.Sprite();
        this.mWrongGuide = new PIXI.Sprite();
        this.mCorrectGuide = new PIXI.Sprite();
        this.mBody.anchor.set(0.5);
        this.mLine.anchor.set(0.5);
        this.mWrongGuide.anchor.set(0.5);
        this.mCorrectGuide.anchor.set(0.5);
        this.addChild( this.mBody );
        this.addChild( this.mLine );
        this.addChild( this.mWrongGuide );
        this.addChild( this.mCorrectGuide );

        this.setSymbol( symbol );
        this._updateModeState();
    }

    private _updateModeState(){
        switch( this.mFontMode ){
            case FontMode.blank:
                {
                    this.mBody.visible = false;
                    this.mLine.visible = false;
                    this.mWrongGuide.visible = false;
                    this.mCorrectGuide.visible = false;
                } break;
            case FontMode.Normal:
                {
                    this.mBody.visible = true;
                    this.mBody.tint = 0x0f2951;
                    this.mLine.visible = false;
                    this.mWrongGuide.visible = false;
                    this.mCorrectGuide.visible = false;
                } break;
            case FontMode.Line:
                {
                    this.mBody.visible = false;
                    this.mLine.visible = true;
                    this.mWrongGuide.visible = false;
                    this.mCorrectGuide.visible = false;
                } break;
            case FontMode.LineSelected:
                {
                    this.mBody.visible = true;
                    this.mBody.tint = 0xFFFFFF;
                    this.mLine.visible = true;
                    this.mWrongGuide.visible = false;
                    this.mCorrectGuide.visible = false;
                } break;
            case FontMode.GuideLineWrong:
                {
                    this.mBody.visible = false;
                    this.mLine.visible = false;
                    this.mWrongGuide.visible = true;
                    this.mCorrectGuide.visible = false;
                } break;                
            case FontMode.GuideLineCorrect:
                {
                    this.mBody.visible = false;
                    this.mLine.visible = false;
                    this.mWrongGuide.visible = false;
                    this.mCorrectGuide.visible = true;
                } break; 
            case FontMode.GuideLineWrongSelected:
                {
                    this.mBody.visible = true;
                    this.mBody.tint = 0xFFFFFF;
                    this.mLine.visible = false;
                    this.mWrongGuide.visible = true;
                    this.mCorrectGuide.visible = false;
                } break;                
            case FontMode.GuideLineCorrectSelected:
                {
                    this.mBody.visible = true;
                    this.mBody.tint = 0xFFFFFF;
                    this.mLine.visible = false;
                    this.mWrongGuide.visible = false;
                    this.mCorrectGuide.visible = true;
                } break;                            
        }
    }
    
    setSymbol( symbol: string){
        this.mSymbol = symbol;
        if( this.symbol == this.symbol.toUpperCase() ){
            this.mBody.texture = App.Handle.currentGame.getProductResource(`${this.symbol.toLowerCase()}_body_big.png`).texture
            this.mLine.texture = App.Handle.currentGame.getProductResource(`${this.symbol.toLowerCase()}_line_big.png`).texture
            this.mWrongGuide.texture = App.Handle.currentGame.getProductResource(`${this.symbol.toLowerCase()}_wronganswer_big.png`).texture
            this.mCorrectGuide.texture = App.Handle.currentGame.getProductResource(`${this.symbol.toLowerCase()}_answer_big.png`).texture
        }else{
            this.mBody.texture = App.Handle.currentGame.getProductResource(`${this.symbol.toLowerCase()}_body_small.png`).texture
            this.mLine.texture = App.Handle.currentGame.getProductResource(`${this.symbol.toLowerCase()}_line_small.png`).texture
            this.mWrongGuide.texture = App.Handle.currentGame.getProductResource(`${this.symbol.toLowerCase()}_wronganswer_small.png`).texture
            this.mCorrectGuide.texture = App.Handle.currentGame.getProductResource(`${this.symbol.toLowerCase()}_answer_small.png`).texture
        }
    }
    setMode( mode: FontMode){
        this.mFontMode = mode;
        this._updateModeState();
    }
}
