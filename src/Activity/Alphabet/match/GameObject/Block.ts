
import { gsap, TweenMax,Power2,Bounce } from 'gsap'
import { App } from '@/Activity/Core';
import { Stage } from './Stage';

const textstyle = new PIXI.TextStyle({
    fontFamily: "minigate",
    fontSize: 90,
    // fontStyle: "italic",
    fontWeight: "bold",
    fill: "#ffffff",
    // textBaseline:"center",
    // fill: ["#ffffff", "#00ff99"], // gradient
    // stroke: "#4a1850",
    // strokeThickness: 5,
    // dropShadow: true,
    // dropShadowColor: "#000000",
    // dropShadowBlur: 4,
    // dropShadowAngle: Math.PI / 6,
    // dropShadowDistance: 6,
    // wordWrap: true,
    // wordWrapWidth: 440,
});


export class Block extends PIXI.Sprite{
    static ProcCount=0;             // 떨어짐,매칭 처리를 하고있는 개수    
    private mText: PIXI.Sprite;       // 표시 글씨
    private mSymbol: string;       // 표시 글씨
    // private mText: PIXI.Text;       // 표시 글씨
    
    private mBlockCode: number; // 표시되어야 하는 블록 인덱스
    private mColorIDX: number;  // 색인덱스
    private mTextIDX: number;   // 표시알파벳 인덱스
    
    get colorIDX(): number{ return this.mColorIDX; }
    get symbolIDX(): number{ return this.mTextIDX; }
    get blockCode(): number{ return this.mBlockCode; }
    set blockCode(v: number){ 

        this.visible=!( v == 0 );       
        this.mTextIDX = v%10;
        this.mColorIDX = Math.floor( v/10 );
        this.mBlockCode = v;         
        this._updateSymbol();
    }

    // 배열상의 위치( 옵셋 )
    protected mOffset: PIXI.Point;
    get offset(): PIXI.IPoint{ return this.mOffset }
    
    constructor(offsetX: number, offsetY: number, blockcode=0 ){
        super( App.Handle.currentGame.getResource("match_box.png").texture );
        this.mOffset = new PIXI.Point( offsetX, offsetY);

        this.anchor.set( 0.5 );

        // this.mText = new PIXI.Text( "", textstyle );
        this.mText = new PIXI.Sprite();
        this.mText.anchor.set(0.5,0.5);
        this.mText.scale.set(0.4);
        this.mText.position.set(0, 0);
        this.addChild( this.mText );
        
        this.blockCode = blockcode;
        this.interactive = true;
        this.buttonMode = true;

        this.on("pointerdown",()=>{
            if( Stage.Handle.dragBlock ){ Stage.Handle.dragBlock.onDragStart( this ) }
        })        
    }

    // 블록의 색을 바꾼다. 
    /*
    빨강  #d92828
    주황  #df701e
    노랑  #ecc50a
    초록  #1e994c
    파랑  #0081c8
    남     #22408f
    보라  #87158f 
    진분  #eb008b
    */
    private _updateSymbol(){
        switch( this.mColorIDX ){
            case 1:{ this.mText.tint = 0xd92828; }break;
            case 2:{ this.mText.tint = 0xdf701e; }break;
            case 3:{ this.mText.tint = 0xecc50a; }break;
            case 4:{ this.mText.tint = 0x1e994c; }break;
            case 5:{ this.mText.tint = 0x0081c8; }break;
            case 6:{ this.mText.tint = 0x22408f; }break;
            case 7:{ this.mText.tint = 0x87158f; }break;
            case 8:{ this.mText.tint = 0xeb008b; }break;
        }
        this.mSymbol = Stage.Handle.quizSymbols[ this.mTextIDX ];
        console.log( "symbol:",this.mSymbol);
        if( this.mSymbol.toUpperCase() == this.mSymbol ){
            this.mText.texture = App.Handle.currentGame.getResource(`${this.mSymbol.toLowerCase()}_body_big.png`).texture;
        }else{
            this.mText.texture = App.Handle.currentGame.getResource(`${this.mSymbol.toLowerCase()}_body_small.png`).texture;
        }
        // this.mText.texture = 
        // App.Handle.currentGame.getResource("a_body_big.png").texture
    }

