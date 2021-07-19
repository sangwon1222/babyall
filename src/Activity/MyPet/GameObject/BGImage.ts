import { App } from '@/Activity/Core';


export class BGImage extends PIXI.Sprite{
    private mTexture={};
    constructor( path: string){
        super();
        
        this.texture = App.Handle.currentGame.getResource( path ).texture;
    }

    change( path: string ){
        this.texture = App.Handle.currentGame.getResource( path ).texture;
    }
}