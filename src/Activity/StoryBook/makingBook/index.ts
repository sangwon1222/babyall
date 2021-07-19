import {App, GameBase} from '../../Core'
import Axios from 'axios';
import Util from '@/Util';
import { Intro,Activity } from './Scene';
import { ParentSetupModule } from '@/store/ParentSetup';

export default class Game extends GameBase {
    constructor(){
        super("makingbook")
    }
    
    async onStartGame() {
        await this.startLoadingScreen();
        console.log(`MAKING BOOK LOADING`)

        /**메이킹북 뷰어 데이터 */
        const rscViewer = await Axios.post(`${Util.Config.restAPIProd}/storybooks/getViewerResource`, {activity:'makingbook'});
        await this._loadViewerResource( rscViewer.data );

        /**메이킹북 프로덕트 데이터 */
        const rscProduct = await Axios.post(`${Util.Config.restAPIProd}/storybooks/getProductResource`,{
            activity: 'makingbook' ,
            bookID: App.Handle.appData.bookID
        });
        await this._loadProductResource( rscProduct.data )
        
        this.addScene("intro", new Intro() )
        this.addScene("activity", new Activity() )

        // this.goScene("intro")
        this.goScene("activity")
    }

    async onEndGame(){
        console.warn( "SB makingbook END", this.playTime );
        await ParentSetupModule.updatePlayTime( this.playTime );
    }
    
    onAppMassage(){
        //
    }
}