import { gsap } from 'gsap'

import { ResourceLoadTable } from '@/Activity/Alphabet/Define';
import { ResourceManager } from '../ResourceManager';
import { App } from '../App';
import { NineSlicePlane } from 'pixi.js';
import { StoryBooksModule } from '@/store/StoryBooks';
import { SystemModule } from '@/store/System';
import { UserModule } from '@/store/UserStore';

function getHowtoPageCount( cate, activity ){
    if( cate == 'alphabet' ){
        //
        if( activity == 'catch' ) return 4;
        if( activity == 'match' ) return 4;
        if( activity == 'touch' ) return 4;
        if( activity == 'block' ) return 4;
        if( activity == 'quiz' ) return 4;
    }
    if( cate == 'storybooks' ){
        if( activity == 'movie' ) return 2;
        if( activity == 'catch' ) return 3;
        if( activity == 'touch' ) return 3;
        if( activity == 'match' ) return 4;
        if( activity == 'finder' ) return 5;
        if( activity == 'quiz' ) return 4;
        if( activity == 'makingbook' ) return 4;
    }
    return 0;
}

export const SBClearTable=[
    false,
    false,
    false,
    false,
    false,
    false,
    false,
]
const TextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 50,
    fontWeight: 'bold',
    fill: '#000000',
});

const SBIconPos=[
    [-303, -157],
    [-450, 52],
    [-160, 185],
    [-30, -27],
    [185, -150],
    [453, 90],
    [265, 198],
]
const SBIconGameName=[
    "movie",
    "catch",
    "touch",
    "match",
    "finder",
    "quiz",
    "makingbook",
]
const SBStarPos=[
    [-360, 238],
    [390, -95],
    [75, 190],
]

const SBRoadPos=[
    [-405, 55],
    [10, 59],
    [265, 80],
]

export class Star extends PIXI.Sprite{
    private mTexOn: PIXI.Texture;
    private mTexOff: PIXI.Texture;
    
    private mAniTween: gsap.core.Tween;
    constructor(){
        super();
        this.mTexOn = ResourceManager.Handle.getViewerResource(`common/star.png`).texture;
        this.mTexOff = ResourceManager.Handle.getViewerResource(`common/star_dis.png`).texture;
    
        this.anchor.set(0.5);
        this.texture = this.mTexOff;
        // this.mAniTween = gsap.to( this.scale, { x:1.2, y:1.2, duration: 0.5 }).yoyo(true).repeat(-1);
    }

    showImmediately(){
        if( this.mAniTween ){
            this.mAniTween.kill();
        }
        this.texture = this.mTexOn;        
        this.scale.set( 1 );
        this.mAniTween = gsap.to( this.scale, { x:1.2, y:1.2, duration: 1.5 }).yoyo(true).repeat(-1);            
    }

    close(){
        this.texture = this.mTexOff;        
        if( this.mAniTween ){
            this.mAniTween.kill();
            this.mAniTween = null;
        }
        
    }
}

export class Icon extends PIXI.Container{
    private mTexOn: PIXI.Texture;
    private mTexOff: PIXI.Texture;
    
    private mTexTitleOn: PIXI.Texture;
    private mTexTitleOff: PIXI.Texture;
    
