import { App } from '@/Activity/Core';
import gsap from 'gsap'

export class CardBG extends PIXI.Container{
    
    private mBG: PIXI.Sprite;
    private mCover: PIXI.Sprite;
    
    private mCorrectTexture: PIXI.Texture;
    private mWrongTexture: PIXI.Texture;
    
    private mExternalSlot: PIXI.Container;
    private mIsCorrect: boolean;

    get isCorrect(): boolean{ return this.mIsCorrect }
    set isCorrect( v: boolean ){ this.mIsCorrect = v }

    constructor(qiuzIDX?: number){
        super();
        this.mIsCorrect = false;
        this.mCorrectTexture = App.Handle.currentGame.getViewerResource("sq_box1_2.png").texture;
        this.mWrongTexture = App.Handle.currentGame.getViewerResource("sq_box1_3.png").texture;
        
        if(qiuzIDX==undefined)this.mBG = new PIXI.Sprite(App.Handle.currentGame.getViewerResource("sq_box3.png").texture);
        if(qiuzIDX==4 )this.mBG = new PIXI.Sprite(App.Handle.currentGame.getViewerResource("sq_box1_1.png").texture);
        if(qiuzIDX==5 ){
            this.mBG = new PIXI.Sprite(App.Handle.currentGame.getViewerResource("sq_box2_1.png").texture);
            this.mCorrectTexture = App.Handle.currentGame.getViewerResource("sq_box2_2.png").texture;
            this.mWrongTexture = App.Handle.currentGame.getViewerResource("sq_box2_3.png").texture;
        }
        
        this.mBG.pivot.set( this.mBG.width/2, this.mBG.height/2 );
        this.addChild( this.mBG );

        
        this.mCover = new PIXI.Sprite(
            this.mCorrectTexture
        );
        this.mCover.pivot.set( this.mCover.width/2, this.mCover.height/2 );
        this.addChild( this.mCover );
        this.mCover.visible = false;

        this.visible = false;
        this.interactive = false;
        this.on("pointerdown",(evt)=>{
            this.onClick();
            evt.stopPropagation();
        })

        this.mExternalSlot = new PIXI.Container();
        // this.mExternalSlot.position.set( this.width/2, this.height/2 );
        this.addChild( this.mExternalSlot );

    }

    onClick(){
        //
    }

    // 카드 표시 이미지 추가
    addToSlot( element: PIXI.Container ){
        this.mExternalSlot.addChild( element );
    }

    // 등장 애니메이션
    show( delay = 1 ): Promise<void>{
        return new Promise<void>( (resolve,reject)=>{
            this.visible = true;
            this.scale.set( 0.2 );
            this.alpha = 0;
            gsap.to( this, {alpha:1, duration: 0.2} );
            gsap.to( this.scale, {x:1, y:1, duration: delay, ease:"bounce.out"} )
            .eventCallback("onComplete",()=>{
                resolve()
            })
        });
    }

    showCover(){
        this.mCover.visible = true;
        this.mCover.alpha = 0;
        if( this.mIsCorrect ){
            this.mCover.texture = this.mCorrectTexture;
            gsap.to( this.mCover, { alpha:1, duration: 0.5 } ).yoyo(true).repeat(-1)
        }else{
            this.mCover.texture = this.mWrongTexture;
            gsap.to( this.mCover, { alpha:1, duration: 0.5 } )
            gsap.to( this.mExternalSlot, { alpha:0.5, duration: 0.5 } )
        }
    }

    //선택 대기 중 이미지 애니메이션
    waitingAnimation(){
        gsap.to(this.scale,{x:0.9,y:0.9 ,duration:0.5}).yoyo(true).repeat(1);
    }
}