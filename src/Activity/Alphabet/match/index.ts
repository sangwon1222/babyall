import * as PIXI from "pixi.js";
import { GameBase, App } from "../../Core";
import { Activity } from "./Scene";

import Util from '@/Util';
import Axios from 'axios';

import levelData from "./levelData"
import { ParentSetupModule } from '@/store/ParentSetup';

// Alphabet Match Game
export default class Game extends GameBase {
    
    private mLevelData: Array<Array<number>>;
    get levelData(): Array<Array<number>>{
        return this.mLevelData;
    }

    constructor() {
        super("match");
    }
    
    async onStartGame() {
        await this.startLoadingScreen()

        //뷰어 리소스 로드
        const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/alphabet/getViewerResource`, {activity:'match'});
        await this._loadViewerResource( rscViewer.data );
        
        // console.log( "Match view resource", rscViewer);
        
        //product 리소스 로드
		const rscProduct = await Axios.post( `${Util.Config.restAPIProd}/alphabet/getProductResource`, {activity:'match', symbol:App.Handle.appData.symbol.toLowerCase() });
		await this._loadProductResource( rscProduct.data );

        const setIDX = Math.floor( Math.random() * levelData[App.Handle.appData.level-1].length );
        console.log( "setIDX", setIDX)
        this.mLevelData = levelData[App.Handle.appData.level-1][setIDX];
        
        this.addScene("activity", new Activity());
        this.goScene("activity");
    }
    async onEndGame(){
        console.warn( "AL match END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
}