    private mIconImageSet: PIXI.Container;
    private mIconImage: PIXI.Sprite;
    private mIconEffect: PIXI.spine.Spine;
    private mTitle: PIXI.Sprite;
    private mAniTween: gsap.core.Tween;
    constructor( idx: number){
        super(  );
        this.mTexOn = ResourceManager.Handle.getViewerResource(`common/icon_0${idx}.png`).texture;
        this.mTexOff = ResourceManager.Handle.getViewerResource(`common/icon_dis0${idx}.png`).texture;
        
        this.mTexTitleOn = ResourceManager.Handle.getViewerResource(`common/title_0${idx}.png`).texture;
        this.mTexTitleOff = ResourceManager.Handle.getViewerResource(`common/title_dis0${idx}.png`).texture;
    
        this.mIconImageSet = new PIXI.Container();
        this.addChild( this.mIconImageSet );

        this.mIconEffect = new PIXI.spine.Spine( ResourceManager.Handle.getViewerResource(`common/common_map_light.json`).spineData)
        this.mIconEffect.visible = false;
        this.mIconEffect.state.setAnimation( 0, 'animation', true );
        this.mIconImageSet.addChild( this.mIconEffect );
        
        this.mIconImage = new PIXI.Sprite( this.mTexOff );
        this.mIconImage.anchor.set(0.5);
        this.mIconImageSet.addChild( this.mIconImage );

        
        this.mTitle = new PIXI.Sprite( this.mTexTitleOff );
        this.mTitle.anchor.set(0.5);
        this.mTitle.y = 80;
        this.addChild( this.mTitle );

        this.interactive = true;
        this.buttonMode = true;
        this.on("pointertap",( evt: PIXI.InteractionEvent)=>{
            if( this.mIconImage.texture == this.mTexOn ){
                if( SBIconGameName[idx-1].toLowerCase() == App.Handle.currentGame.gameName.toLowerCase() ){
                    this.emit("cancel");
                }else{
                    App.Handle.goGameByName( SBIconGameName[idx-1] );
                }
                evt.stopPropagation();
            }
        })
        // gsap.to( this.mIconImageSet.scale, { x:1.2, y:1.2, duration: 0.5 }).yoyo(true).repeat(-1);
    }
    
    select( flag: boolean ){
        if( flag ){
            this.mAniTween = gsap.to( this.mIconImageSet.scale, { x:1.2, y:1.2, duration: 0.5 }).yoyo(true).repeat(-1);
        }else{
            if( this.mAniTween ){
                this.mAniTween.kill();
                this.mAniTween = null;
            }
        }
    }
    showImmediately(){
        this.mIconImage.texture = this.mTexOn;
        this.mTitle.texture = this.mTexTitleOn;
        this.mIconEffect.visible = true;
        this.scale.set( 1 );            
    }

    close(){
        this.mIconImage.texture = this.mTexOff;
        this.mTitle.texture = this.mTexTitleOff;
        this.mIconEffect.visible = false;
    }
}

export class Road extends PIXI.Sprite{
    private mTexOn: PIXI.Texture;
    private mTexOff: PIXI.Texture;
    constructor( idx: number){
        super();
        this.mTexOn = ResourceManager.Handle.getViewerResource(`common/road_0${idx}.png`).texture;
        this.mTexOff = ResourceManager.Handle.getViewerResource(`common/road_dis0${idx}.png`).texture;
        this.anchor.set(0.5);
        this.texture = this.mTexOff;
    }

    showImmediately(){
        this.texture = this.mTexOn;
        this.scale.set( 1 );
    }

    close(){
        this.texture = this.mTexOff;
    }
}

export class SBCursor extends PIXI.Container{
    private mImage: PIXI.Sprite;
    constructor(){
        super();
        this.mImage = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/position.png").texture)
        this.addChild( this.mImage );
        this.mImage.anchor.set( 0.5, 1 );
        gsap.to(this.mImage, {y:-10, duration: 1}).yoyo(true).repeat(-1)
        this.visible = false;
        
    }
    show( icon: Icon ){
        this.visible = true;
        this.position.set( icon.x, icon.y - 50);
    }
}

export class StoryBookMap extends PIXI.Container{
    private mBG: PIXI.Sprite;
    private mIcons: Array<Icon>;
    private mStar: Array<Star>;
    private mRoad: Array<Road>;
    private mSBCursor: SBCursor;

    private mAniTween: gsap.core.Tween;

