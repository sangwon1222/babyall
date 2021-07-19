import { App } from '@/Activity/Core';
import gsap from "gsap"
import { QuizGameData } from '../Scene/Activity';
import { SoundButton } from './SoundButton';

const TextStyle = new PIXI.TextStyle({
    fontFamily: 'minigate',
    fontSize: 40,
    fontWeight: 'bold',
    fill: '#FFFFFF',
    padding:5,
});

export class TextBoard extends PIXI.Sprite{
    private mText: PIXI.Text;

    get text(): string{ return this.mText.text }
    set text(v: string){ this.mText.text = v; }

    constructor( text: string){
        super( App.Handle.currentGame.getViewerResource("dashboard_box.png").texture );
        this.anchor.set( 0, 0.5);
        
        if( text != " " ){
            this.mText = new PIXI.Text( " "+text+" ", TextStyle );
        }else{
            this.mText = new PIXI.Text( text, TextStyle );
        }
        
        this.mText.anchor.set( 0.5 );
        this.mText.position.set( this.width/2, 0)
        this.addChild( this.mText );
        
        this.mText.visible = false;
        this.init();
    }

    init(){
        this.scale.y = 0.01;
        gsap.to( this.scale,{ y:1, duration:0.5} );
    }

    showText( flag = true ){
        if( flag ){
            this.mText.visible = true;
            this.mText.alpha = 0
            gsap.to( this.mText,{ alpha:1, duration:0.2} );
        }else{
            this.mText.alpha = 1
            gsap.to( this.mText,{ alpha:0, duration:0.2} )
            .eventCallback("onComplete",()=>{
                this.mText.visible = false;    
            })
        }
    }
    
}

export class DashBoard extends PIXI.Sprite{
    private mHandle: PIXI.Sprite;
    private mTextContainer: PIXI.Container;
    private mTextBoards: { [key: string]: Array<TextBoard> };
    private mDollRoot: PIXI.Container;
    private mDolls: Array<PIXI.spine.Spine>;
    private mDollSprite: Array<PIXI.Sprite>;
    private mDollSoundBTN: Array<SoundButton>;
    private mTextOpenSound: PIXI.sound.Sound;
    private mTextCloseSound: PIXI.sound.Sound;

    constructor(){
        super();
        this.texture = App.Handle.currentGame.getViewerResource("dashboard.png").texture;
        this.anchor.set(0,1);

        this.mHandle = new PIXI.Sprite( App.Handle.currentGame.getViewerResource("handle.png").texture )
        this.mHandle.anchor.set( 0.5 );
        this.mHandle.position.set( 40, -100 );
        this.addChild( this.mHandle );

        this.mTextContainer = new PIXI.Container();
        this.mTextContainer.position.set( 260, -54 )
        this.addChild( this.mTextContainer );

        this.mDollRoot = new PIXI.Container();
        this.mDollRoot.position.set( 720, -117);
        this.addChild( this.mDollRoot );

        this.mTextOpenSound = App.Handle.currentGame.getViewerResource("rm_sfx_8.mp3").sound;
        this.mTextCloseSound = App.Handle.currentGame.getViewerResource("rm_sfx_9.mp3").sound;
    }

    handleLeft(){
        const t = gsap.timeline();
        t.to( this.mHandle, {angle:-45, duration: 0.5, ease:"easeIn"} )
        t.to( this.mHandle, {delay:0.5, angle:0, duration: 0.5, ease:"easeIn"} )
        t.to( this.mHandle, {angle:45, duration: 0.5, ease:"easeIn"} )
        t.to( this.mHandle, {delay:0.5, angle:0, duration: 0.5, ease:"easeIn"} )
    }
    handleRight(){
        const t = gsap.timeline();
        t.to( this.mHandle, {angle:45, duration: 0.5, ease:"easeIn"} )
        t.to( this.mHandle, {delay:0.5, angle:0, duration: 0.5, ease:"easeIn"} )
        t.to( this.mHandle, {angle:-45, duration: 0.5, ease:"easeIn"} )
        t.to( this.mHandle, {delay:0.5, angle:0, duration: 0.5, ease:"easeIn"} )    
    }

