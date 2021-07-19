import * as PIXI from "pixi.js"
import { gsap } from 'gsap';
import { App } from '@/Activity/Core';

export const config = {
    MarkerRange: 20,
    SegLineColor: 0Xc6881f,
    SegLineWidth: 10,
}

enum MarkerState{
    normal,     // 일반 상태
    selected,   // 일반 선택 상태
}

abstract class MarkerBase extends PIXI.Container{
    private mState: MarkerState;
    private mIsStartMark = false;
    private mChecked = false;

    constructor(){
        super();
    }

    get isStartMark(){ return this.mIsStartMark }
    set isStartMark(v: boolean){ 
        this.mIsStartMark = v
        this.onRefreshDraw();
    }
    get checked(){ return this.mChecked }
    set checked( v: boolean){ this.mChecked = v }

    get markerState(): MarkerState{
        return this.mState;
    }
    set markerState( v: MarkerState ){
        if( this.mState != v){
            this.mState = v;
            this.onRefreshDraw();
        }
    }

    abstract onRefreshDraw(): void;
    abstract clone(): MarkerBase;

    hitTest( globalX: number, globalY: number ): boolean{
        const localPos = this.toLocal( new PIXI.Point(globalX, globalY) );
        const xx = localPos.x;
        const yy = localPos.y;
        const len = xx*xx + yy*yy;
        if( len< (config.MarkerRange*config.MarkerRange) ){
            return true;
        }
        return false;
    }
}

class Marker extends MarkerBase{
    private mDrawing: PIXI.Graphics;
    
    constructor( x=0, y=0 ){
        super();
        this.mDrawing = new PIXI.Graphics();
        this.addChild( this.mDrawing );
        
        this.x = x;
        this.y = y;
        
        this.markerState = MarkerState.normal;
        
    }


    onRefreshDraw(){
        switch( this.markerState ){
            case MarkerState.normal:{
                this.mDrawing.clear();
                if( this.isStartMark) this.mDrawing.lineStyle( 8, 0xFF3300, 0.8, 1 );
                this.mDrawing.beginFill(0xFFFFFF);
                this.mDrawing.drawCircle( 0,0, config.MarkerRange );
                this.mDrawing.endFill();
                gsap.to( this.scale, {x:1, y:1, duration: 0.5} )
            }break;

            case MarkerState.selected:{
                this.mDrawing.clear();
                if( this.isStartMark) this.mDrawing.lineStyle( 8, 0xFF3300, 0.8, 1 );
                this.mDrawing.beginFill(0xFFFFFF);
                this.mDrawing.drawCircle( 0,0, config.MarkerRange );
                this.mDrawing.endFill();
                gsap.to( this.scale, {x: 1.2, y:1.2, duration: 0.5} )
            }break;
        }
    }

    clone(): MarkerBase{
        const clone = new Marker( this.x, this.y );
        return clone;
    }

}

class ImageMarker extends MarkerBase{
    private mDrawing: PIXI.Sprite;
    
    private mTextureNormal: PIXI.Texture;
    private mTextureSelected: PIXI.Texture;

    private mStartMarkerIdleAni: gsap.core.Tween;
    private mDisplayStartMarkerAni = true;  //스타트 마커의 애니표현을 하는가?
    constructor( texNormal: PIXI.Texture, texSelected: PIXI.Texture, x=0, y=0, displayStartMarkerAni = true ){
        super();
        this.mDisplayStartMarkerAni = displayStartMarkerAni;
        this.mTextureNormal = texNormal;
        this.mTextureSelected = texSelected;

        this.mDrawing = new PIXI.Sprite();
        this.mDrawing.anchor.set( 0.5 );
        this.addChild( this.mDrawing );
        
        this.x = x;
        this.y = y;
        
        this.mStartMarkerIdleAni = null;
        this.markerState = MarkerState.normal;
        
    }


