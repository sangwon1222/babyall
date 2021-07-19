import { App } from "../../Core";
import { GameBase } from "../../Core";

import Axios from 'axios';
import Util from '@/Util'

import { SBMovieActivity } from "../movie/Scene/Activity";
import { ParentSetupModule } from '@/store/ParentSetup';

export default class SBMovieGame extends GameBase {
	
	constructor() {
		super("movie");
	}

	async onStartGame() {
        await this.startLoadingScreen()

        console.log("STORYBOOK Movie START")

		//뷰어 리소스 로드
		const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getViewerResource`, {activity:'movie'});
		await this._loadViewerResource( rscViewer.data );
		
		//product 리소스 로드
		// const rscProduct = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getProductResource`, {
		// 	activity:'movie' ,
		// 	bookID:App.Handle.appData.bookID
		// });
        // console.log("rscProduct.data",rscProduct.data)
		// await this._loadProductResource( rscProduct.data );

		this.addScene("activity", new SBMovieActivity());
        this.goScene("activity");   
    }
    
    async onEndGame(){
        console.warn( "SB movie END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
}
