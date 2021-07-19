import { App } from "../../Core";
import { GameBase } from "../../Core";
import { Intro,Activity,Outro } from "./Scene";
import { GameStartArgument } from "./Define";

import Axios from 'axios';
import Util from '@/Util'

import { LevelData } from './Define';
import levelData from "./levelData"
import { ParentSetupModule } from '@/store/ParentSetup';

export default class Game extends GameBase {
	private mSoundList: Array<string>;
	get soundList(): Array<string>{ return this.mSoundList; }

	private mLevelData: LevelData;
    get levelData(): LevelData{
        return this.mLevelData;
    }

	constructor() {
		super("touch");
	}

	async onStartGame() {
		await this.startLoadingScreen()

		//뷰어 리소스 로드
		const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/alphabet/getViewerResource`, {activity:'touch'});
		await this._loadViewerResource( rscViewer.data );
		
		//product 리소스 로드
		const rscProduct = await Axios.post( `${Util.Config.restAPIProd}/alphabet/getProductResource`, {activity:'touch', symbol:App.Handle.appData.symbol.toLowerCase() });
		await this._loadProductResource( rscProduct.data );

		// const conf = await Axios.post( `${restURL}/alphabet/getTouchData`, {symbol:App.Handle.appData.symbol.toLowerCase()});
		// await this._loadViewerResource( rscViewer );
		// await this._loadProductResource( conf.data );
		
		this.mSoundList = rscProduct.data.sound.splice(0);
		
		this.mLevelData = levelData[ App.Handle.appData.level-1];
        
		// console.log( this.getResource("touch.json").data )

		// 로딩화면 제거

		this.addScene("intro", new Intro());
		this.addScene("activity", new Activity());
		this.addScene("outro", new Outro());

		this.goScene("intro");
	}

    async onEndGame(){
        console.warn( "AL touch END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
}