    onRefreshDraw(){
        switch( this.markerState ){
            case MarkerState.normal:{
                this.mDrawing.texture = this.mTextureNormal;
                if( this.mDisplayStartMarkerAni ){
                    if( this.isStartMark){
                        if( this.mStartMarkerIdleAni == null) this.mStartMarkerIdleAni = gsap.fromTo( this.scale, {x:1, y:1, duration: 0.5}, {x:1.2, y:1.2} ).repeat(-1).yoyo(true)
                    }else{
                        gsap.to( this.scale, {x:1, y:1, duration: 0.5} )
                    }
                }else{
                    gsap.to( this.scale, {x:1, y:1, duration: 0.5} )
                }                
            }break;

            case MarkerState.selected:{
                const selectSound = App.Handle.currentGame.getResource(`ab_sfx_5.mp3`).sound;
                selectSound.play();
                this.mDrawing.texture = this.mTextureSelected;                
                if( this.mDisplayStartMarkerAni ){
                    if( this.isStartMark){
                        if( this.mStartMarkerIdleAni != null) this.mStartMarkerIdleAni.kill();
                    }
                }
                gsap.to( this.scale, {x: 1.2, y:1.2, duration: 0.5} )
                
            }break;
        }
    }

    clone(): MarkerBase{
        const clone = new ImageMarker( this.mTextureNormal, this.mTextureSelected, this.x, this.y, this.mDisplayStartMarkerAni );
        return clone;
    }
}


class Segment extends PIXI.Graphics{
    
    private mStartMarker: MarkerBase;
    private mEndMarker: MarkerBase;
    private mControlPos: PIXI.Point;
    
    set startMarker( marker: MarkerBase){
        if( marker ){ 
            this.mStartMarker = marker; 
            this._refreshDraw();
        }
    }
    set endMarker( marker: MarkerBase){
        if( marker ){ 
            this.mEndMarker = marker; 
            this._refreshDraw();
        }
    }
    
    get controlPos(): PIXI.Point{ return this.mControlPos }

    constructor( startMarker: MarkerBase, endMarker: MarkerBase ){
        super();
        this.mStartMarker = startMarker;
        this.mEndMarker = endMarker;
        this.mControlPos = new PIXI.Point(0,0);
        this._refreshDraw();
    }

    setCV( x=0, y=0){
        this.mControlPos.set( x,y );
        this._refreshDraw();
    }

    _refreshDraw(){
        this.clear();
        if( this.mStartMarker && this.mEndMarker ){
            this.x = this.mStartMarker.x;
            this.y = this.mStartMarker.y;
            this.beginFill(0xFFFFFF, 0);
            this.lineStyle(config.SegLineWidth, config.SegLineColor );
            this.moveTo( 0, 0 );
            

            this.quadraticCurveTo( 
                this.controlPos.x, 
                this.controlPos.y, 
                this.mEndMarker.x-this.x, 
                this.mEndMarker.y-this.y
            )
            // this.lineTo( 
            //     this.mEndMarker.x-this.x, 
            //     this.mEndMarker.y-this.y
            // )
            
            this.endFill();
        }
    }
}

// 라인 데이터( 마커 컨테이너 )
class Line extends PIXI.Container{
    
    private mMarkerRoot: PIXI.Container;
    private mSegmentRoot: PIXI.Container;

    private mMarkerList: Array<MarkerBase>;
    private mSegmentList: Array<Segment>;
    
    private mCurrentOffset: number;
    
    private mMarkerSource: MarkerBase;  //사용되는 마커 원본( clone되어서 생성된다 )
    
    get markerCount(): number{ return this.mMarkerList.length }
    
    get isCleared(): boolean{
        for( const marker of this.mMarkerList ){
            if( !marker.checked ) return false;
        }
        return true;
    }

    constructor( markerSource: MarkerBase ){
        super();
        this.mMarkerSource = markerSource;
    
        this.mMarkerRoot = new PIXI.Container();
        this.mSegmentRoot = new PIXI.Container();
        this.addChild( this.mSegmentRoot );
        this.addChild( this.mMarkerRoot );
        this.clear();
    }

    clear(){
        this.mMarkerRoot.removeChildren();
        this.mSegmentRoot.removeChildren();
        this.mMarkerList = [];
        this.mSegmentList = [];
        
        const marker = this.mMarkerSource.clone();
        marker.x = 20;
        marker.y = 20;
        marker.isStartMark = true;
        this.mMarkerRoot.addChild( marker );
        this.mMarkerList.push( marker );

        this.mCurrentOffset = 0;
    }

    addMarker( x=0, y=0 ){
        const marker = this.mMarkerSource.clone();
        marker.x = x;
        marker.y = y;
        this.mMarkerRoot.addChild( marker );
        this.mMarkerList.push( marker );
        
        const segment = new Segment( this.mMarkerList[this.mMarkerList.length-2], marker);
        this.mSegmentRoot.addChild( segment );
        this.mSegmentList.push( segment );
    }

