import { shuffleArray } from '@/Activity/Core/Util';
import Util from '@/Util';
import {App} from '../../../Core'

export class GameTypeBase extends PIXI.Container{
    private background: PIXI.Sprite

    constructor(path: string){
        super();

        this.background = new PIXI.Sprite();
        if(path ==='Type1'){
            const randomBG = [`block_bg_1.png`,`block_bg_2.png`,`block_bg_3.png`];
            shuffleArray(randomBG);
            this.background.texture = App.Handle.currentGame.getResource(randomBG[0]).texture
        }else{
            this.background.texture = App.Handle.currentGame.getResource(`block_bg_4.png`).texture
        }

        this.addChild(this.background)
        
    }
    onSetting(){
        //
    }

    type2Background(){
        this.background.texture = App.Handle.currentGame.getResource(`block_bg_5.png`).texture;
    }
}