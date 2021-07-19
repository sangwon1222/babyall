

export enum GestureType{
    swipe=0,
    click,
}

// 콜백의 함수 타입 선언
export interface GestureEventCallback{
    (x: number): void;
}

export interface GestureEvent{
    target: HTMLElement;
    callback: GestureEventCallback;
}

export class GestureManager {
    private static _handle: GestureManager = null;
    static get Handle() {
        if( GestureManager._handle == null ) GestureManager._handle = new GestureManager();
        return GestureManager._handle;
    }

    private mMouseDownProc: (evt: MouseEvent) => void;
    private mMouseUpProc: (evt: MouseEvent) => void;
    private mMouseMoveProc: (evt: MouseEvent) => void;

    private mCb: {
        [event: string]: Array<GestureEvent>;
    }

    private mSwipeCheckDelay_msT = 500;
    private mDragStartInfo: { 
        downT: number; 
        x: number; 
        y: number;
         
    };
    private mBackUpX: number;
    get backUpX(): number { return this.mBackUpX}
    set backUpX(v: number) {this.mBackUpX = v}

    private moveFlag = false;
    private mUpTime: number;
    
    constructor(){
        //
        this.mDragStartInfo = { downT:0, x: 0, y: 0 };
        this.mCb = {};
    }

    init(){
        console.warn( "GestureMGR init");
        this.mCb = {};
        this.mBackUpX=0;
        this._eventBind();
    }

    destroy(){
        this.mCb = {};
        this._eventUnbind();
    }
    on(target: HTMLElement , evt: string , cb: GestureEventCallback) {
        // console.warn( "GestureMGR addEvent", evt );
        if( this.mCb[evt] === undefined ) this.mCb[evt] = [];
        this.mCb[evt].push( {
            target: target,
            callback:cb
        });
        
    }
    
    once( target: HTMLElement, evt: string , cb: GestureEventCallback) {
        console.warn( "GestureMGR addEvent", evt );
        if( this.mCb[evt] === undefined ) this.mCb[evt] = [];
        this.mCb[evt].push( {
            target: target,
            callback:cb
        });
        console.log( this.mCb );
    }

    
    private _onMouseDown( evt: MouseEvent ){
        if(evt.button !== 0){ return ;}
        this.mDragStartInfo.downT = Date.now();
        this.mDragStartInfo.x = evt.x ;
        this.mDragStartInfo.y = evt.y;
        this.moveFlag = true;
        // this.mBackUpX=this.mBackUpX + evt.x - this.mDragStartInfo.x;

        if( this.mCb['stop'] !== undefined ){
            for( const event of this.mCb['stop'] ){
                let el = evt.target as HTMLElement;
                while( el ){
                    if( event.target ==  el ){
                        const moveScope = evt.x - this.mDragStartInfo.x
                        event.callback(this.mBackUpX + moveScope);
                        el = null;
                    }else{
                        el = el.parentElement;
                    }                    
                }
            }
        }
    }

    private _onMouseMove( evt: MouseEvent ){
        if(this.moveFlag){
            const elapseT = Date.now() - this.mDragStartInfo.downT;
            // if( elapseT > this.mSwipeCheckDelay_msT ){
                if( this.mCb['drag'] !== undefined ){
                    for( const event of this.mCb['drag'] ){
                        let el = evt.target as HTMLElement;
                        while( el ){
                            if( event.target ==  el ){
                                // evt.stopPropagation();
                                const moveScope = evt.x - this.mDragStartInfo.x
                                event.callback( this.mBackUpX + moveScope );
                                el = null;
                            }else{
                                el = el.parentElement;
                            }                    
                        }
                    }
                // }
            }
        }
    }

    private _onMouseUp( evt: MouseEvent ){
        this.mUpTime = Date.now() - this.mDragStartInfo.downT;

        if( this.mUpTime < this.mSwipeCheckDelay_msT ){
            if( this.mCb['swipe'] !== undefined ){
                for( const event of this.mCb['swipe'] ){
                    let el = evt.target as HTMLElement;
                    while( el ){
                        if( event.target ==  el ){
                            // evt.stopPropagation();
                            event.callback( evt.x - this.mDragStartInfo.x );
                            el = null;
                        }else{
                            el = el.parentElement;
                        }
                    }
                }
            }
        }
        this.moveFlag = false;
        this.mBackUpX  =this.mBackUpX+ (evt.x - this.mDragStartInfo.x)
        // console.log(`POINTER UP X값 => [${this.mBackUpX }]`)
    }

    private _eventBind(){

        this.mMouseDownProc = (evt: MouseEvent)=>{ this._onMouseDown( evt ) }
        this.mMouseMoveProc = (evt: MouseEvent)=>{ this._onMouseMove( evt ) }
        this.mMouseUpProc = (evt: MouseEvent)=>{ this._onMouseUp( evt ) }

        window.addEventListener("mousedown", this.mMouseDownProc )
        window.addEventListener("mousemove", this.mMouseMoveProc)
        window.addEventListener("mouseup",   this.mMouseUpProc )

        // this.mMouseDownProc = (evt: MouseEvent)=>{ this._onMouseDown( evt ) }
        // this.mMouseMoveProc = (evt: MouseEvent)=>{ this._onMouseMove( evt ) }
        // this.mMouseUpProc = (evt: MouseEvent)=>{ this._onMouseUp( evt ) }

        // window.addEventListener("mousedown", this.mMouseDownProc )
        // window.addEventListener("mousemove", this.mMouseMoveProc)
        // window.addEventListener("mouseup",   this.mMouseUpProc )
    }

    private _eventUnbind(){
        window.removeEventListener("mousedown", this.mMouseDownProc )
        window.removeEventListener("mousemove", this.mMouseMoveProc)
        window.removeEventListener("mouseup",   this.mMouseUpProc )
    }
}