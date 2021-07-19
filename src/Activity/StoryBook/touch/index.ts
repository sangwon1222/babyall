import { App } from "../../Core";
import { GameBase } from "../../Core";

import Axios from 'axios';
import Util from '../../../Util'

import { Intro , Activity } from "../touch/Scene";
import { ParentSetupModule } from '@/store/ParentSetup';

export default class Game extends GameBase {
	private mTouchData: any

	get touchData(): any { return this.mTouchData}
	constructor() {
		super("touch");
	}

	async onStartGame() {
		console.log("STORYBOOK TOUCH START")
		
		// 로딩화면 표시
		await this.startLoadingScreen()
		
		// //뷰어 리소스 로드
		const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getViewerResource`, {activity:'touch'});
		await this._loadViewerResource( rscViewer.data );
		
		// // product 리소스 로드
		const rscProduct = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getProductResource`, {
			activity:'touch' ,
			bookID: App.Handle.appData.bookID 
		});
		
		await this._loadProductResource( rscProduct.data );

		const queryResult = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getTouchPosData`, {
			bookID:App.Handle.appData.bookID
		});
        
		this.mTouchData = queryResult.data.imagePos;
		// console.warn(this.mTouchData)
		this.addScene("intro", new Intro());
		this.addScene("activity", new Activity());
		// this.addScene("outro", new Outro());

		// this.goScene("intro");
		this.goScene("activity");
    }
    async onEndGame(){
        console.warn( "SB touch END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
	onAppMessage(argument: any){
		// 
	}
}
