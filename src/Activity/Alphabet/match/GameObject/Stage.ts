import { Block } from './Block';
import { DragBlock } from './DragBlock';

import { App } from '@/Activity/Core';
import { gsap } from 'gsap';


export class Stage extends PIXI.Container{
    //------------------------------
    // singleton
    static sHandle: Stage;
    static get Handle(): Stage{ return Stage.sHandle; }
    //------------------------------

    static debugMode = false;

    // 퀴즈로 나올 심볼(알파벳)
    private mQuizSymbol: Array<string>;
    get quizSymbols(): Array<string>{ return this.mQuizSymbol }
    
    private mSize: PIXI.Point;                  // stage의 사이즈
    private mBlocks: Array< Array<Block> >;     // 블록 컨테이너
    private mDragBlock: DragBlock;              // 드래그 표시 블록
    private mCorrectEffectRoot: PIXI.Container; // 이펙트 root;
    private mCorrectEffects: Array< Array<PIXI.spine.Spine> >; // 맞췄을때의 이펙트

    get dragBlock(): DragBlock{ return this.mDragBlock }

    constructor( levelData: Array<Array<number>>, symbol: string ){
        super();
        Stage.sHandle = this;

        this.interactive = true;
        this.mSize = new PIXI.Point( 1046, 538 );
        
        let otherSymbol = String.fromCharCode( symbol.charCodeAt(0) - 1);
        if( symbol.toLowerCase() == "a" ){
            otherSymbol = 'z'
        }
        otherSymbol = otherSymbol.toLowerCase();

        this.mQuizSymbol = [
            symbol.toUpperCase(),
            symbol.toLowerCase(),
            otherSymbol.toUpperCase(),
            otherSymbol.toLowerCase(),
        ];
        this.mCorrectEffectRoot = new PIXI.Container();
        
        this._createBlocks( levelData );
        this._createDragBlock();        
        this.addChild( this.mCorrectEffectRoot );

        
        // event Binding
        this.on("pointermove",(evt)=>{
            // 드래그 시작
            this.mDragBlock.onDragging( evt.data.global );
        })
        this.on("pointerup",(evt)=>{
            this.mDragBlock.onDragEnd()
        })
        this.on("pointerupoutside",(evt)=>{
            this.mDragBlock.onDragEnd()
        })
        this.on("pointercancel",(evt)=>{
            this.mDragBlock.onDragEnd()
        })
        
        if( Stage.debugMode ){
            // 클릭 영역 시각화
            const debug = new PIXI.Graphics();
            debug.lineStyle(2, 0x00FFFF, 1);
            debug.drawRect(0, 0, this.mSize.x, this.mSize.y);
            this.addChild(debug);

            // 중심 표시
            const debugCenter = new PIXI.Graphics();
            debugCenter.lineStyle(2, 0xFFFF00, 1);
            debugCenter.moveTo( 0, -10 );
            debugCenter.lineTo( 0, 10);
            debugCenter.moveTo( -10, 0 );
            debugCenter.lineTo( 10, 0);
            this.addChild(debugCenter);
        }
    }

    private _createDragBlock(){
        this.mDragBlock = new DragBlock();
        this.mDragBlock.visible = false;
        this.addChild( this.mDragBlock );
    }
    
    private _createBlocks( levelData: Array<Array<number>> ){
        const effectData = App.Handle.currentGame.getResource("match_effect.json").spineData;
        this.mBlocks = [];
        this.mCorrectEffects = [];
        let x = 68;
        let y = 68;
        for( let row=0; row<4; row++ ){
            this.mBlocks[row] = [];
            this.mCorrectEffects[row] = [];
            x = 68;    
            for( let col=0; col<8; col++ ){
                const block = new Block(col, row, 0);
                block.position.set( x,y );
                this.mBlocks[row].push( block );
                this.addChild( block );

                const effect = new PIXI.spine.Spine( effectData );
                effect.visible = false;
                effect.position.set( x,y );
                this.mCorrectEffects[row].push( effect );
                this.mCorrectEffectRoot.addChild( effect );

                x += 131;
            }
            y += 134;
        }

        for( let y=0; y<4; y++){
            for( let x=0; x<8; x++){
                this.mBlocks[y][x].blockCode = levelData[y][x];
            }
        }
    }
    
    //-------------------------------------

    // point를 옵셋으로 반환
    getOffsetPos( pos: PIXI.IPoint ): PIXI.Point{
        const x = pos.x - 68 +(131/2);
        const y = pos.y - 68 +(134/2);

        const result = new PIXI.Point;
        result.x = Math.floor(x / 131);
        result.y = Math.floor(y / 134);

        if( result.x < 0 ) result.x =0;
        if( result.y < 0 ) result.y =0;
        if( result.x > 7 ) result.x =7;
        if( result.y > 3 ) result.y =3;
        
        return result;
    } 

    // offset을 주면 point를 반환
    getBlockPosition( offset: PIXI.IPoint ): PIXI.IPoint{
        return this.mBlocks[offset.y][ offset.x ].position;
    }

    // 블록테이블에서 옵셋에 해당하는 블록을 반환    
    getBlock( offset: PIXI.IPoint ): Block{
        return this.mBlocks[offset.y][offset.x];
    }

    checkAllClear(){
        let chk = true;
        for( const blocklist of this.mBlocks){
            for( const block of blocklist){
                if( block.blockCode!=0) chk = false;
            }
        }
        if( chk == true ){
            //게임끝
            gsap.delayedCall( 1, ()=>{App.Handle.nextGame()});
            
        }
    }

    correctAnimation( offset: PIXI.IPoint ){
        const effect = this.mCorrectEffects[offset.y][offset.x];
        effect.visible = true;
        effect.state.setAnimation( 0, "animation", false);
        gsap.delayedCall( 1, ()=>{
            effect.visible = false;
        })        
    }
}