    initText(gamedata: QuizGameData){
        console.warn( gamedata );
        this.mTextOpenSound.play();   
        this.mTextContainer.removeChildren();

        const quiztext = gamedata.answer;
        const boxlist =[];
        for( let i=0; i<quiztext.length; i++){
            const box = new TextBoard(quiztext[i]);
            // box.alpha = 0.5;
            box.position.set( i*40, 0);
            this.mTextContainer.addChild(box);
            boxlist.push( box );
        }

        // 맞힐 철자별로 배열에 보관
        this.mTextBoards = {};
        for( const word of gamedata.words ){
            const list_= [];
            let idx = word.length;
            while( idx>0 ){
                const box = boxlist.shift();
                list_.push( box );
                if( box.text !=" ") {
                    idx -= 1; 
                }
            }
            this.mTextBoards[word] = list_;
        }
        console.log( this.mTextBoards );
        // 글씨를 가운데 정렬
        this.mTextContainer.x = 740 - Math.floor( quiztext.length/2 ) * 40;
    }

    initDoll( gamedatalist: Array<QuizGameData> ){
        this.mDollRoot.removeChildren();
        this.mDolls = [];
        this.mDollSprite = [];
        this.mDollSoundBTN = [];
        for( let i =0; i<5; i++){
            const gamedata = gamedatalist[i];
            const spine = new PIXI.spine.Spine( App.Handle.currentGame.getViewerResource("common_spring.json").spineData)
            spine.x = i* 120;
            this.mDollRoot.addChild( spine );
            this.mDolls.push( spine );
            spine.visible = false;
            const temp = spine.slotContainers[ spine.skeleton.findSlotIndex("spring_point") ];
            temp.removeChildren();
            temp.alpha = 1;
            temp.visible = true;
            const spr = new PIXI.Sprite( 
                App.Handle.currentGame.getProductResource(gamedata.correctImage).texture
            );
            spr.scale.set(-0.5, 0.5);
            spr.anchor.set(0.5,0.7);
            spr.angle = 90;
            
            const sndBTN= new SoundButton( App.Handle.currentGame.getProductResource(gamedata.answerSound).sound );
            sndBTN.angle = 90;
            sndBTN.anchor.set(0.5,0.7);
            sndBTN.scale.set(-1, 1);
            
            temp.addChild( spr );
            temp.addChild( sndBTN );
            temp.updateTransform();

            this.mDollSprite.push( spr );
            this.mDollSoundBTN.push( sndBTN );
        }
    }
    
    showText( text: string ){
        if( this.mTextBoards[text] !== undefined ){
            for( const box of this.mTextBoards[text] ){
                box.showText( true );
            }
        }
    }
    closeText(){
        this.mTextContainer.removeChildren();
        this.mTextBoards = {};
    }
    hideText(){
        for( const key in this.mTextBoards ){
            for( const box of this.mTextBoards[key] ){
                box.showText( false );
            }
        }
    }
    openAllText(){
        for( const key in this.mTextBoards ){
            for( const box of this.mTextBoards[key] ){
                box.showText( true );
            }
        }
    }

    showDoll( idx: number ){
        const spine = this.mDolls[idx];
        if( spine.visible == false ){
            spine.visible = true;
            spine.state.setAnimation(0, "spring_play", true );
        }
        this.mDollSprite[idx].visible = true; 
        this.mDollSoundBTN[idx].visible = false; 
    }
    showSound( idx: number ){
        const spine = this.mDolls[idx];
        if( spine.visible == false ){
            spine.visible = true;
            spine.state.setAnimation(0, "spring_play", true );
        }
        this.mDollSprite[idx].visible = false; 
        this.mDollSoundBTN[idx].visible = true; 
    }
}