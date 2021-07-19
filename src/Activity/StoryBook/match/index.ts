import { App } from "../../Core";
import { GameBase } from "../../Core";

import Axios from 'axios';
import Util from '@/Util'

import { Activity, QuizGameData } from "./Scene/Activity";
import { ParentSetupModule } from '@/store/ParentSetup';

export default class MatchGame extends GameBase {

    private mQuizGameData: Array<QuizGameData>;
    
    get quizGameData(): Array<QuizGameData>{ return this.mQuizGameData }
    
    constructor() {
		super("match");
	}

	async onStartGame() {
		console.log("STORYBOOK Match START")

        // App.Handle.appData.bookID = "2006";
        // App.Handle.appData.level  = 1;
        // App.Handle.appData.bookID = "2006";

		await this.startLoadingScreen();
        
		//뷰어 리소스 로드
		const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getViewerResource`, {activity:'match'});
		await this._loadViewerResource( rscViewer.data );
		
		//product 리소스 로드
		const rscProduct = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getProductResource`, {
			activity:'match' ,
			bookID:App.Handle.appData.bookID
		});
		await this._loadProductResource( rscProduct.data );

        //matchData 로드
		const matchData = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getMatchData`, {
            bookID:App.Handle.appData.bookID
        });
        
        console.log( "matchData", matchData.data.list );
        this.mQuizGameData = matchData.data.list;
        
        this.addScene("activity", new Activity());
		this.goScene("activity");
	}

    async onEndGame(){
        console.warn( "SB match END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
}
