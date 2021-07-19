import * as PIXI from 'pixi.js';
import { GameBase } from './GameBase';
import { App } from './App';

export class SceneBase extends PIXI.Container {
    get game(): GameBase | null {
        return App.Handle.currentGame;
    }
    constructor() {
        super();
    }

    start(){
        this.onStart();
    }
    // 씬 준비
    async onInit(){
        await this.game.endLoadingScreen()
        this.start();
    }

    onStart(){
        //
    }
    
    onEnd(){
        //
    }
    
    //메뉴 진입시 일시정지 시작 신호
    onPauseStart(){
        //
    }
    //메뉴 진입시 일시정지 해제 신호
    onPauseEnd(){
        //
    }
    
    // 메뉴등에 의한 강제 종료시 호출
    onForceExit(){
    //
    }
    onAppMessage(argument: any){
        //
    }
}
