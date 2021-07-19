import { gsap, Bounce } from 'gsap'
import { Button } from './Button';
import { App } from '@/Activity/Core';
import { ResourceManager } from '@/Activity/Core/ResourceManager';


const decoList = [
    "bg_00_thum.png",
    "bg01_01_thum.png",
    "bg01_02_thum.png",
    "bg01_03_thum.png",
    "bg01_04_thum.png",
]

// const decoList = [
//     "bg_00.png",
//     "bg01_01.png",
//     "bg01_02.png",
//     "bg01_03.png",
//     "bg01_04.png",
// ]

export class ImageList extends PIXI.Container{
    private mDecoImageArray: Array<Button>;
    private mSelected: PIXI.Sprite;
    constructor(){
        super();
        this.mDecoImageArray = [];
        this.mSelected = new PIXI.Sprite(App.Handle.currentGame.getResource(`selected.png`).texture)
        this.mSelected.anchor.set(0.5);
        this.mSelected.y=-12;
        // this.mSelected.position.set(this.mSelected.width/2,this.mSelected.height/2)

        let idx = 0;
        for( let y=0; y< 2; y++){
            for( let x=0; x< 4; x++){
                let fname = 'no_img.png';
                if( decoList[idx] ) fname = decoList[idx];
                const btn = new Button( fname );
                btn.anchor.set( 0.5 )
        
                if( decoList[idx] ) {
                    // btn.scale.set( 212/btn.width);
                    btn.scale.set(1);
                    // const debug = new PIXI.Graphics();
                    // debug.lineStyle(2,0xFF000000,1)
                    // // debug.drawRect(0,0,btn.width,btn.height)
                    // debug.drawRect(0,0,110,88)
                    // debug.endFill();
                    // btn.addChild(debug);
                    // debug.pivot.set(debug.width/2,debug.height/2)

                    btn.on("onClick",(path: string )=>{
                        path = path.slice(0,-9) + `.png`
                        console.log( "ssss", path);
                        this.emit( "onSelectBG", path );
                    })
                }
                btn.position.set(  165 + (x * 245), 170 +(y* 240) );
                this.mDecoImageArray.push( btn );
                this.addChild( btn );
                idx += 1;
            }
        }
    }

    setCurrentBGName( bgname: string ){
        for( const btn of this.mDecoImageArray ){
            if( btn.path.slice(0,-9)+ `.png` == bgname ){
                btn.addChild(this.mSelected)
                // btn.alpha = 0.2;
                btn.interactive = false;
            }else{
                // btn.alpha = 1;
                btn.interactive = true;
            }
        }
    }
}
export class Deco extends PIXI.Container{
    protected mDimmed: PIXI.Graphics;
    protected mBox: PIXI.NineSlicePlane;
    protected mTitle: PIXI.Sprite;
    protected mExitButton: Button;
    private mImageList: ImageList;
    constructor(){
        super();
        
        this.mDimmed = new PIXI.Graphics();
        this.mDimmed.beginFill(0x000000);
        this.mDimmed.drawRect( 0,0, 1280,720 );
        this.mDimmed.endFill();
        this.mDimmed.alpha = 0.5;
        this.addChild( this.mDimmed );   
        
        this.mBox = new PIXI.NineSlicePlane( 
            App.Handle.currentGame.getResource("deco_box.png").texture,
            50, 50, 50, 50
            );
        this.mBox.width = 1082;
        this.mBox.height = 576;
        this.mBox.pivot.set( this.mBox.width/2, this.mBox.height/2 );
        this.mBox.position.set( 1280/2, 400);
        this.addChild( this.mBox );

        this.mTitle = new PIXI.Sprite( App.Handle.currentGame.getResource( 'title_deco.png' ).texture );
        this.mTitle.anchor.set( 0.5 );
        this.mTitle.position.set( 1280/2, 60);
        this.addChild( this.mTitle );

        this.mImageList = new ImageList();
        this.mBox.addChild( this.mImageList );
        this.mImageList.on("onSelectBG",(path: string )=>{
            this.emit( "onSelectBG", path );
            this.close();
        })
        this.mExitButton = new Button("btn_x.png")
        this.mExitButton.on("pointerup",( evt: PIXI.InteractionEvent )=>{
            this.close();
        });
        this.mExitButton.position.set( this.mBox.width-60, -30 );
        this.mBox.addChild( this.mExitButton );
        this.interactive = true;
        this.close();
    }

    show( currentBGName: string ){
        this.mImageList.setCurrentBGName( currentBGName );
        this.mTitle.y = -100;
        this.mBox.scale.set(0.3);
        gsap.to( this.mBox.scale, {x:1,y:1, duration: 1.0, ease: "bounce.out" })
        gsap.to( this.mTitle, {y:60, duration: 1.0, ease: "bounce.out" })
        this.visible = true;

    }
    close(){
        this.visible = false;
    }
}