    constructor(){
        super();

        this.mBG = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/story_books_bg.png").texture )
        this.mBG.anchor.set( 0.5 );
        this.mBG.interactive = true;
        this.addChild( this.mBG );

        this.mRoad = [];
        for( let i=0; i<3; i++){
            const spr = new Road( i+1 );
            spr.anchor.set(0.5);
            spr.position.set( SBRoadPos[i][0], SBRoadPos[i][1] );
            this.addChild( spr );            
            this.mRoad.push( spr );
        }

        this.mIcons = [];
        for( let i=0; i<7; i++){
            const spr = new Icon( i+1 );
            spr.on("cancel", ()=>{
                this.emit("cancel");
            } );
            spr.position.set( SBIconPos[i][0], SBIconPos[i][1] );
            this.addChild( spr );  
            this.mIcons.push( spr );          
        }
        
        this.mStar = [];
        for( let i=0; i<3; i++){
            const spr = new Star()
            spr.position.set( SBStarPos[i][0], SBStarPos[i][1] );
            this.addChild( spr );            
            this.mStar.push( spr );          
        }
        
        this.mSBCursor = new SBCursor();
        this.addChild( this.mSBCursor );

        this.position.set( 690, 360);
        
        // let idx = 0;
        // this.interactive = true;
        // this.on("pointerup",()=>{
        //     if( idx>6){
        //         idx = 0;
        //         for( const icon of this.mIcons ){
        //             icon.close();
        //         }
        //         for( const road of this.mRoad ){
        //             road.close();
        //         }
        //         for( const star of this.mStar ){
        //             star.close();
        //         }
        //     }

        //     this.clearSBActivity( idx ) 
        //     idx += 1;
            
        // })
        this.visible = false;

        // for( const icon of this.mIcons ){
        //     icon.showImmediately();
        // }
        // for( const road of this.mRoad ){
        //     road.showImmediately();
        // }
        // for( const star of this.mStar ){
        //     star.showImmediately();
        // }

        // this.clearSBActivity( 0 ) 
            
    }
    // async clearSBActivity( idx: number ){
    //     if( idx > 6) idx = 0;

    //     await this.mIcons[idx].showImmediately();
    //     let idx_ =0;
    //     for( const icon of this.mIcons ){
    //         if( icon.visible == false){
    //             this.mSBCursor.show( this.mIcons[idx_] );
    //             break;
    //         }
    //         idx_ += 1;
    //     }
    //     if( idx >= 1){
    //         this.mRoad[0].showImmediately();
    //         await this.mStar[0].showImmediately();
    //     }
    //     if( idx >= 4){
    //         this.mRoad[1].showImmediately();
    //         await this.mStar[1].showImmediately();
    //     }
    //     if( idx >= 6){
    //         this.mRoad[2].showImmediately();
    //         await this.mStar[2].showImmediately();
    //     }

        
    // }
    async show(){
        if( this.visible == true) return;
        // if( StoryBooksModule.finishResultData == null){
            // TODO : 이후에 단일권정보만 요청하여 갱신한다.
            // await StoryBooksModule.getFinishActivityCount( App.Handle.appData.bookID );
            let clpCnt = 0;

            if( SystemModule.isDemoMode === false) {
                await StoryBooksModule.getFinishResultInfoData();
                if(StoryBooksModule.finishResultData[App.Handle.appData.bookID].cpltAcvtCnt===undefined)StoryBooksModule.finishResultData[App.Handle.appData.bookID].cpltAcvtCnt=0;
                console.log("-->", StoryBooksModule.finishResultData[App.Handle.appData.bookID].cpltAcvtCnt );
                clpCnt = StoryBooksModule.finishResultData[App.Handle.appData.bookID].cpltAcvtCnt;
            }else{
                clpCnt = 7;
            }
        // }
        // console.log( StoryBooksModule.finishResultData[App.Handle.appData.bookID] );
        
        
        for( let i=0; i<SBClearTable.length; i++){
            SBClearTable[i] = i<clpCnt;
        }
        //현재 클리어정보에 따라서 아이콘 표시 처리
        for( let i=0; i< SBClearTable.length; i++){
            if( SBClearTable[i] ){
                this.mIcons[i].showImmediately();
                this.mIcons[i].select( false );
            }
        }
        const currentActivityName = App.Handle.currentGame.gameName;
        if( currentActivityName == "movie") {
            this.mSBCursor.show( this.mIcons[0] );
            this.mIcons[0].showImmediately();
            this.mIcons[0].select( true )
        }
        else if( currentActivityName == "catch"){
            this.mSBCursor.show( this.mIcons[1] );
            this.mIcons[1].showImmediately();
            this.mIcons[1].select( true )
        }
        else if( currentActivityName == "touch"){
            this.mSBCursor.show( this.mIcons[2] );
            this.mIcons[2].showImmediately();
            this.mIcons[2].select( true )
        }
        else if( currentActivityName == "match"){
            this.mSBCursor.show( this.mIcons[3] );
            this.mIcons[3].showImmediately();
            this.mIcons[3].select( true )
        }
        else if( currentActivityName == "finder"){
            this.mSBCursor.show( this.mIcons[4] );
            this.mIcons[4].showImmediately();
            this.mIcons[4].select( true )
        }
        else if( currentActivityName == "quiz"){
            this.mSBCursor.show( this.mIcons[5] );
            this.mIcons[5].showImmediately();
            this.mIcons[5].select( true )
        }
        else if( currentActivityName == "makingbook"){
            this.mSBCursor.show( this.mIcons[6] );
            this.mIcons[6].showImmediately();
            this.mIcons[6].select( true )
        }
        console.log("->SBClearTable",SBClearTable)
        for(let i=0;i<UserModule.howtoData[App.Handle.currentCategory].length;i++){
            UserModule.howtoData[App.Handle.currentCategory][i] = SBClearTable[i];
        }
        console.log("->howtoData",UserModule.howtoData[App.Handle.currentCategory])
        
        if( SBClearTable[0] && SBClearTable[1] ){
            this.mRoad[0].showImmediately();
            this.mStar[0].showImmediately();
        }
        if( SBClearTable[0] && SBClearTable[1]&&SBClearTable[2] && SBClearTable[3] && SBClearTable[4] ){
            this.mRoad[1].showImmediately();
            this.mStar[1].showImmediately();
        }
        if( SBClearTable[0] && SBClearTable[1]&&SBClearTable[2] && SBClearTable[3] && SBClearTable[4] && SBClearTable[5] && SBClearTable[6] ){
            this.mRoad[2].showImmediately();
            this.mStar[2].showImmediately();
        }
        this.visible = true;
        this.alpha = 0;
        if( this.mAniTween ){
            this.mAniTween.kill()
            this.mAniTween = null;
        }
        this.mAniTween = gsap.to(this, {alpha:1,duration: 0.2 } );
    }