    removeMarker( marker: MarkerBase ){
        const idx = this.mMarkerList.indexOf( marker );
        if( idx>0 ){
            this.mMarkerRoot.removeChild( marker );
            this.mMarkerList.splice(idx,1);

            const segIDX = idx-1;
            this.mSegmentRoot.removeChildAt( segIDX );
            this.mSegmentList.splice( segIDX,1);
            if( this.mSegmentList[segIDX] ){
                this.mSegmentList[segIDX].startMarker = this.mMarkerList[idx-1];
            }
            this.refreshDraw();
        }
    }

    getMarkerSegment( marker: MarkerBase ): Segment{
        const idx = this.mMarkerList.indexOf( marker );
        if( idx>=0 ){
            return this.mSegmentList[idx];
        }
        return null;
    }

    refreshDraw(){
        for( const seg of this.mSegmentList ){
            seg._refreshDraw();   
        }
    }
    
    resetCheckState(){
        this.alpha = 1;
        for( const marker of this.mMarkerList ){
            marker.checked = false;
            marker.markerState = MarkerState.normal;
        }
    }

    getHitedMarker( x: number, y: number): MarkerBase{
        for( const marker of this.mMarkerList){
            if( marker.hitTest( x , y ) ){
                return marker;
            }
        }
        return null;
    }

    // 해당 마커가 맞춰야하는 다음번째 마커인가?
    isNextMarker( marker: MarkerBase ): boolean{
        for( const mark of this.mMarkerList ){
            if( mark.checked == false ){
                return marker == mark;
            }
        }
        return true;
    }
    save(){
        const result = [];

        for( let i=0; i<this.mMarkerList.length; i++){
            const marker = this.mMarkerList[i];
            const seg = this.mSegmentList[i];
            if( seg ){
                result.push( {
                    x:parseFloat(marker.x.toFixed(2)),
                    y:parseFloat(marker.y.toFixed(2)),
                    cx:parseFloat(seg.controlPos.x.toFixed(2)),
                    cy:parseFloat(seg.controlPos.y.toFixed(2)),
                } );
            }else{
                result.push( {
                    x:parseFloat(marker.x.toFixed(2)),
                    y:parseFloat(marker.y.toFixed(2)),
                    cx:0,
                    cy:0,
                } );
            }
            
        }
        return result;
    }
    load( data: any){
        this.mMarkerRoot.removeChildren();
        this.mSegmentRoot.removeChildren();
        this.mMarkerList = [];
        this.mSegmentList = [];
        
        for( let i=0; i<data.length; i++){
            const markerinfo = data[i];
            if( i==0 ){
                const marker = this.mMarkerSource.clone()
                marker.x = markerinfo.x
                marker.y = markerinfo.y
                marker.isStartMark = true;
                this.mMarkerRoot.addChild( marker );
                this.mMarkerList.push( marker );
            } else{
                const marker = this.mMarkerSource.clone()
                marker.x = markerinfo.x
                marker.y = markerinfo.y
                
                this.mMarkerRoot.addChild( marker );
                this.mMarkerList.push( marker );
                
                const segMarker = data[i-1];
                const segment = new Segment( this.mMarkerList[this.mMarkerList.length-2], marker);
                segment.controlPos.x = segMarker.cx;
                segment.controlPos.y = segMarker.cy;
                this.mSegmentRoot.addChild( segment );
                this.mSegmentList.push( segment );
            } 
        }
        this.mCurrentOffset = 0;      
        this.refreshDraw();  
    }

    displayWriteAniProc(): Promise<void>{
        return new Promise<void>( (resolve, reject)=>{
            let t = 0;
            let tween: gsap.core.Tween = null;
            for( const marker of this.mMarkerList ){
                tween = gsap.delayedCall(t,()=> marker.markerState = MarkerState.selected )
                t += 0.5;
            }
            gsap.delayedCall(t,()=> resolve() )
        })
    }
}

// 마커 데이터
export class WordMarkerSprite extends PIXI.Container{
    static EVT_Refresh="WordMarkerSprite-refresh"

    private mMarkerLineList: Array< Line >;
    private mCurrentLineIDX: number;
    private mMarkerSource: MarkerBase;  //사용되는 마커 원본( clone되어서 생성된다 )
    