    // 드래그 가능한 블럭이냐?
    canMove(): boolean{
        const stage = Stage.Handle;
        // 위에 블록이 있으면 움직일수 없다.
        if( this.offset.y > 0 ){
            const block = stage.getBlock( new PIXI.Point( this.offset.x, this.offset.y-1 ) );
            if( block.blockCode != 0 ){
                return false;
            }
        }
        return true;
    }
    correctSound(){
            if(this.mSymbol.toLowerCase() == Stage.Handle.quizSymbols[1]){
                const correctSound = App.Handle.currentGame.getResource(`am_sfx_3.mp3`).sound;
                const AlphabetSound = App.Handle.currentGame.getProductResource(`${this.mSymbol.toLowerCase()}.mp3`).sound;
                
                correctSound.play();
                gsap.delayedCall(correctSound.duration-0.5,()=>{
                    AlphabetSound.play();
                })

            }else{
                const correctSound = App.Handle.currentGame.getResource(`am_sfx_3.mp3`).sound;
                correctSound.play();
            }
    }
    correctProc(){

        Block.ProcCount += 1;
        console.warn( "correctProc :",Block.ProcCount);
        // 맞춘 애니 출력
        Stage.Handle.correctAnimation( this.offset );
        this.alpha = 1;
        TweenMax.to( this, 0.5, { alpha:0, }).eventCallback("onComplete",()=>{
            Block.ProcCount -= 1;
            console.warn( "correctProc end",Block.ProcCount);
            
            // 자신의 위에 블록이 있으면 모두 떨어지는 신호보내기.
            let up: Block = null;
            if( this.offset.y > 0 ) up = Stage.Handle.getBlock( new PIXI.Point( this.mOffset.x, this.mOffset.y-1) );
            if( up != null && up.blockCode !=0 && !this._checkCoupleBlock( up ) ){
                this.alpha = 1;
                this.blockCode = 0;
                up.startDrop(1);
                // 위의것이 가장위가 아니면. 그 위의 것들도 떨어지도록함.
                for(let i= up.offset.y; i>=0; i-- ){
                    console.warn( "up check:", i);
                    const block = Stage.Handle.getBlock( new PIXI.Point( this.mOffset.x, i) );    
                    if( block.blockCode != 0 ){
                        block.startDrop(1);
                    }
                }
            }else{
                this.alpha = 1;
                this.blockCode = 0;
                if( Block.ProcCount == 0){
                    //아무것도 매치된게 없다면. dragLock해제
                    Stage.Handle.dragBlock.onDropFinish()
                }
            }
            
            //모든 블록제거됐는지 체크
            Stage.Handle.checkAllClear();
        })
        
    }
    // 현재 위치에서 떨어질수있는 위치를 계산하여 반환
    private _getDropPosition(): PIXI.Point{
        const result = new PIXI.Point( this.mOffset.x, this.mOffset.y );
        const start = this.mOffset.y+1;
        console.log( "DropCheck StartY:", start);
        for( let i=start; i<4; i++ ){
            const block = Stage.Handle.getBlock( new PIXI.Point( this.mOffset.x, i) );
            if( block.blockCode != 0 ){
                result.y = i-1;
                return result;
            }
        }
        result.y = 3;
        return result;
    }

    // 해당 블럭이 자신과 짝이 맞는것인가?
    private _checkCoupleBlock( block: Block): boolean{
        // 색이 같고, 알파벳이 쌍이면 커플
        if( this.colorIDX == block.colorIDX ){
            if( this.symbolIDX == 0 ) return block.symbolIDX ==1; 
            else if( this.symbolIDX == 1 ) return block.symbolIDX ==0; 
            else if( this.symbolIDX == 2 ) return block.symbolIDX ==3; 
            else if( this.symbolIDX == 3 ) return block.symbolIDX ==2; 
        }
        return false;
    }