    close(){
        if( this.visible == false ) return;
        this.alpha = 1;
        if( this.mAniTween ){
            this.mAniTween.kill()
            this.mAniTween = null;
        }
        this.mAniTween = gsap.to(this, {alpha:0,duration: 0.5 } )
        .eventCallback("onComplete",()=>{
            this.visible = false;
        })
    }
}
export class MenuButtonGroup extends PIXI.Container{
    private mHowtoButton: PIXI.Sprite
    private mQuitButton: PIXI.Sprite;

    constructor(){
        super();
        this.mHowtoButton = new PIXI.Sprite( 
            ResourceManager.Handle.getViewerResource("common/btn_howto.png").texture
        );
        this.mHowtoButton.buttonMode = true;
        this.mHowtoButton.anchor.set( 0.5 );
        this.mHowtoButton.position.set( 0, 0 );
        this.mHowtoButton.on("pointertap",( evt: PIXI.InteractionEvent )=>{
            
            if(  this.mQuitButton.interactive == true ){
                this.onShowHowto();
                evt.stopPropagation();
            }
        })

        this.mQuitButton = new PIXI.Sprite( 
            ResourceManager.Handle.getViewerResource("common/btn_quit.png").texture
        );
        this.mQuitButton.buttonMode = true;
        this.mQuitButton.anchor.set( 0.5 );
        this.mQuitButton.position.set( 0, 0 );
        this.mQuitButton.on("pointertap",( evt: PIXI.InteractionEvent )=>{
            if(  this.mQuitButton.interactive == true ){
                this.onShowQuit();
                evt.stopPropagation();
            }
        })

        this.addChild( this.mQuitButton );
        this.addChild( this.mHowtoButton );
        
    }

