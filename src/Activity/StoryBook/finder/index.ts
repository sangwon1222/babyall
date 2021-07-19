import {App, GameBase} from '../../Core'
import Axios from 'axios';
import Util from '@/Util';
import { Intro,Activity } from './Scene';
import { ParentSetupModule } from '@/store/ParentSetup';

export default class Game extends GameBase {
    private mFinderData: any;

    get finderData(): any { return this.mFinderData }
    constructor(){
        super("finder")
    }

    async onStartGame() {
        await this.startLoadingScreen();
        console.log("STORY FINDER START")

        //뷰어 리소스 로드
        const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getViewerResource`, {activity: 'finder'});
        await this._loadViewerResource( rscViewer.data );

        //product 리소스 로드
        const rscProduct = await Axios.post(`${Util.Config.restAPIProd}/storybooks/getProductResource`, {
            activity: 'finder' ,
            bookID: App.Handle.appData.bookID
        });
        await this._loadProductResource( rscProduct.data )

        const queryResult = await Axios.post( `${Util.Config.restAPIProd}/storybooks/getFinderPosData`, {
			bookID:App.Handle.appData.bookID
		});
        
        this.mFinderData = queryResult.data.rectData;

        // this.addScene("intro" , new Intro() );
        this.addScene("activity" , new Activity() );

        // this.goScene("intro")
        this.goScene("activity")
    }
    async onEndGame(){
        console.warn( "SB finder END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
    onAppMassage(){
        //
    }
}