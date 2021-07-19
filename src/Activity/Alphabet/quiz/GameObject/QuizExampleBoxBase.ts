import { App } from '@/Activity/Core';

const debugMode = false;

export enum BoxSizeType {
    uppercase,          // 대문자
    lowerA,             // 소문자 a계열
    lowerB,             // 소문자 b계열 
    lowerG,             // 소문자 g계열 
    image2,             // 이미지 2지선다
    image4,             // 이미지 4지선다
} 

export class QuizExampleBoxBase extends PIXI.Container{
    protected mSizeType = BoxSizeType.uppercase;    
    
    protected mRoot: PIXI.Container;
    
    protected mBox: PIXI.Sprite;
    // protected mBox: PIXI.NineSlicePlane;
    protected mBoxTextureShadow: PIXI.Texture;
    protected mBoxTexturePlainShadow: PIXI.Texture;
    protected mBoxTexturePlain: PIXI.Texture;
    protected mBoxTextureBlank: PIXI.Texture;
    
    protected mSelectLine: PIXI.Sprite;
    // protected mSelectLine: PIXI.NineSlicePlane;
    protected mNormalColor = 0xFFFFFF;
    protected mSelectColor = 0xf6f8c1;
    protected mCorrectColor = 0xf6dbf9;
    
    get width(): number{ return super.width }
    set width(v: number){ 
        // console.error("!" )
        this.mBox.width = v 
        this.mSelectLine.width = v
        this.mSelectLine.pivot.x = v/2;
        this.mBox.pivot.x = v/2;
    }
    get height(): number{ return super.height }
    set height(v: number){ 
        // console.error("h!!" )
        this.mBox.height = v
        this.mSelectLine.height = v
        this.mSelectLine.pivot.y = v/2;    
        this.mBox.pivot.y = v/2;    
    }

    get sizeType(): BoxSizeType { return this.mSizeType }
    set sizeType( v: BoxSizeType ){
        this.mSizeType = v;
        if( this.mSizeType == 0 ){          // 대문자
            // this.width = 249;
            // this.height = 270;
            this.mRoot.y = 0;
        }else if( this.mSizeType == 1 ){    // 소문자 a계열
            // this.width = 210;
            // this.height = 194;
            this.mRoot.y = 38;
        }else if( this.mSizeType == 2 ){     // 소문자 b계열 
            // this.width = 180;
            // this.height = 270;
            this.mRoot.y = 0;
        }else if( this.mSizeType == 3 ){     // 소문자 g계열 
            // this.width = 180;
            // this.height = 271;
            this.mRoot.y = 92;
        }
    }

    constructor(){
        super();
        this.mRoot = new PIXI.Container();
        this.addChild( this.mRoot );

        this.mBoxTextureShadow = App.Handle.currentGame.getResource("box_default_2.png").texture;
        this.mBoxTexturePlain = App.Handle.currentGame.getResource("box_default_2.png").texture;
        this.mBoxTexturePlainShadow = App.Handle.currentGame.getResource("box_default_3.png").texture;
        // this.mBoxTextureBlank = App.Handle.currentGame.getResource("box_3.png").texture;
        
        this.mBox = new PIXI.Sprite( this.mBoxTextureShadow)
        // this.mBox.anchor.set(0.5);
        // this.mBox = new PIXI.NineSlicePlane( this.mBoxTextureBlank, 30, 30, 30, 30 )
        this.mRoot.addChild( this.mBox );
        this.mBox.tint = this.mNormalColor;
        
        
        // this.mSelectLine = new PIXI.NineSlicePlane(
        //     App.Handle.currentGame.getResource("box_select.png").texture,
        //     30, 30, 30, 30
        // )
        this.mSelectLine = new PIXI.Sprite(App.Handle.currentGame.getResource("box_inner_select_1.png").texture)
        
        this.mSelectLine.visible = false;
        this.mRoot.addChild( this.mSelectLine );
        
        if( debugMode ){
            // 중심 표시
            const debugCenter = new PIXI.Graphics();
            debugCenter.lineStyle(2, 0xFF00FF, 1);
            debugCenter.moveTo( 0, -10 );
            debugCenter.lineTo( 0, 10);
            debugCenter.moveTo( -10, 0 );
            debugCenter.lineTo( 10, 0);
            this.addChild(debugCenter);
        }
    }

    // symbol글씨로 부터 박스 사이즈 타입을 반환
    getBoxSizeBySymbol( symbol: string): BoxSizeType{
        //대문자면 타입1
        if( symbol[0] == symbol[0].toUpperCase() ){
            return BoxSizeType.uppercase;
        }else{
            const check1 = ['b','d','f','h','i','k','l','t'];
            const check2 = ['g','j','p','q','t','y'];
            if( check1.includes( symbol[0] ) ){
                return BoxSizeType.lowerB;
            }else if( check2.includes( symbol[0] ) ){
                return BoxSizeType.lowerG;
            }else{
                return BoxSizeType.lowerA;
            }
        }
    }
} 