    show(): Promise<void>{
        return new Promise<void>( (resolve, reject)=>{
            this.mHowtoButton.y = 0;
            this.mQuitButton.visible = false;
            gsap.to( this.mHowtoButton, { y: 100, duration: 0.2} )
            gsap.delayedCall( 0.2, ()=>{
                this.mQuitButton.visible = true;
                this.mQuitButton.y = 100;
            })
            gsap.to( this.mQuitButton, { delay:0.2, y: 200, duration: 0.5} )
            .eventCallback("onComplete",()=>{
                this.mHowtoButton.interactive = true;
                this.mQuitButton.interactive = true;
                resolve();
            })
        })
    }
    close(): Promise<void>{
        return new Promise<void>( (resolve, reject)=>{
            this.interactive = false;
            this.mHowtoButton.interactive = false;
            this.mQuitButton.interactive = false;                
            gsap.to( this.mQuitButton, { y: 100, duration: 0.2} )
            gsap.delayedCall( 0.2, ()=>{
                this.mQuitButton.visible = false;
            })            
            gsap.to( this.mHowtoButton, { delay:0.2, y: 0, duration: 0.2} )
            .eventCallback("onComplete",()=>{
                resolve();
            })
        })
    }

    onShowQuit(){
        //
    }
    onShowHowto(){
        //
    }
}


export class HowtoPopup extends PIXI.Container{
    private mBG: PIXI.Sprite;
    
    private mPageContainer: PIXI.Container;
    private mPageAnchor: PIXI.Container;
    private mCurrentPageIDX = 0;
    private mPageCount = 0;

    private mPagenationAnchor: PIXI.Container;
    private mPagenations: Array<PIXI.Sprite>;
    
    constructor(){
        super();
        this.mBG = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/howto_bg.png").texture );
        // this.mBG.width = 1117;
        // this.mBG.height = 670;
        this.mBG.pivot.set( 1117/2, 670/2);
        this.addChild( this.mBG );
        
        this.mPageContainer = new PIXI.Container();
        this.mPageContainer.x = -500;
        this.mPageContainer.y = -250;
        this.addChild( this.mPageContainer );
        const gr = new PIXI.Graphics();
        gr.beginFill( 0xcccccc, 0.5 );
        gr.drawRect( 0,0, 1002, 510 )
        gr.endFill();
        this.mPageContainer.mask = gr;
        this.mPageContainer.addChild( gr );
        
        const scrollLeftButton = new PIXI.Graphics();
        scrollLeftButton.beginFill( 0xcccccc );
        scrollLeftButton.drawRect( 0,0, 481, 503 )
        scrollLeftButton.endFill();
        scrollLeftButton.alpha = 0;
        scrollLeftButton.interactive = true;
        scrollLeftButton.buttonMode = true;
        scrollLeftButton.on("pointerdown",()=>this.scrollLeft() )

        const scrollRightButton = new PIXI.Graphics();
        scrollRightButton.beginFill( 0xcccccc );
        scrollRightButton.drawRect( 0,0, 481, 503 )
        scrollRightButton.endFill();
        scrollRightButton.x = 481+40;
        scrollRightButton.alpha = 0;
        scrollRightButton.interactive = true;
        scrollRightButton.buttonMode = true;
        scrollRightButton.on("pointerdown",()=>this.scrollRight() )
        
        this.mPageContainer.addChild( scrollLeftButton );
        this.mPageContainer.addChild( scrollRightButton );
        
        this.mPageAnchor = new PIXI.Container();
        this.mPageContainer.addChild( this.mPageAnchor );

        this.mPagenationAnchor = new PIXI.Container();
        this.addChild( this.mPagenationAnchor );


        //this.position.set( 700, 370);
        this.position.set( 670, 355);
        

        this.interactive = true;
        this.buttonMode = true;
        this.on("pointertap",(evt)=>{
            evt.stopPropagation();
            //this.close()
        })

        this.visible = false;
        
    }

    scrollRight(){
        //
        
        if( this.mCurrentPageIDX < this.mPageCount-1){
            this.mCurrentPageIDX += 1;
            gsap.to(this.mPageAnchor,{ duration:0.5, x: -this.mCurrentPageIDX*521 } )
            
            for( let i=0; i< this.mPagenations.length; i++){
                if( i == this.mCurrentPageIDX){
                    this.mPagenations[i].texture = ResourceManager.Handle.getViewerResource("common/point_blue.png").texture
                    this.mPagenations[i].scale.set( 0.5 );
                    gsap.to(this.mPagenations[i].scale,{ duration:0.5, x:1, y:1 } )
            
                }else{
                    this.mPagenations[i].texture = ResourceManager.Handle.getViewerResource("common/point_gray.png").texture
                }
            }
            
        }
    
        
    }
    scrollLeft(){
        if( this.mCurrentPageIDX > 0){
            this.mCurrentPageIDX -= 1;
            gsap.to(this.mPageAnchor,{ duration:0.5, x: -this.mCurrentPageIDX*521 } )
            for( let i=0; i< this.mPagenations.length; i++){
                if( i == this.mCurrentPageIDX){
                    this.mPagenations[i].texture = ResourceManager.Handle.getViewerResource("common/point_blue.png").texture
                    this.mPagenations[i].scale.set( 0.5 );
                    gsap.to(this.mPagenations[i].scale,{ duration:0.5, x:1, y:1 } )
                }else{
                    this.mPagenations[i].texture = ResourceManager.Handle.getViewerResource("common/point_gray.png").texture
                }
            }
            
        }    
    }
    