    // 현재 선택 라인번호
    get currentLineIDX(){ return this.mCurrentLineIDX }
    set currentLineIDX( v: number){ 
        this.mCurrentLineIDX = v;
        if( this.mCurrentLineIDX >= this.mMarkerLineList.length ){ 
            this.mCurrentLineIDX = this.mMarkerLineList.length-1 
        }
        this.removeChildren();
        this.addChild( this.mMarkerLineList[ this.mCurrentLineIDX ] );
        // this.emit( MarkerDataEvent.ChangeLineIDX, this.mCurrentLineIDX );
    }

    // 현재 라인의 마커 데이터
    get currentLine(): Line{
        return this.mMarkerLineList[this.mCurrentLineIDX];
    }

    get lineCount(): number{ return this.mMarkerLineList.length }
    
    get isCleared(): boolean{
        for( const line of this.mMarkerLineList ){
            if( !line.isCleared ) return false;
        }
        return true;
    }

    constructor( markerSource: MarkerBase ){
        super();
        this.mMarkerSource = markerSource;
        this.clear();
    }
    
    // 현재 라인에 마커를 추가한다.
    addMarker( x: number, y: number ){
        this.currentLine.addMarker( x,y);
        // this.emit("markerdata", this.mMarkerLineList );
    }

    removeMarker( marker: MarkerBase ){
        this.currentLine.removeMarker( marker );
    }
    getMarkerSegment( marker: MarkerBase ): Segment{
        return this.currentLine.getMarkerSegment( marker );
    }
    refreshDraw(){
        this.currentLine.refreshDraw();
    }
    
    addLine(){
        this.mMarkerLineList.push( new Line( this.mMarkerSource ) );
        // this.emit("markerdata", this.mMarkerLineList );
    }

    removeLine( idx ){
        if( idx>0 && idx<this.mMarkerLineList.length ){
            this.mCurrentLineIDX = idx-1;
            this.mMarkerLineList.splice( idx, 1 );
            this.currentLineIDX = this.mCurrentLineIDX;
        }
        // this.emit("markerdata", this.mMarkerLineList );
    }

    // 모든 라인의 모든 마커의 checkState를 off. 선택라인을 1번으로 설정
    async resetCheckState(){
        for( const line of this.mMarkerLineList ){
            line.resetCheckState();
        }
        this.mCurrentLineIDX = 0;
        this.removeChildren();
        this.addChild( this.mMarkerLineList[ this.mCurrentLineIDX ] );
    }

    clear(){
        this.mMarkerLineList = [];
        this.addLine();
        this.currentLineIDX = 0;
        // this.emit("markerdata", this.mMarkerLineList );

    }

    save(){
        const result = [];
        for( const line of this.mMarkerLineList){
            result.push( line.save() );
        }
        return result;
    }

    load( data: any){
        // console.log( "load", this.mMarkerSource );
        this.removeChildren();
        this.mMarkerLineList = [];
        for( const lineinfo of data ){
            const line = new Line( this.mMarkerSource );
            line.load( lineinfo );
            this.mMarkerLineList.push( line );
        }
        this.currentLineIDX = 0;
        this.emit(WordMarkerSprite.EVT_Refresh);
    }
    
}

//-------------------------------------------------------------
// 사용되는 최종 클래스

// 마커 편집용 스프라이트
export class WordEditSprite extends PIXI.Sprite{
    
    private mIsDowned = false;
    private mWordSprite: WordMarkerSprite;
    
    private mSelectedMarker: MarkerBase;
    
    // 아웃라인 이미지
    private mOutlineImage: PIXI.Sprite;
    
    get wordData(){ return this.mWordSprite }
    
