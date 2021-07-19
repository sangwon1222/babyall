import { App } from "../../Core";
import { GameBase } from "../../Core";
import {  Activity } from "./Scene";
import { QuizDataTypeBase, QuizDataType1, QuizDataType2 } from "./Define";

import Axios from 'axios';
import Util from '@/Util'
import { ParentSetupModule } from '@/store/ParentSetup';
import { sound } from "pixi.js";

export default class Game extends GameBase {

    //private mSoundList: Array<string>;
    private mLoadingAry: any;
    private mQuizData: Array<QuizDataTypeBase>;

    //get soundList(): Array<string>{ return this.mSoundList; }

    get quizData(): Array<QuizDataTypeBase> { return this.mQuizData; }

    get blockData(): any {
        return this.getResource("block.json").data;
    }

    constructor() {
        super("block" );
        // this.onAppMessage();
    }

    async onStartGame() {
        await this.startLoadingScreen()
        console.log("Block onStartGame")

        const productRSC = await Axios.post(`${Util.Config.restAPIProd}/alphabet/getProductResource`, {
            symbol: App.Handle.appData.symbol.toUpperCase(),
            activity: 'block'
        });
        await this._loadProductResource(productRSC.data);

        const viewerRSC = await Axios.post(`${Util.Config.restAPIProd}/alphabet/getViewerResource`, {
            activity: 'block'
        });
        await this._loadViewerResource(viewerRSC.data);

        const symbol = App.Handle.appData.symbol.toLowerCase();
        const blockdata = await Axios.post(`${Util.Config.restAPIProd}/alphabet/getBlockData`, {
            symbol: App.Handle.appData.symbol.toLowerCase()
        });
        console.log(blockdata)
        this.mLoadingAry ={image:[],sound:[],spine:[],json:[] } ;
        for (const v of blockdata.data.addSymbol) {
            const temp = await Axios.post(`${Util.Config.restAPIProd}/alphabet/getProductResource`, {
                symbol: v.toUpperCase(),
                activity: 'block'
            });
            await this._loadProductResource(temp.data);
        }
        // await this._loadProductResource(this.mLoadingAry);

        this.mQuizData = blockdata.data.QuizData;

        
        //this.mSoundList = productRSC.data.sound.splice(0);
        //console.log( this.getResource("block.json").data )
        // this.addScene("intro", new Intro());
        this.addScene("activity", new Activity());
        // this.addScene("outro", new Outro());

        // this.goScene("intro");
        this.goScene("activity");
    }
    async onEndGame(){
        console.warn( "AL block END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
    onAppMessage(argument: any) {
        // 
    }

    //--------------------------------

    // getQuizData<T>( idx: number ): T{
    //   return <T><unknown>this.mQuizData[idx];
    // }

}