    show(){
        if( this.mPageCount ==0 ) return;
        if( this.visible == true) return;
        this.visible = true;
        this.alpha = 0;
        this.scale.set(0);
        gsap.to(this, {alpha:1,duration: 0.5 } )
        gsap.to(this.scale, {x:1,y:1, duration: 1, ease:"Bounce.easeOut" } );
        
    }

    //페이지 스프라이트를 만든다.
    initPage(pages: Array<PIXI.Texture> ){
        //
        this.mCurrentPageIDX = 0;
        this.mPageCount = pages.length;
        if( this.mPageCount == 0 ) return;

        let offset = 0;
        this.mPageAnchor.removeChildren();
        this.mPagenationAnchor.removeChildren();
        this.mPagenations = [];
        let idx = 0;
        for( const pageTexure of pages ){
            const spr = new PIXI.Sprite(pageTexure);
            spr.x = offset;
            
            const pagenation = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/point_gray.png").texture);
            pagenation.anchor.set( 0.5 );
            pagenation.x = idx * 30; 
            this.mPagenations.push( pagenation );
            this.mPageAnchor.addChild( spr );
            this.mPagenationAnchor.addChild( pagenation );
            if( pageTexure != pages[pages.length-1]){
                offset+= spr.width + 40;
                const line = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/line.png").texture )
                line.x = offset - 20;
                this.mPageAnchor.addChild( line );   
            }
            idx += 1;
        } 
        this.mPagenations[0].texture = ResourceManager.Handle.getViewerResource("common/point_blue.png").texture
        this.mPagenationAnchor.y = 270;
        this.mPagenationAnchor.x = -( this.mPagenationAnchor.getLocalBounds().width - this.mPagenationAnchor.getLocalBounds().x )/2 + 15;
        
    }

    close(){
        if( this.visible == false) return;
        this.alpha = 1;
        gsap.to(this, {alpha:0,duration: 0.2 } )
        .eventCallback("onComplete",()=>{
            gsap.to(this.mPageAnchor,{ duration:0.5, x: 0 } )
            this.visible = false;
        })
    }
}

export class QuitPopup extends PIXI.Container{
    private mDimmed: PIXI.Graphics;
    private mContainer: PIXI.Container;

    private mBG: PIXI.NineSlicePlane;
    private mText: PIXI.Text;
    private mBI: PIXI.Sprite;
    private mOKButton: PIXI.Sprite;
    private mCloseButton: PIXI.Sprite;

