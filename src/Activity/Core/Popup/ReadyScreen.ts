import * as PIXI from "pixi.js";
window.PIXI = PIXI
import { gsap } from 'gsap'

import { ResourceLoadTable } from '@/Activity/Alphabet/Define';
import { ResourceManager } from '../ResourceManager';

export class ReadyScreen extends PIXI.Container{
    private mTitle: PIXI.Sprite;
    private mBG: PIXI.Graphics;
    private mSpine: PIXI.spine.Spine;
    private mSound: { [key: string]: PIXI.sound.Sound };
    private mTimeline: any;
    constructor(){
        super();
        this.mTitle = new PIXI.Sprite();
        this.mTitle.anchor.set( 0.5 );
        this.mTitle.position.set( 1280/2, 720/2 );
        
        this.mBG = new PIXI.Graphics();
        this.mBG.interactive = true;
        this.mBG.beginFill(0x000000);
        this.mBG.drawRect( 0,0, 1280, 720 );
        this.mBG.endFill();
        this.mBG.alpha = 0.4;
        
        this.mBG.interactive = true;
        
        this.addChild( this.mBG );
        this.addChild( this.mTitle );

    }

    async init(){
        
        const list: ResourceLoadTable ={
            image:[
                'title_alphabet_block.png',
                'title_alphabet_catch.png',
                'title_alphabet_match.png',
                'title_alphabet_quiz.png',
                'title_alphabet_touch.png',

                'listening_touch.png',
                'making_book.png',
                'reading_match.png',
                'spot_finder.png',
                'story_catch.png',
                'story_movie.png',
                'story_quiz.png',
            ],
            spine:[
                "common_ready.json",
            ],
            sound:[
                "alphabet_block.mp3",
                "alphabet_catch.mp3",
                "alphabet_match.mp3",
                "alphabet_quiz.mp3",
                "alphabet_touch.mp3",

                "listening_touch.mp3",
                "making_book.mp3",
                "reading_match.mp3",
                "spot_finder.mp3",
                "story_catch.mp3",
                "story_movie.mp3",
                "story_quiz.mp3",

                "readygo.mp3",
                "twinkle.mp3",
                "321go.mp3",
                "card_inmypocket.mp3",
                "herewego.mp3"
            ]
        }

        await ResourceManager.Handle.loadViewerResource("common", list)
        
        if(this.mSpine) this.removeChild( this.mSpine );        
        this.mSpine = new PIXI.spine.Spine(ResourceManager.Handle.getViewerResource( 'common/common_ready.json' ).spineData);
        this.mSpine.position.set( 1280/2, 720/2 )  
        this.addChild( this.mSpine );
        
        this.mSound = {};
        this.mSound['sfx/readygo'] = ResourceManager.Handle.getViewerResource( 'common/readygo.mp3' ).sound;
        this.mSound['sfx/twinkle'] = ResourceManager.Handle.getViewerResource( 'common/twinkle.mp3' ).sound;
        this.mSound['sfx/321go'] = ResourceManager.Handle.getViewerResource( 'common/321go.mp3' ).sound;
        this.mSound['sfx/card_inmypocket'] = ResourceManager.Handle.getViewerResource( 'common/card_inmypocket.mp3' ).sound;             
        this.mSound['sfx/herewego'] = ResourceManager.Handle.getViewerResource( 'common/herewego.mp3' ).sound;             
        
        this.mSound['al_block'] = ResourceManager.Handle.getViewerResource( 'common/alphabet_block.mp3' ).sound;             
        this.mSound['al_catch'] = ResourceManager.Handle.getViewerResource( 'common/alphabet_catch.mp3' ).sound;             
        this.mSound['al_match'] = ResourceManager.Handle.getViewerResource( 'common/alphabet_match.mp3' ).sound;             
        this.mSound['al_quiz'] = ResourceManager.Handle.getViewerResource( 'common/alphabet_quiz.mp3' ).sound;             
        this.mSound['al_touch'] = ResourceManager.Handle.getViewerResource( 'common/alphabet_touch.mp3' ).sound;             

        this.mSound['sb_touch'] = ResourceManager.Handle.getViewerResource( 'common/listening_touch.mp3' ).sound;             
        this.mSound['sb_makingbook'] = ResourceManager.Handle.getViewerResource( 'common/making_book.mp3' ).sound;             
        this.mSound['sb_match'] = ResourceManager.Handle.getViewerResource( 'common/reading_match.mp3' ).sound;             
        this.mSound['sb_finder'] = ResourceManager.Handle.getViewerResource( 'common/spot_finder.mp3' ).sound;             
        this.mSound['sb_catch'] = ResourceManager.Handle.getViewerResource( 'common/story_catch.mp3' ).sound;             
        this.mSound['sb_movie'] = ResourceManager.Handle.getViewerResource( 'common/story_movie.mp3' ).sound;             
        this.mSound['sb_quiz'] = ResourceManager.Handle.getViewerResource( 'common/story_quiz.mp3' ).sound;             
    }

