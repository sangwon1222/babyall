import * as PIXI from "pixi.js";
import { GameBase, App } from "../../Core";
import { Activity } from "./Scene";

import Axios from 'axios';
import Util from '@/Util'

import { LevelData } from './Define';
import levelData from "./levelData"
import { ParentSetupModule } from '@/store/ParentSetup';

// Alphabet Catch Game
export default class Game extends GameBase {
    
    private mLevelData: LevelData;
    get levelData(): LevelData{
        return this.mLevelData;
    }

    constructor() {
        super("catch");
    }
    
    async onStartGame() {
        await this.startLoadingScreen()

        //뷰어 리소스 로드
        const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/alphabet/getViewerResource`, {activity:'catch'});
        await this._loadViewerResource( rscViewer.data );
        
        //product 리소스 로드
        const rscProduct = await Axios.post( `${Util.Config.restAPIProd}/alphabet/getProductResource`, {activity:'catch', symbol:App.Handle.appData.symbol.toLowerCase() });
        await this._loadProductResource( rscProduct.data );
    
        this.mLevelData = levelData[ App.Handle.appData.level-1];
        // this.mLevelData = levelData[ 2 ];
        
        
        
        this.addScene("activity", new Activity() );
        this.goScene("activity");
    }

    async onEndGame(){
        console.warn( "AL catch END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
}