    constructor(){
        super();

        this.mDimmed = new PIXI.Graphics();
        this.mDimmed.beginFill( 0x000000, 0.3 );
        this.mDimmed.drawRect( 0, 0, 1280, 720 );
        this.mDimmed.endFill();
        this.mDimmed.interactive = true;
        this.addChild( this.mDimmed );

        this.mContainer = new PIXI.Container();
        this.addChild( this.mContainer );
        
        this.mBG = new NineSlicePlane(
            ResourceManager.Handle.getViewerResource("common/img_popupbox.png").texture,
            60, 120, 60, 120
        );

        this.mBG.width = 466;
        this.mBG.height = 360;
        this.mBG.interactive = true;
        this.mBG.pivot.set( 233, 180 );
        this.mContainer.addChild( this.mBG );

        this.mText = new PIXI.Text( "Quit?" , TextStyle );
        this.mText.anchor.set( 0.5 );
        this.mText.position.set( 10, -5 );
        this.mContainer.addChild( this.mText );

        this.mBI = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/bi.png").texture )
        this.mBI.anchor.set( 0.5 );
        this.mBI.position.set( 0, -130 );
        this.mBI.scale.set( 0.6 );
        this.mContainer.addChild( this.mBI );
        
        this.mOKButton = new PIXI.Sprite(ResourceManager.Handle.getViewerResource("common/btn_quit_o.png").texture)
        this.mOKButton.anchor.set(0.5)
        this.mOKButton.position.set( -97, 126 );
        this.mOKButton.interactive = true;
        this.mOKButton.buttonMode = true;
        this.mCloseButton = new PIXI.Sprite(ResourceManager.Handle.getViewerResource("common/btn_quit_x.png").texture)
        this.mCloseButton.anchor.set(0.5)
        this.mCloseButton.position.set( 97, 126 );
        this.mCloseButton.interactive = true;
        this.mCloseButton.buttonMode = true;
        this.mContainer.addChild( this.mOKButton );
        this.mContainer.addChild( this.mCloseButton );
        
        this.mContainer.position.set( 1280/2, 720/2);

        this.mOKButton.on("pointertap", async ()=>{
            this.mOKButton.interactive = false;
            this.mCloseButton.interactive = false;
            await App.Handle.forceExit();         
        })
        this.mCloseButton.on("pointertap",()=>{
            this.mOKButton.interactive = false;
            this.mCloseButton.interactive = false;
            this.close();
        })
                
        this.visible = false;
    }

    show(){
        if( this.visible == true) return;
        this.mOKButton.interactive = true;
        this.mCloseButton.interactive = true;
    
        this.visible = true;
        this.alpha = 0;
        this.mContainer.scale.set(0);
        gsap.to(this, {alpha:1,duration: 0.5 } );
        gsap.to(this.mContainer.scale, {x:1,y:1, duration: 1, ease:"Bounce.easeOut" } );
    }

    close(){
        if( this.visible == false) return;
        
        this.alpha = 1;
        gsap.to(this, {alpha:0,duration: 0.2 } )
        .eventCallback("onComplete",()=>{
            this.visible = false;
        })
    }
}

export class MenuScreen extends PIXI.Container{
    private mContainer: PIXI.Container;
    private mMenuButton: PIXI.Sprite;

    private mMenuButtonGroup: MenuButtonGroup;
    private mQuitPopup: QuitPopup;
    private mHowtoPopup: HowtoPopup;
    private mStoryBookMap: StoryBookMap;

    private mCloseFlag = true;

    get howToPopup(): HowtoPopup{ return this.mHowtoPopup }

    get closeFlag(): boolean{ return this.mCloseFlag }

    constructor(){
        super();
    }
    
    async init(){
        const list: ResourceLoadTable ={
            image:[
                'btn_menu.png',
                'btn_menu_gray.png',
                'btn_howto.png',
                'img_popupbox.png',
                'bi.png',
                'btn_quit_o.png',
                'btn_quit_x.png',
                // 'img_howto_box.png',
                // 'img_howto_title.png',
                'howto_bg.png',
                'line.png',
                'point_blue.png',
                'point_gray.png',

                'btn_quit.png',
                'icon_01.png',
                'icon_02.png',
                'icon_03.png',
                'icon_04.png',
                'icon_05.png',
                'icon_06.png',
                'icon_07.png',
                'icon_dis01.png',
                'icon_dis02.png',
                'icon_dis03.png',
                'icon_dis04.png',
                'icon_dis05.png',
                'icon_dis06.png',
                'icon_dis07.png',
                'title_01.png',
                'title_02.png',
                'title_03.png',
                'title_04.png',
                'title_05.png',
                'title_06.png',
                'title_07.png',
                'title_dis01.png',
                'title_dis02.png',
                'title_dis03.png',
                'title_dis04.png',
                'title_dis05.png',
                'title_dis06.png',
                'title_dis07.png',
                'position.png',
                'road_01.png',
                'road_02.png',
                'road_03.png',
                'road_dis01.png',
                'road_dis02.png',
                'road_dis03.png',
                'star.png',
                'star_dis.png',
                'story_books_bg.png',
            ],
            spine:[
                // "common_eop.json",
                "common_map_light.json",
            ],
            sound:[
                // "1eop_ending.mp3",
                // "2eop_text.mp3",
                // "321go.mp3",
                // "eop_goodjob.mp3",
                // "4eop_gone.mp3",
                // "3eop_nut.mp3"
            ]
        }
        await ResourceManager.Handle.loadViewerResource("common", list)
        
        this.removeChildren();

        this.mContainer = new PIXI.Container();
        this.mContainer.visible = false;
        this.addChild( this.mContainer );

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.6);
        bg.drawRect( 0,0, 1280, 720 );
        bg.endFill();
        bg.interactive = true;
        bg.on("pointerup", async ()=>{
            if(this.mCloseFlag){
                this.mCloseFlag=false;
                await this.close()
            }
        });
        this.mContainer.addChild( bg );
        
