import { App } from "../../Core";
import { GameBase } from "../../Core";

import Axios from 'axios';
import Util from '@/Util'

import { Intro , Activity } from "../catch/Scene";
import { CatchData } from './Define';
import { ParentSetupModule } from '@/store/ParentSetup';

export default class Game extends GameBase {
	private mCatchData: Array<CatchData>;

	get catchData(): Array<CatchData> { return this.mCatchData}
	
	constructor() {
		super("catch");
	}

	async onStartGame() {
		console.log("STORYBOOK CATCH START")
		
		// 로딩화면 표시
		await this.startLoadingScreen()
		
		//뷰어 리소스 로드
		const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getViewerResource`, {
			activity:'catch'
		});
		await this._loadViewerResource( rscViewer.data );
		
		//product 리소스 로드
		const rscProduct = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getProductResource`, {
			activity:'catch' ,
			bookID:App.Handle.appData.bookID
		});
		
		const image = {image:rscProduct.data.image}
		const sound = {sound:rscProduct.data.sound}
		await this._loadProductResource( image );
		await this._loadProductResource( sound );
		// await this._loadProductResource( rscProduct.data );

		const queryResult = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getCatchData`, {
			bookID:App.Handle.appData.bookID
		});
        
		// console.log(queryResult)
		this.mCatchData = queryResult.data.list;
        
        // this.addScene("intro", new Intro());
		this.addScene("activity", new Activity());
		// this.addScene("outro", new Outro());
		// this.goScene("intro");
        this.goScene("activity");

	}

	async onEndGame(){
        console.warn( "SB catch END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
	
	onAppMessage(argument: any){
		// 
	}
}