    constructor( outlineTexture: PIXI.Texture ){
        super();
        
        this.mWordSprite = new WordMarkerSprite( new Marker( 0,0 ) );
        
        this.interactive = true;
        
        this.on("pointerdown",(evt)=>{
            if( !this.mIsDowned){
                this.mIsDowned = true;
                const localPos = this.toLocal( evt.data.global );
                
                // console.log( evt.data.originalEvent );
                
                if( evt.data.originalEvent.ctrlKey == true ){
                    this.mWordSprite.addMarker( localPos.x, localPos.y );
                }else if( evt.data.originalEvent.altKey == true ){
                    this.mSelectedMarker = this.getHitedMarker( evt.data.global.x, evt.data.global.y );
                    if( this.mSelectedMarker ){
                        this.mWordSprite.removeMarker( this.mSelectedMarker );
                        this.mSelectedMarker = null;
                    }
                }else{
                    this.mSelectedMarker = this.getHitedMarker( evt.data.global.x, evt.data.global.y );
                    if( this.mSelectedMarker ){
                        this.mSelectedMarker.markerState = MarkerState.selected;
                    }
                }
                
            }
        })

        this.on("pointermove",(evt)=>{
            if( this.mIsDowned){
                const localPos = this.toLocal( evt.data.global );
                if( this.mSelectedMarker && evt.data.originalEvent.shiftKey == true ){
                    const seg = this.mWordSprite.getMarkerSegment( this.mSelectedMarker ); 
                    if( seg ){
                        const cvPos = seg.toLocal( evt.data.global );
                        seg.setCV( cvPos.x, cvPos.y);
                    }
                }else if( this.mSelectedMarker && evt.data.originalEvent.shiftKey == false){
                    this.mSelectedMarker.x = localPos.x;
                    this.mSelectedMarker.y = localPos.y;
                    this.mWordSprite.refreshDraw();
                }
            }
        })

        this.on("pointerup",(evt)=>{
            if( this.mIsDowned){
                this.mIsDowned = false;
                if( this.mSelectedMarker ){
                    this.mSelectedMarker.markerState = MarkerState.normal;
                    this.mSelectedMarker = null;
                }
                
            }
        })
        this.on("pointerupoutside",(evt)=>{
            if( this.mIsDowned){
                this.mIsDowned = false;
                if( this.mSelectedMarker ){
                    this.mSelectedMarker.markerState = MarkerState.normal;
                    this.mSelectedMarker = null;
                }
                
            }
        })
        // this.mMarkerData.on("markerdata",( list )=>{
        //     this.refreshDebugMarker();
        // })
        // this.mMarkerData.on("currentidx",( list )=>{
        //     this.refreshDebugMarker();
        // })

        const gr = new PIXI.Graphics();
        
        this.mOutlineImage = new PIXI.Sprite();
        this.mOutlineImage.texture = outlineTexture;
        
        gr.beginFill( 0xFFFFFF, 0.5 );
        gr.drawRect( 0,0, this.mOutlineImage.width, this.mOutlineImage.height );
        gr.endFill();
        
        this.addChild( gr );
        this.addChild( this.mOutlineImage );
        this.addChild( this.mWordSprite ); 
        
        this.calculateBounds();
    }

    addLine(){
        this.mWordSprite.addLine();
    }
    // 전역 좌표로부터 현재 라인에서 충돌된 마커를 반환
    getHitedMarker( globalX: number, globalY: number): MarkerBase{
        return this.mWordSprite.currentLine.getHitedMarker( globalX, globalY )
    }
    
}

// 블록용 디스플레이
export class WordBlockSprite extends PIXI.Sprite{
    static EVT_LineComplete = "block-line-complete"
    static EVT_WordComplete = "block-word-complete"
    static EVT_WrongSelect = "block-wrong-select"

    private mIsDowned = false;
    private mWordSprite: WordMarkerSprite;
    
    // 아웃라인 이미지
    private mOutlineImage: PIXI.Sprite;
    private mFilledImage: PIXI.Sprite;
    private mSliceImageList: Array<PIXI.Sprite>;
    
    get wordData(){ return this.mWordSprite }
    