        this.mMenuButtonGroup = new MenuButtonGroup();
        this.mMenuButtonGroup.position.set( 50, 50 );
        this.mMenuButtonGroup.onShowQuit=()=>{
            this.mQuitPopup.show();
            this.mHowtoPopup.close();
        }
        this.mMenuButtonGroup.onShowHowto=()=>{
            this.mQuitPopup.close();
            this.mHowtoPopup.show();
        }
        this.mContainer.addChild( this.mMenuButtonGroup );

        this.mMenuButton = new PIXI.Sprite(
            ResourceManager.Handle.getViewerResource("common/btn_menu.png").texture
        );

        this.mMenuButton.interactive = true;
        this.mMenuButton.buttonMode = true;
        this.mMenuButton.anchor.set( 0.5 );
        this.mMenuButton.position.set( 50, 50 );
        this.addChild( this.mMenuButton );
        this.mCloseFlag=true;
        
        this.mMenuButton.on("pointertap",async ( evt: PIXI.InteractionEvent )=>{
            
            if( this.mCloseFlag ){
                this.mCloseFlag = false;
                if( this.mContainer.visible == true ){
                    await this.close();
                }else{
                    await this.show();
                }
            }
            evt.stopPropagation();
        })  
        
        this.mStoryBookMap = new StoryBookMap();
        this.mStoryBookMap.on("cancel",()=>this.close());
        this.addChild( this.mStoryBookMap );
        

        this.mHowtoPopup = new HowtoPopup();
        this.addChild( this.mHowtoPopup );

        this.mQuitPopup = new QuitPopup();
        this.addChild( this.mQuitPopup );
        
    }

    async show(){
        const pageTexture = [];
            const cnt = getHowtoPageCount( App.Handle.currentCategory, App.Handle.currentGame.gameName );
            console.log(App.Handle.currentGame)
            
            for( let i=0; i<cnt; i++){
                pageTexture.push( App.Handle.currentGame.getViewerResource(`howto0${i+1}.png`).texture)
            }
        this.mHowtoPopup.initPage(pageTexture);

        this.mMenuButton.texture = ResourceManager.Handle.getViewerResource("common/btn_menu_gray.png").texture;
        App.Handle.currentGame.currentScene.onPauseStart();

        this.mContainer.visible = true;
        this.mContainer.alpha = 0;
        gsap.to( this.mContainer, { alpha: 1, duration:0.5} )
        .eventCallback( "onComplete", async ()=>{
            if(App.Handle.appData.category == 'storybooks') this.mStoryBookMap.show();    
            await this.mMenuButtonGroup.show();
            this.mCloseFlag = true;
        })
    }

    async close(){
        
        this.mMenuButton.texture = ResourceManager.Handle.getViewerResource("common/btn_menu.png").texture;
        App.Handle.currentGame.currentScene.onPauseEnd();
        if(App.Handle.appData.category == 'storybooks') this.mStoryBookMap.close();
        this.mQuitPopup.close();
        this.mHowtoPopup.close();
        this.mContainer.visible = true;
        this.mContainer.alpha = 1;
        await this.mMenuButtonGroup.close();
        gsap.to( this.mContainer, { alpha: 0, duration:0.5} )
        .eventCallback( "onComplete", ()=>{
            this.mContainer.visible = false;
            this.mCloseFlag = true;
        })
    }
    
    onShow(){
        //
    }
    onClose(){
        //
    }
}