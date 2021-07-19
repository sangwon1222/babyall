import { App } from '@/Activity/Core';


export class Button extends PIXI.Sprite{
    private mPath: string;
    
    get path(): string{ return this.mPath }

    constructor( path: string ){
        super();
        // console.error(path)
        this.mPath = path;
        this.interactive = true;
        this.buttonMode = true;
        this.on("pointertap",()=>{
            this.emit( "onClick", this.mPath );
        })
        this.texture = App.Handle.currentGame.getResource(path).texture;
    }
}