    //forceDropDelta : 강제 떨어지게할 위치. 0이 아니면, 떨어질위치를 계산하지않는다.
    startDrop( forceDropDelta=0){
        Block.ProcCount += 1;
        console.warn( "Start Drop ",Block.ProcCount);
        // 아래로 검사하여 마지막 블럭인덱스가 0인 옵셋( 최종 떨어질 위치 )를 찾아낸다.
        const targetOffset = new PIXI.Point( this.mOffset.x, this.mOffset.y ); // 드롭한 위치
        console.log( "startOffset:", targetOffset );

        // 해당 블럭의 위치가 마지막 줄이면 떨어지는 애니없이 바로 매치검사
        if( targetOffset.y == 3 ){
            const block = Stage.Handle.getBlock( targetOffset );
            const code = this.blockCode;
            this.blockCode = 0;
            block.blockCode = code;
            block.doMatchProc();
            return;
        }else{
            // 드롭 목적지 옵셋알아내기.
            let dropOffset = new PIXI.Point( this.offset.x, this.offset.y+forceDropDelta );
            if( forceDropDelta == 0){
                dropOffset = this._getDropPosition();
            }
            console.log( "endOffset:", dropOffset );
    
            // 현재위치와 같다면. 바로 매치검사로 넘어간다.
            if( dropOffset.x == targetOffset.x && dropOffset.y == targetOffset.y ){
                console.log("같은위치검사")
                this.doMatchProc();
                return;
            }else{
                console.log("다른위치검사 ",targetOffset, "->", dropOffset );
                // 해당 위치까지 떨어지는 트윈애니. 애니가 끝나면, 해당 위치의 블럭인덱스를 자신과 똑같이 바꿔주고. 
                // 자기 자신의 BlockIndex는 0으로 만들고(없는 블럭) 원래 위치로 돌아간다.
                
                const backupCurrentY = this.y;  // src블록의 y픽셀위치( 원래대로 돌아가기 위함 )
                const code = this.blockCode;    // src블록의 블록코드
                const tpos = Stage.Handle.getBlockPosition( dropOffset );   // 타겟옵셋의 픽셀위치 산출
                TweenMax.to( this, 0.5, {y:tpos.y, ease:Bounce.easeOut } )
                .eventCallback("onComplete",()=>{
                    const block = Stage.Handle.getBlock( dropOffset );
                    this.blockCode = 0;
                    block.blockCode = code;
                    this.y = backupCurrentY; // 원래 자리로 돌아가라..
                    block.doMatchProc();
                    return;
                }); 
            }
        }
    }

    // 상하좌우검사하여 쌍이 맞으면 제거 애니연출
    doMatchProc(){
        console.log( "doMatchProc:", this.offset.x,",",this.offset.y );
        let up: Block = null;
        let left: Block = null;
        let right: Block = null;
        let down: Block = null;
        if( this.mOffset.y > 0 )    up = Stage.Handle.getBlock( new PIXI.Point( this.mOffset.x, this.mOffset.y-1) );
        if( this.mOffset.y+1 < 4 )  down = Stage.Handle.getBlock( new PIXI.Point( this.mOffset.x, this.mOffset.y+1) );
        if( this.mOffset.x > 0 )    left = Stage.Handle.getBlock( new PIXI.Point( this.mOffset.x-1, this.mOffset.y) );
        if( this.mOffset.x+1 < 8 )  right = Stage.Handle.getBlock( new PIXI.Point( this.mOffset.x+1, this.mOffset.y) );

        let correctFlag = false;
        if( up && up.blockCode!=0 && this._checkCoupleBlock( up ) ){
            console.log( "doMatchProc-> correct UP");
            correctFlag = true;
            up.correctProc();
        }
        if( down && down.blockCode!=0 && this._checkCoupleBlock( down )){
            console.log( "doMatchProc-> correct DOWN");
            correctFlag = true;
            down.correctProc();
        }
        if( left && left.blockCode!=0 && this._checkCoupleBlock( left )){
            console.log( "doMatchProc-> correct LEFT");
            correctFlag = true;
            left.correctProc();
        }
        if( right && right.blockCode!=0 && this._checkCoupleBlock( right )){
            console.log( "doMatchProc-> correct RIGHT");
            correctFlag = true;
            right.correctProc();
        }
        if( correctFlag == true ){
            Block.ProcCount -= 1;
            console.log( "doMatchProc-> correct SELF ", Block.ProcCount);
            this.correctProc();
            this.correctSound();
        }else{
            Block.ProcCount -= 1;
            console.warn( "Drop end",Block.ProcCount);
            if( Block.ProcCount == 0){
                //아무것도 매치된게 없다면. dragLock해제
                Stage.Handle.dragBlock.onDropFinish()
            }
        }

    }
}