    constructor( 
        markerNormal: PIXI.Texture, 
        markerSelected: PIXI.Texture, 
        outlineTexture: PIXI.Texture, 
        filledTexture: PIXI.Texture,
        sliceTexture: Array<PIXI.Texture>
        ){
        super();
        
        // 순차적 진행. 차례대로 클릭하지않으면, 마킹되지않는다.
        this.mWordSprite = new WordMarkerSprite( new ImageMarker( markerNormal, markerSelected, 0,0 ) );
        this.mWordSprite.visible = false;

        this.interactive = true;
        this.mOutlineImage = new PIXI.Sprite(outlineTexture);
        this.mFilledImage = new PIXI.Sprite(filledTexture);
        this.mFilledImage.alpha = 0;
        this.mSliceImageList = [];
        for( const tex of sliceTexture ){
            const spr = new PIXI.Sprite( tex);
            spr.alpha = 0;
            this.mSliceImageList.push( spr );
        }
        
        this.on("pointerdown",(evt)=>{
            if( !this.mIsDowned){
                this.mIsDowned = true;
                const localPos = this.toLocal( evt.data.global );
                const marker = this.getHitedMarker( evt.data.global.x, evt.data.global.y );
                if( marker ) { 
                    // 순차적인 마커를 선택한게 아니라면, 오답 처리를 위한 이벤트 발생
                    if( marker.checked == false && !this.mWordSprite.currentLine.isNextMarker( marker ) ){
                        this.emit(WordBlockSprite.EVT_WrongSelect);
                    }
                }
            }
        })

        this.on("pointermove",(evt)=>{
            if( this.mIsDowned){
                const localPos = this.toLocal( evt.data.global );
                const marker = this.getHitedMarker( evt.data.global.x, evt.data.global.y );
                if( marker ) { 
                    this.onMarkerChecked( marker )

                }                
            }
        })

        this.on("pointerup",(evt)=>{
            if( this.mIsDowned){
                this.mIsDowned = false;
            }
        })
        this.on("pointerupoutside",(evt)=>{
            if( this.mIsDowned){
                this.mIsDowned = false;
                // if( this.mSelectedMarker ){
                //     this.mSelectedMarker.markerState = MarkerState.normal;
                //     this.mSelectedMarker = null;
                // }
            }
        })
                
        // const gr = new PIXI.Graphics();
        // gr.beginFill( 0xFFFFFF, 0.5 );
        // gr.drawRect( 0,0, this.mOutlineImage.width, this.mOutlineImage.height );
        // gr.endFill();
        
        // this.addChild( gr );
        
        this.addChild( this.mOutlineImage );
        for( const slice of this.mSliceImageList ){
            this.addChild( slice );
        }
        this.addChild( this.mFilledImage );
        this.addChild( this.mWordSprite ); 
        
    }

    onMarkerChecked( marker: MarkerBase){
        if( marker ){
            // 해당 마커가 순차적인 마커라면. check처리
            if( this.mWordSprite.currentLine.isNextMarker( marker ) ){
                marker.checked = true;
                marker.markerState = MarkerState.selected;
                // 라인 완성
                if( this.mWordSprite.currentLine.isCleared ){
                    if(  this.mWordSprite.isCleared == false){
                        console.log("currentLineIDX", this.mWordSprite.currentLineIDX);
                        
                        this.interactive = false;
                        
                        // 라인 페이드 아웃
                        this.emit( WordBlockSprite.EVT_LineComplete, {lineIDX:this.mWordSprite.currentLineIDX, lineCount:this.mSliceImageList.length })
                        gsap.to( this.mWordSprite.currentLine, { duration:0.5, alpha:0 })
                        
                        // 조각 그림 페이드인
                        gsap.to( this.mSliceImageList[this.mWordSprite.currentLineIDX ],{ delay: 0.5, duration:0.5, alpha:1} )
                        .eventCallback("onComplete",()=>{
                            this.mIsDowned = false;
                            // 다음 라인 페이드 인
                            this.mWordSprite.currentLineIDX += 1;
                            this.mWordSprite.currentLine.alpha = 0;
                            gsap.to( this.mWordSprite.currentLine, {delay: 0.5, duration:0.5, alpha:1 })
                            .eventCallback("onComplete",()=>{
                                this.interactive = true;
                            })                                
                        })                        
                    }else{
                        // 모든 라인 끝남
                        this.interactive = false;

                        // 조각 그림 페이드인
                        gsap.to( this.mSliceImageList[this.mWordSprite.currentLineIDX ],{ duration:0.5, alpha:1} );
                        
                        // 라인 페이드 아웃
                        gsap.delayedCall( 0.5, ()=>this.emit( WordBlockSprite.EVT_LineComplete, {lineIDX:this.mWordSprite.currentLineIDX, lineCount:this.mSliceImageList.length }))
                        gsap.to( this.mWordSprite.currentLine, {delay: 0.5, duration:0.5, alpha:0 })
                        .eventCallback("onComplete",()=>{
                            // 조각그림 페이드 아웃.
                            for( const spr of this.mSliceImageList ){
                                gsap.to( spr, { duration:1, alpha:0 })
                            }                            
                            gsap.to( this.mFilledImage,{ duration:1, alpha:1} );
                            gsap.to( this.mOutlineImage,{ duration:1, alpha:0} );
                            gsap.delayedCall( 1, ()=>this.emit( WordBlockSprite.EVT_WordComplete ) );                           
                        })
                    }                    
                }
            }  
        }
    }
    addLine(){
        this.mWordSprite.addLine();
    }

