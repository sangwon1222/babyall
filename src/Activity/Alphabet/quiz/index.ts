import * as PIXI from "pixi.js";
import { GameBase, App } from "../../Core";
import { Activity } from "./Scene";

import Axios from 'axios';
import Util from '@/Util';
import { ParentSetupModule } from '@/store/ParentSetup';
import { AlphabetModule } from '@/store/Alphabet';
import { QuizDataTypeBase } from './Define';

// Alphabet Match Game
export default class Game extends GameBase {
    private mQuizData: Array<QuizDataTypeBase>;

    get quizData(): Array<QuizDataTypeBase> { return this.mQuizData; }
    
    constructor() {
        super("quiz");
    }
    
    async onStartGame() {
        await this.startLoadingScreen()

        const symbol = App.Handle.appData.symbol.toLowerCase();
        //뷰어 리소스 로드
        const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/alphabet/getViewerResource`, {activity:'quiz'});
        await this._loadViewerResource( rscViewer.data );
        
        // await this._loadProductResource( rscProduct );
        
        const quizData = await Axios.post( `${Util.Config.restAPIProd}/alphabet/getQuizData`, {
            symbol: symbol,
            level: App.Handle.appData.level,
        });

        console.log( ">>>", quizData);
        
        // 추가적인 글자를 로드한다.
        for( const symbol_ of quizData.data.addSymbol ){
            const rscProduct = await Axios.post( `${Util.Config.restAPIProd}/alphabet/getProductResource`, {activity:'quiz', symbol:symbol_ });
            await this._loadProductResource( rscProduct.data );        
        }

        const blockdata = await Axios.post(`${Util.Config.restAPIProd}/alphabet/getBlockData`, {
            symbol: App.Handle.appData.symbol.toLowerCase()
        });
        console.log(blockdata)
        this.mQuizData = blockdata.data.QuizData;

        console.log( "quizData",quizData );
        // const gameInfo = this.getResource( `${this.gameName}.json`).data;
        // console.log( `${this.gameName}.json`);
        // console.log( gameInfo );
        
        this.addScene("activity", new Activity( quizData.data , this.mQuizData ));
        this.goScene("activity");
    }
    
    async onEndGame(){
        console.warn( "AL quiz END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
}
