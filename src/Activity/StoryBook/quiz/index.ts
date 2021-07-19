import { App } from "../../Core";
import { GameBase } from "../../Core";

import Axios from 'axios';
import Util from '@/Util'

import { Intro , Activity } from "../quiz/Scene";
import { QuizData } from '@/Activity/Alphabet/quiz/GameObject/QuizTypeBase';
import { ParentSetupModule } from '@/store/ParentSetup';


export interface SBQuizData{
    quiz3: string;
    quiz4: string;
    
    quiz5Answer: string;
    quiz5Lv1: string;
    quiz5Lv2: string;
    
    quiz5ExampleLv1: Array<string>;
    quiz5ExampleLv2: Array<string>;
}

export default class Game extends GameBase {
    private mQuizData: SBQuizData;
    get quizData(): SBQuizData{ return this.mQuizData }

	constructor() {
		super("quiz");
	}

	async onStartGame() {
		console.log("STORYBOOK QUIZ START")

		await this.startLoadingScreen();
        
		//뷰어 리소스 로드
		const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getViewerResource`, {activity:'quiz'});
		await this._loadViewerResource( rscViewer.data );
		
		//product 리소스 로드
		const rscProduct = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getProductResource`, {
			activity:'quiz' ,
			bookID:App.Handle.appData.bookID
		});
		await this._loadProductResource( rscProduct.data );

        //quizData 로드
		const quizData = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getQuizData`, {
			bookID:App.Handle.appData.bookID
		});
        
        this.mQuizData = quizData.data.list[0];
        
        // this.addScene("intro", new Intro());
		this.addScene("activity", new Activity());
		// this.addScene("outro", new Outro());

		this.goScene("activity");
	}

    async onEndGame(){
        console.warn( "SB quiz END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
    
}