    titleAniProc( title: string ): Promise<void>{
        return new Promise<void>( (resolve,reject)=>{
            switch( title ){
                case 'al_block':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/title_alphabet_block.png` ).texture; }break;
                case 'al_catch':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/title_alphabet_catch.png` ).texture; }break;
                case 'al_match':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/title_alphabet_match.png` ).texture; }break;
                case 'al_quiz':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/title_alphabet_quiz.png` ).texture; }break;
                case 'al_touch':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/title_alphabet_touch.png` ).texture; }break;

                case 'sb_touch':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/listening_touch.png` ).texture; }break;
                case 'sb_makingbook':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/making_book.png` ).texture; }break;
                case 'sb_match':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/reading_match.png` ).texture; }break;
                case 'sb_finder':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/spot_finder.png` ).texture; }break;
                case 'sb_catch':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/story_catch.png` ).texture; }break;
                case 'sb_movie':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/story_movie.png` ).texture; }break;
                case 'sb_quiz':{ this.mTitle.texture = ResourceManager.Handle.getViewerResource( `common/story_quiz.png` ).texture; }break;
                
                default: { resolve();  return; }
            } 
            this.mTitle.scale.set( 0.2 );
            this.mTitle.alpha = 0
            if( this.mSound[title] !== undefined ){
                this.mSound[title].play();
            }
            gsap.to( this.mTitle.scale, {x:1, y:1, duration:1, ease:"bounce"})
            gsap.to( this.mTitle, {alpha:1, duration:1})
            gsap.to( this.mTitle.scale, {delay:1.5, x:1.5, y:1.5, duration:0.5})
            gsap.to( this.mTitle, {delay:1.5, alpha:0, duration:0.5})
            .eventCallback("onComplete", ()=>{ resolve() })
        })
    }

    spineAniProc( typeIDX: number ): Promise<void>{
        return new Promise<void>( (resolve,reject)=>{
            this.mSpine.state.addListener({
                event:( entry, event)=>{
                    console.warn( "Spine Event:" ,event.data.name )
                    if( this.mSound[event.data.name] !== undefined ){
                        this.mSound[event.data.name].play();
                    }
                },
                complete: (entry) => { resolve();},
            });
            switch( typeIDX ){
                case 0:{ this.mSpine.state.setAnimation(0,"ready01", false) }break;
                case 1:{ this.mSpine.state.setAnimation(0,"ready02", false) }break;
                case 2:{ this.mSpine.state.setAnimation(0,"ready03", false) }break;
                default: {  resolve()  }break;
            }            
        })
    }

    async start( typeIDX: number, title: string ){
        console.log( "ready start", typeIDX, title);
        await this.titleAniProc( title );
        await this.spineAniProc( typeIDX );
    }
    
}