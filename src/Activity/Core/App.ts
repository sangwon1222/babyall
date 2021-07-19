import * as PIXI from "pixi.js";
window.PIXI = PIXI
import PIXISound from  "pixi-sound";

import { gsap } from 'gsap'
//(window as any)["PIXI"] = PIXI;

import { GameBase } from "./GameBase";
import { ResourceManager } from "./ResourceManager";
import Config from "@/Util/Config";
document.addEventListener("visibilitychange",()=>{
    
    if(document.hidden==false){
        PIXISound.resumeAll();
    }else{
        PIXISound.pauseAll();
    }
})

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace PIXI{
        interface Container {
            setDebug(): void;
        }
        
    }
}

PIXI.Container.prototype.setDebug = function (): void  {
    // const debug = new PIXI.Graphics();
    // console.error( this.getLocalBounds() );
    // this.addChild( debug );

    // const a = ()=>{
    //     // this.calulateBoun
    //     debug.lineStyle( 2,0xFF0000,1 );
    //     debug.drawRect( this._bounds.minX,this._bounds.minY, 175*2 , 166 );
    //     // console.error( this._bounds.minX,this._bounds.minY, 175*2 , 166 );
    //     requestAnimationFrame( a );
    // };
    // a();
};

export class DummyCursor extends PIXI.Graphics{
    constructor(){
        super();
        this.beginFill(0xFF0000)
        this.drawRect(0,0,10,10);
        this.endFill()
        this.interactive = true;
        this.on("pointermove",(evt)=>{
            this.position.set( evt.data.global.x, evt.data.global.y );
        })
    }
}

export class App extends PIXI.Application {
    //-----------------------------------
    // singleton
    private static _handle: App;
    static get Handle(): App { return App._handle }
    //-----------------------------------
    
    private mGames: Array<GameBase>;
    private mCurrentGameIDX: number;
    private mAppData: any;
    private mCategory: string; // 현재 카테고리 alphabet, mypet, storybook
    
    get currentCategory(): string{ return this.mCategory }
    get currentGame(): GameBase | null {
        if (this.mGames[this.mCurrentGameIDX-1] === undefined) {
            return null;
        }
        return this.mGames[this.mCurrentGameIDX-1];
    }

    get appData(): any{ return this.mAppData; }
    
    //------------------------------------------
    /* 스크롤락관련 처리 201103
    constructor(canvas: HTMLCanvasElement, category='alphabet', mobileMode=false) {
        console.log( "mobileMode:",mobileMode )
        // mobileMode=false;
        const w = 1280;
        const h = 720;
        // let w = 1280;
        // let h = 720;
        // if( mobileMode ){
        //     w = 720;
        //     h = 1280;
        // }
        super({
            width: w,
            height: h,
            backgroundColor: 0x000000,
            // backgroundColor: 0x910000,
            transparent: false,
            // resolution: window.devicePixelRatio || 1,
            view: canvas,
        });
        App._handle = this;
        this.mCategory = category;

        // if( mobileMode ){
        //     this.stage.angle = 90;
        //     this.stage.position.set( 720 ,0);
        // }
        this.mGames = [];
        this.mCurrentGameIDX = -1;

        // hack for browser
        (window as any)['app'] = this;
    }
    */
   constructor(canvas: HTMLCanvasElement, category='alphabet', mobileMode=false) {
        super({
            width: 1280,
            height: 720,
            backgroundColor: 0x000000,
            // backgroundColor: 0x910000,
            transparent: false,
            // resolution: window.devicePixelRatio || 1,
            view: canvas,
        });
        App._handle = this;
        this.mCategory = category;

        this.mGames = [];
        this.mCurrentGameIDX = -1;
        
        // hack for browser
        // (window as any)['app'] = this;
    }
    //--------------------------------------
    
    forceExit(){
        if(window['video'])window['video'].pause();
        window['video']=null;
        if(this.currentGame.currentScene!= undefined){
            this.currentGame.currentScene.onForceExit();
        }
        this.exit();
    }
    
    exit(){
        gsap.globalTimeline.clear();
        PIXISound.stopAll();
        this.currentGame.onEndGame();
        
        this.stage.removeChildren();
        this.destroy();  
        this.onCloseApp();
        console.error( "게임을 종료합니다." );
    }
    registGame(game: GameBase) {
        if (game) {
            this.mGames.push( game );
        }
    }
    executeAppMessage(argument: {}) {
        if (this.currentGame) {
            this.currentGame.currentScene.onAppMessage(argument);
        }
    }

    async startApp( appData: any, gameName="" ){
        console.log( "App start ", gameName);
        gsap.globalTimeline.clear()
        PIXISound.stopAll();
        this.mAppData = appData;
        if( gameName == "" ){
            this.mCurrentGameIDX = 0;
        }else{
            this.mCurrentGameIDX = this.getGameIndex( gameName );
        }
        this.nextGame();
    }

    getGameIndex( name: string ): number{
        let gameIDX = -1;
        let idx = 0;
        for( const game of this.mGames ){
            // console.log( name, game.gameName );
            if( game.gameName.toLowerCase() == name.toLowerCase() ){
                gameIDX = idx;
            }
            idx += 1;
        }
        return gameIDX;        
    }

    async goGameByName( name: string ){
        let gameIDX = -1;
        let idx = 0;
        for( const game of this.mGames ){
            // console.log( name, game.gameName );
            if( game.gameName.toLowerCase() == name.toLowerCase() ){
                gameIDX = idx;
            }
            idx += 1;
        }

        if( this.mCurrentGameIDX == gameIDX + 1){
            return;
        }

        if( gameIDX != -1){
            if (this.currentGame) {
                gsap.globalTimeline.clear()
                PIXISound.stopAll();
                
                await this.currentGame.currentScene.onForceExit();
                this.currentGame.clear()
                // await this.currentGame.endGame();
            }
            this.stage.removeChildren();    
            this.mCurrentGameIDX = gameIDX + 1;
            // console.log( idx, this.mGames[gameIDX], this.currentGame  )    
            // console.log( this.currentGame )
            if ( this.currentGame ) {
                console.log("call startGame : ", this.mCurrentGameIDX )
                this.stage.addChild(this.currentGame);
                // this.stage.addChild( new DummyCursor() );
                this.currentGame.clear();
                this.currentGame.onStartGame();
            } 
        }
    }
    
    async nextGame() {
        
        if (this.currentGame) {
            console.log("call endGame : ", this.mCurrentGameIDX )
            await this.currentGame.endGame();
        }
        
        this.stage.removeChildren();
        
        if( this.mCurrentGameIDX == -1 ||  this.mCurrentGameIDX >= this.mGames.length){
            this.exit();  
            return;
        }
        this.mCurrentGameIDX += 1;
        
        console.log( "start game: ", this.mCurrentGameIDX, this.currentGame);
        if ( this.currentGame ) {
            console.log("call startGame : ", this.mCurrentGameIDX )
            this.stage.addChild(this.currentGame);
            // this.stage.addChild( new DummyCursor() );
            this.currentGame.clear();
            this.currentGame.startGame();
        } 
        // else {
        //     throw `해당 게임[${gamename}]을 실행하는데 실패하였습니다`;
        // }
    }

    //--------------------------------
    onCloseApp(){
        //
    }    
}
