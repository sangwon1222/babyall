import { gsap } from 'gsap'
import { ResourceLoadTable } from '@/Activity/Alphabet/Define';
import { ResourceManager } from '@/Activity/Core/ResourceManager';

export class GameHowto extends PIXI.Container{
    private mDimmed: PIXI.Graphics;
    private mBG: PIXI.Sprite;
    
    private mPageContainer: PIXI.Container;
    private mPageAnchor: PIXI.Container;
    private mCurrentPageIDX = 0;
    private mPageCount = 0;

    private mPagenationAnchor: PIXI.Container;
    private mPagenations: Array<PIXI.Sprite>;

    private mCloseButton: PIXI.Sprite;

    constructor(){
        super();
    }

    async init(pages: Array<PIXI.Texture>){
        this.visible=true;
        const list: ResourceLoadTable ={
            image:[
                'btn_eop_ok.png',
                'howto_bg.png',
                'btn_x.jpg'
            ],
            spine:[
                "common_eop.json",
                "common_eop_sb.json",
            ],
            sound:[
                "1eop_ending.mp3",
                "2eop_text.mp3",
                "321go.mp3",
                "eop_goodjob.mp3",
                "4eop_gone.mp3",
                "3eop_nut.mp3"
            ]
        }
        await ResourceManager.Handle.loadViewerResource("common", list);
        await this.setting();
        await this.initPage(pages);
    }

    setting(){
        this.mDimmed = new PIXI.Graphics();
        this.mDimmed.beginFill(0x0000,0.6);
        this.mDimmed.drawRect(-1280/2,-720/2,1280,720);
        this.mDimmed.endFill();
        this.addChild(this.mDimmed)
        this.mDimmed.interactive = true;

        this.mBG = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/howto_bg.png").texture );
        this.mBG.pivot.set( this.mBG.width/2, this.mBG.height/2);
        this.addChild( this.mBG );
        
        this.mCloseButton = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/btn_x.jpg").texture )
        this.mCloseButton.anchor.set(0.5)
        this.mCloseButton.position.set(this.mBG.width-40, 60);
        this.mCloseButton.hitArea = new PIXI.Rectangle(-this.mCloseButton.width,-this.mCloseButton.height,this.mCloseButton.width*2,this.mCloseButton.height*2)
        this.mCloseButton.interactive = true;
        this.mCloseButton.buttonMode = true;
        this.mBG.addChild(this.mCloseButton)
        
        this.mPageContainer = new PIXI.Container();
        this.mPageContainer.x = -500;
        this.mPageContainer.y = -250;
        this.addChild( this.mPageContainer );
        const gr = new PIXI.Graphics();
        gr.beginFill( 0xcccccc, 0.5 );
        gr.drawRect( 0,0, 1002, 510 )
        gr.endFill();
        this.mPageContainer.mask = gr;
        this.mPageContainer.addChild( gr );
        
        const scrollLeftButton = new PIXI.Graphics();
        scrollLeftButton.beginFill( 0xcccccc );
        scrollLeftButton.drawRect( 0,0, 481, 503 )
        scrollLeftButton.endFill();
        scrollLeftButton.alpha = 0;
        scrollLeftButton.interactive = true;
        scrollLeftButton.buttonMode = true;
        scrollLeftButton.on("pointerdown",()=>this.scrollLeft() )

        const scrollRightButton = new PIXI.Graphics();
        scrollRightButton.beginFill( 0xcccccc );
        scrollRightButton.drawRect( 0,0, 481, 503 )
        scrollRightButton.endFill();
        scrollRightButton.x = 481+40;
        scrollRightButton.alpha = 0;
        scrollRightButton.interactive = true;
        scrollRightButton.buttonMode = true;
        scrollRightButton.on("pointerdown",()=>this.scrollRight() )
        
        this.mPageContainer.addChild( scrollLeftButton );
        this.mPageContainer.addChild( scrollRightButton );
        
        this.mPageAnchor = new PIXI.Container();
        this.mPageContainer.addChild( this.mPageAnchor );

        this.mPagenationAnchor = new PIXI.Container();
        this.addChild( this.mPagenationAnchor );


        this.position.set( 1280/2, 720/2);
        
        this.alpha = 0;

        this.interactive = true;
        // this.buttonMode = true;
        this.on("pointertap",(evt)=>{ evt.stopPropagation(); })

        this.mBG.interactive = true;
        this.mBG.on("pointerdown",(evt)=>{  evt.stopPropagation();  })
    }