    // 전역 좌표로부터 현재 라인에서 충돌된 마커를 반환
    getHitedMarker( globalX: number, globalY: number): MarkerBase{
        return this.mWordSprite.currentLine.getHitedMarker( globalX, globalY )
    }
    
    loadData( data: any){
        this.mOutlineImage.alpha = 1;
        this.mFilledImage.alpha = 0;
        for( const spr of this.mSliceImageList ){
            spr.alpha = 0;
        }

        this.mWordSprite.load( data );
        this.mWordSprite.visible = true;
        
        this.mIsDowned = false;
        this.interactive = true;
    }
    
}

// 퀴즈용 디스플레이
export class WordQuizSprite extends PIXI.Sprite{
    static EVT_LineComplete = "quiz-line-complete"
    static EVT_WordComplete = "quiz-word-complete"
    static EVT_WrongComplete = "quiz-wrong-complete"

    private mCorrectState = true;   //현재 정답 상태인가.
    private mIsDowned = false;
    private mWordSprite: WordMarkerSprite;
    
    // 아웃라인 이미지
    private mOutlineImage: PIXI.Sprite;
    private mFilledImage: PIXI.Sprite;
    private mSliceImageList: Array<PIXI.Sprite>;
    
    get wordData(){ return this.mWordSprite }
    
    constructor( 
        markerNormal: PIXI.Texture, 
        markerSelected: PIXI.Texture, 
        outlineTexture: PIXI.Texture, 
        filledTexture: PIXI.Texture,
        sliceTexture: Array<PIXI.Texture>
        ){
        super();
        
        // 비순차 진행. 차례대로 클릭하지않아도 마킹되지만 잘옷된 순서로 마킹하면, 라인종료후 자동진행을 보여준다.
        this.mWordSprite = new WordMarkerSprite( new ImageMarker( markerNormal, markerSelected, 0,0, false ) );
        this.mWordSprite.visible = false;

        this.interactive = true;
        this.mOutlineImage = new PIXI.Sprite(outlineTexture);
        this.mFilledImage = new PIXI.Sprite(filledTexture);
        this.mFilledImage.alpha = 0;
        this.mSliceImageList = [];
        for( const tex of sliceTexture ){
            const spr = new PIXI.Sprite( tex);
            spr.alpha = 0;
            this.mSliceImageList.push( spr );
        }
        
        this.on("pointerdown",(evt)=>{
            if( !this.mIsDowned){
                this.mIsDowned = true;
                const localPos = this.toLocal( evt.data.global );
                const marker = this.getHitedMarker( evt.data.global.x, evt.data.global.y );
                if( marker ) { 
                    // 순차적인 마커를 선택한게 아니라면, 오답 처리를 위한 이벤트 발생
                    if( marker.checked == false && !this.mWordSprite.currentLine.isNextMarker( marker ) ){
                        this.emit(WordBlockSprite.EVT_WrongSelect);
                    }
                }
            }
        })

        this.on("pointermove",(evt)=>{
            if( this.mIsDowned){
                const localPos = this.toLocal( evt.data.global );
                const marker = this.getHitedMarker( evt.data.global.x, evt.data.global.y );
                if( marker ) { 
                    this.onMarkerChecked( marker )

                }                
            }
        })

        this.on("pointerup",(evt)=>{
            if( this.mIsDowned){
                this.mIsDowned = false;
            }
        })
        this.on("pointerupoutside",(evt)=>{
            if( this.mIsDowned){
                this.mIsDowned = false;
                // if( this.mSelectedMarker ){
                //     this.mSelectedMarker.markerState = MarkerState.normal;
                //     this.mSelectedMarker = null;
                // }
            }
        })
                
        
        
        this.addChild( this.mFilledImage );
        this.addChild( this.mOutlineImage );
        for( const slice of this.mSliceImageList ){
            this.addChild( slice );
        }
        this.addChild( this.mWordSprite ); 
    }

