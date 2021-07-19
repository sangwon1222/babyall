import { App } from "../Core";
import { GameBase } from "../Core";

import Axios from 'axios';
import Util from '@/Util'
import { BGImage } from './GameObject/BGImage';

import { Bath } from "./Scene/Bath";
import { Clean } from "./Scene/Clean";
import { Eat } from "./Scene/Eat";
import { First } from "./Scene/First";
import { Home } from "./Scene/Home";
import { Play } from "./Scene/Play";
import { UserModule } from '@/store/UserStore';

import PIXISound from 'pixi-sound'


// 모든 컨디션은 Max 3
export interface DogCondition{
    needBath: number;
    needClean: number;
    needEat: number;
    needPlay: number;
}

export default class Game extends GameBase {
    
    private mDogConditon: DogCondition;
    get dogCondition(): DogCondition{ return this.mDogConditon }

	constructor() {
        super("");
        PIXISound.stopAll();
        this.mDogConditon = {
            needBath: Math.floor( Math.random() * 4 ),
            needClean: Math.floor( Math.random() * 4 ),
            needEat: Math.floor( Math.random() * 4 ),
            needPlay: Math.floor( Math.random() * 4 ),
        }
	}

	async onStartGame() {
		await this.startLoadingScreen()
        console.log("myPet onStartGame")
        
        this.mMenuScreen.visible = false;
		//뷰어 리소스 로드
		const rscViewer = await Axios.post( `${Util.Config.restAPIProd}/mypet/getViewerResource`, {});
        await this._loadViewerResource( rscViewer.data );
		
		//product 리소스 로드
		// const rscProduct = await Axios.post( `${restURL}/alphabet/getProductResource`, {activity:'touch', symbol:App.Handle.appData.symbol.toLowerCase() });
		// await this._loadProductResource( rscProduct.data );

		// 로딩화면 제거

        
		this.addScene("first", new First());
		this.addScene("home", new Home());
		this.addScene("bath", new Bath());
		this.addScene("clean", new Clean());
		this.addScene("eat", new Eat());
		this.addScene("play", new Play());
		// this.addScene("activity", new Activity());
		// this.addScene("outro", new Outro());

        if( UserModule.homeData == null || UserModule.homeData.mypetInfo.recievedPet == false ){
            this.goScene("first");
        }else{
            this.goScene("home");
        }
	}
    
	onEndGame() {
		// this.onNext();
	}
	
	onAppMessage(argument: any){
		// 
	}
}