    scrollRight(){
        //
        
        if( this.mCurrentPageIDX < this.mPageCount-1){
            this.mCurrentPageIDX += 1;
            gsap.to(this.mPageAnchor,{ duration:0.5, x: -this.mCurrentPageIDX*521 } )
            
            for( let i=0; i< this.mPagenations.length; i++){
                if( i == this.mCurrentPageIDX){
                    this.mPagenations[i].texture = ResourceManager.Handle.getViewerResource("common/point_blue.png").texture
                    this.mPagenations[i].scale.set( 0.5 );
                    gsap.to(this.mPagenations[i].scale,{ duration:0.5, x:1, y:1 } )
            
                }else{
                    this.mPagenations[i].texture = ResourceManager.Handle.getViewerResource("common/point_gray.png").texture
                }
            }
            
        }
    
        
    }
    scrollLeft(){
        if( this.mCurrentPageIDX > 0){
            this.mCurrentPageIDX -= 1;
            gsap.to(this.mPageAnchor,{ duration:0.5, x: -this.mCurrentPageIDX*521 } )
            for( let i=0; i< this.mPagenations.length; i++){
                if( i == this.mCurrentPageIDX){
                    this.mPagenations[i].texture = ResourceManager.Handle.getViewerResource("common/point_blue.png").texture
                    this.mPagenations[i].scale.set( 0.5 );
                    gsap.to(this.mPagenations[i].scale,{ duration:0.5, x:1, y:1 } )
                }else{
                    this.mPagenations[i].texture = ResourceManager.Handle.getViewerResource("common/point_gray.png").texture
                }
            }
            
        }    
    }

    //페이지 스프라이트를 만든다.
    initPage(pages: Array<PIXI.Texture> ): Promise<void>{
        return new Promise<void> ((resolve,reject)=>{
            gsap.to(this,{alpha:1,duration:0.5});
            this.mCurrentPageIDX = 0;
            this.mPageCount = pages.length;
            if( this.mPageCount == 0 ) return;
            
            let offset = 0;
            this.mPageAnchor.removeChildren();
            this.mPagenationAnchor.removeChildren();
            this.mPagenations = [];
            let idx = 0;
            for( const pageTexure of pages ){
                const spr = new PIXI.Sprite(pageTexure);
                spr.x = offset;
                
                const pagenation = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/point_gray.png").texture);
                pagenation.anchor.set( 0.5 );
                pagenation.x = idx * 30; 
                this.mPagenations.push( pagenation );
                this.mPageAnchor.addChild( spr );
                this.mPagenationAnchor.addChild( pagenation );
                if( pageTexure != pages[pages.length-1]){
                    offset+= spr.width + 40;
                    const line = new PIXI.Sprite( ResourceManager.Handle.getViewerResource("common/line.png").texture )
                    line.x = offset - 20;
                    this.mPageAnchor.addChild( line );   
                }
                idx += 1;
            } 
            this.mPagenations[0].texture = ResourceManager.Handle.getViewerResource("common/point_blue.png").texture
            this.mPagenationAnchor.y = 270;
            this.mPagenationAnchor.x = -( this.mPagenationAnchor.getLocalBounds().width - this.mPagenationAnchor.getLocalBounds().x )/2 + 15;
            
            resolve(); 
        })
    }

    ready(): Promise<void>{
        return new Promise<void> ((resolve,reject)=>{
        this.mCloseButton
            .on("pointertap",()=>{
                this.close();
                resolve(); 
            })
            this.mDimmed
            .on("pointertap",()=>{
                this.close();
                resolve(); 
            })
        })
    }

    close(){
        if( this.visible == false) return;
        this.alpha = 1;
        gsap.to(this, {alpha:0,duration: 0.2 } )
        .eventCallback("onComplete",()=>{
            this.visible = false;
        })
    }
}