    onMarkerChecked( marker: MarkerBase){
        if( marker ){
                
            // 해당 마커가 순차적인 마커가 아니라면 오답 상태로 전환
            if( marker.checked==false && !this.mWordSprite.currentLine.isNextMarker( marker ) ){
                this.mCorrectState = false;
            }

            marker.checked = true;
            marker.markerState = MarkerState.selected;
            
            // 라인 완성
            if( this.mWordSprite.currentLine.isCleared ){
                
                //현재 오답상태라면, 자동 출력으로 전환
                if( this.mCorrectState == false){
                    //
                    this.interactive = false;
                    this.emit(WordQuizSprite.EVT_WrongComplete);
                    
                }else{
                    if(  this.mWordSprite.isCleared == false){
                        console.log("currentLineIDX", this.mWordSprite.currentLineIDX);
                        
                        this.interactive = false;
                        
                        // 라인 페이드 아웃
                        this.emit( WordQuizSprite.EVT_LineComplete, {lineIDX:this.mWordSprite.currentLineIDX, lineCount:this.mSliceImageList.length })
                        gsap.to( this.mWordSprite.currentLine, { duration:0.5, alpha:0 })
                        
                        // 조각 그림 페이드인
                        gsap.to( this.mSliceImageList[this.mWordSprite.currentLineIDX ],{ delay: 0.5, duration:0.5, alpha:1} )
                        .eventCallback("onComplete",()=>{
                            this.mIsDowned = false;
                            // 다음 라인 페이드 인
                            this.mWordSprite.currentLineIDX += 1;
                            this.mWordSprite.currentLine.alpha = 0;
                            gsap.to( this.mWordSprite.currentLine, {delay: 0.5, duration:0.5, alpha:1 })
                            .eventCallback("onComplete",()=>{
                                this.interactive = true;
                            })                                
                        })                        
                    }else{
                        // 모든 라인 끝남
                        this.interactive = false;
    
                        // 조각 그림 페이드인
                        gsap.to( this.mSliceImageList[this.mWordSprite.currentLineIDX ],{ duration:0.5, alpha:1} );
                        
                        // 라인 페이드 아웃
                        gsap.delayedCall( 0.5, ()=>this.emit( WordQuizSprite.EVT_LineComplete, {lineIDX:this.mWordSprite.currentLineIDX, lineCount:this.mSliceImageList.length }))
                        gsap.to( this.mWordSprite.currentLine, {delay: 0.5, duration:0.5, alpha:0 })
                        .eventCallback("onComplete",()=>{
                            // 조각그림 페이드 아웃.
                            for( const spr of this.mSliceImageList ){
                                gsap.to( spr, { duration:1, alpha:0 })
                            }                            
                            gsap.to( this.mFilledImage,{ duration:1, alpha:1} );
                            gsap.to( this.mOutlineImage,{ duration:1, alpha:0} );
                            gsap.delayedCall( 1, ()=>this.emit( WordQuizSprite.EVT_WordComplete ) );                           
                        })
                    }    
                }
                                
            }
        }
    }
    async displayWriteAniProc(){
        
        this.interactive = false;
        
        // 모든 라인off, 모든 조각 off
        this.mWordSprite.resetCheckState();
        for( const spr of this.mSliceImageList ){
            spr.alpha = 0;
        }        

        for( let i =0; i<this.mWordSprite.lineCount; i++){
            this.mWordSprite.currentLineIDX = i;
            await this.mWordSprite.currentLine.displayWriteAniProc();
            // 해당 라인 조각 표시
            gsap.to( this.mSliceImageList[this.mWordSprite.currentLineIDX ],{ duration:0.5, alpha:1} )
        }
        
        //현재라인( 마지막라인 페이드 아웃)
        gsap.to( this.mWordSprite.currentLine, {duration:0.5, alpha:0 })
        .eventCallback("onComplete",()=>{
            // 조각그림 페이드 아웃.
            for( const spr of this.mSliceImageList ){
                gsap.to( spr, { duration:1, alpha:0 })
            }                            
            gsap.to( this.mFilledImage,{ duration:1, alpha:1} );
            gsap.to( this.mOutlineImage,{ duration:1, alpha:0} );
            gsap.delayedCall( 1, ()=>this.emit( WordQuizSprite.EVT_WordComplete ) );                           
        })
    }
    addLine(){
        this.mWordSprite.addLine();
    }

    // 전역 좌표로부터 현재 라인에서 충돌된 마커를 반환
    getHitedMarker( globalX: number, globalY: number): MarkerBase{
        return this.mWordSprite.currentLine.getHitedMarker( globalX, globalY )
    }
    
    loadData( data: any){
        this.mOutlineImage.alpha = 1;
        this.mFilledImage.alpha = 0;
        for( const spr of this.mSliceImageList ){
            spr.alpha = 0;
        }
        
        this.mWordSprite.load( data );
        
        this.mCorrectState = true;
        this.mWordSprite.visible = true;
        this.mIsDowned = false;
        this.interactive = true;
    }
}

