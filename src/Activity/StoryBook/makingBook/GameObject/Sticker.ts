import { App, Util } from '../../../Core'
import { Canvas } from './Canvas';
import { UserModule } from '@/store/UserStore';
import { SystemModule } from '@/store/System';

// export enum StickerMode{
//     none,
//     list,
//     canvas
// }

export class Sticker extends PIXI.Sprite{
    
    private mTextureName: string;
    private mNameTagMask: PIXI.Container;
    private mNameTag: PIXI.Text;

    constructor( texture: string ,inList?: boolean){
        super()
        // console.log(`inList=>>%c ${inList}`,"color:blue;font-size:1.1ewm;font-weight:bold;")
        if(inList== undefined){
            inList = false;
            this.buttonMode = false;
        }else{
            inList = true;
            this.buttonMode  = true;
        }
        this.texture = App.Handle.currentGame.getProductResource(texture).texture;
        this.mTextureName = texture;

        this.mNameTagMask=new PIXI.Container();

        const hitarea = new PIXI.Graphics();
        hitarea.lineStyle(2,0x0000,1);
        hitarea.drawRect(0,0,this.width,this.height)
        hitarea.endFill();
        hitarea.pivot.set(this.width/2, this.height/2)
        // this.addChild(hitarea)
        
        this.interactive = true;
        
        this.setNameTag();
        this.on("pointertap",()=>{ this.onSelect( this.mTextureName ); })
    }
    
    setNameTag(){
        this.mNameTag = new PIXI.Text(UserModule.childNm);
        let fs = 28;
        if(this.mNameTag.width>200){
            fs = 18
        }
        const style = new PIXI.TextStyle({
            fontFamily: 'BPreplay',
            fontSize: fs,
            fontWeight: 'bold',
        });
        // Thumnail URL
        if(this.mTextureName===`mb_nametag_1.png`){
            this.addChild(this.mNameTagMask)
            this.mNameTagMask.width = 130
            this.mNameTagMask.height = 130
            this.mNameTagMask.position.set(-this.width/2 +5 ,-this.height/2 +5 )

            const name = new PIXI.Graphics();
            name.beginFill(0xFFFF00,1);
            name.drawRoundedRect(0,0 ,130,130,20);
            name.endFill();
            this.mNameTagMask.addChild(name);

            const sprite = new PIXI.Sprite( PIXI.Texture.from( UserModule.profileURL ) );
            sprite.width = 130
            sprite.height = 130
            this.mNameTagMask.addChild(sprite)

            if( SystemModule.isDemoMode === true ){
                this.mNameTag = new PIXI.Text(`체험판 입니다.`,style);
            }else{
                this.mNameTag = new PIXI.Text(UserModule.childNm,style);
            }
            this.mNameTag.position.set(-25, this.mNameTag.height*0.6)
            this.addChild(this.mNameTag)

            sprite.mask = name;
        }
        if(this.mTextureName===`mb_nametag_2.png`){
            this.addChild(this.mNameTagMask)
            this.mNameTagMask.width = 130
            this.mNameTagMask.height = 130
            this.mNameTagMask.position.set( -130/2 +2 ,-this.height/2 +38 )
            
            const name = new PIXI.Graphics();
            name.beginFill(0xFFFF00,1);
            name.drawRoundedRect(0,0 ,130,130,20);
            name.endFill();
            this.mNameTagMask.addChild(name);

            const sprite = new PIXI.Sprite( PIXI.Texture.from( UserModule.profileURL ) );
            sprite.width = 130
            sprite.height = 130
            this.mNameTagMask.addChild(sprite)

            if( SystemModule.isDemoMode == true ){
                this.mNameTag = new PIXI.Text(`체험판 입니다.`,style);
            }else{
                this.mNameTag = new PIXI.Text(UserModule.childNm,style);
            }
            this.mNameTag.position.set(-this.mNameTag.width/2 , this.mNameTagMask.height*0.6)
            this.addChild(this.mNameTag)

            sprite.mask = name;
        }
        if(this.mTextureName===`mb_nametag_3.png`){
            this.addChild(this.mNameTagMask)
            this.mNameTagMask.width = 140
            this.mNameTagMask.height = 140
            this.mNameTagMask.position.set(-this.width/2 +5 ,-this.height/2 +5 )

            const name = new PIXI.Graphics();
            name.beginFill(0xFFFF00,1);
            name.drawCircle(140/2,140/2,140/2)
            name.endFill();
            this.mNameTagMask.addChild(name);

            const sprite = new PIXI.Sprite( PIXI.Texture.from( UserModule.profileURL ) );
            sprite.width = 140
            sprite.height = 140
            this.mNameTagMask.addChild(sprite)

            sprite.mask = name;
            
            if( SystemModule.isDemoMode == true ){
                this.mNameTag = new PIXI.Text(`체험판 입니다.`,style);
            }else{
                this.mNameTag = new PIXI.Text(UserModule.childNm,style);
            }
            
            this.mNameTag.position.set(-25 , -this.mNameTag.height/3)
            this.addChild(this.mNameTag)
        }
        
    }

    onSelect( textureName: string){
        //overwrite in StickerStage.ts
    }

    checkSticker(evt){
        this.anchor.set(0.5)
        if( Util.getColorByPoint( this , new PIXI.Point( evt.data.global.x, evt.data.global.y) ).a != 0 ){
            Canvas.Handle.controller.show( this );
            Canvas.Handle.selectSticker( this )
            evt.stopPropagation();    
            return true;
        }else{
            return false
        }
    }

    reCalcWidth( size: number ){
        if( this.width > this.height ){
            this.scale.set( size/this.width)
        }else{
            this.scale.set( size/this.height)
        }        
    }
    
}