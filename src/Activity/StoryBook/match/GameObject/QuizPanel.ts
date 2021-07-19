import gsap from 'gsap'
import { App } from '@/Activity/Core';
import { Activity } from '../Scene/Activity';
import { shuffleArray } from "../../../Core/Util"

const TextStyle = new PIXI.TextStyle({
    fontFamily: 'minigate',
    fontSize: 50,
    fontWeight: 'bold',
    fill: '#000000',
    padding:5,
});

export enum SelectSide{
    left,
    right
}

export class QuizCard extends PIXI.Container{
    private mBG: PIXI.NineSlicePlane;
    private mLine: PIXI.NineSlicePlane;
    private mLineAniTween: gsap.core.Tween;
    private mIsCorrect: boolean;
    
    private mText: PIXI.Text;
    private mImage: PIXI.Sprite;

    get isCorrect(): boolean { return this.mIsCorrect }
    set isCorrect(v: boolean) { 
        this.mIsCorrect = v; 
    }

    get quizPanel(): QuizPanel{ return ( this.parent as QuizPanel) }

    constructor(){
        super();
        
        this.mBG = new PIXI.NineSlicePlane(
            App.Handle.currentGame.getViewerResource('box_1.png').texture,
            45,45,45,45
        )
        this.mLine = new PIXI.NineSlicePlane(
            // App.Handle.currentGame.getViewerResource('box_select.png').texture,
            App.Handle.currentGame.getViewerResource('box_correct.png').texture,
            45,45,45,45
        )
        this.addChild( this.mBG );
        this.addChild( this.mLine );
        
        this.setSize( 325, 242 );

        this.mText = new PIXI.Text("",TextStyle );
        this.mText.anchor.set( 0.5 );
        this.mImage = new PIXI.Sprite();
        this.mImage.anchor.set( 0.5 );

        this.addChild( this.mText );
        this.addChild( this.mImage );

        this.buttonMode = true;

        this.on("pointerup",()=>{
            this.onClick();
        })
    }    

    init(){
        if( this.mLineAniTween ){
            this.mLineAniTween.kill();
        }
        this.mLine.visible = false;

        this.mIsCorrect = false;
        this.mLine.visible = false;
        this.interactive = false;
        this.mText.visible = false;
        this.mImage.visible = false;
        
        this.mText.style = new PIXI.TextStyle({
            fontFamily: 'minigate',
            fontSize: 50,
            fontWeight: 'bold',
            fill: '#000000',
            padding:5,
        });
    }
    setSize( w: number, h: number){
        this.mBG.width = w;
        this.mBG.height = h;

        this.mLine.width = w;
        this.mLine.height = h;

        this.mBG.pivot.set( w/2, h/2 );
        this.mLine.pivot.set( w/2, h/2 );

    }

    setText( text: string ){
        //
        this.mText.text = text;
        this.mText.visible = true;
        this.mImage.visible = false;
        if( this.mText.width+80 > 325 ){
            this.setSize( this.mText.width+80, 242 );
        }else{
            this.setSize( 325, 242 );
        }
    }
    
    setImage( imageTexture: PIXI.Texture ){
        this.mImage.texture = imageTexture;
        this.mText.visible = false;
        this.mImage.visible = true;
        this.setSize( 325, 242 );
    }

    setBarricate(){
        this.mImage.texture = App.Handle.currentGame.getViewerResource("barricade.png").texture;
        this.mText.visible = false;
        this.mImage.visible = true;
        this.setSize( 325, 242 );
    }

    onClick(){
        if ( this.quizPanel.selectAnswer( this ) ){
            this.mLine.texture = App.Handle.currentGame.getResource(`box_correct.png`).texture;
        }else{
            this.mLine.texture = App.Handle.currentGame.getResource(`box_wrong.png`).texture;
        }
        this.mImage.alpha = 1;
        this.mText.alpha = 1;
        this.mText.style = new PIXI.TextStyle({
            fontFamily: 'minigate',
            fontSize: 50,
            fontWeight: 'bold',
            fill: '#FFFFFF',
            padding:5,
        });

        this.mLine.visible = true;   
        this.mLine.alpha = 0;
        this.mLineAniTween = gsap.to( this.mLine, { alpha:1, duration:0.5}).yoyo(true).repeat(0);
        gsap.delayedCall(2,()=>{
            this.mText.style = new PIXI.TextStyle({
                fontFamily: 'minigate',
                fontSize: 50,
                fontWeight: 'bold',
                fill: '#000000',
                padding:5,
            });

        })
    }
}

export class QuizPanel extends PIXI.Graphics{

    private mCards: Array<QuizCard>;
    private mCorrectSound: PIXI.sound.Sound;
    private mWrongSound: PIXI.sound.Sound;

    get activity(): Activity{ return (this.parent as Activity) }

    constructor(){
        super();
        this.beginFill( 0x000000, 0.5 );
        this.drawRect( 0,0, 1280, 720 );
        this.visible = false;

        this.mCards =[
            new QuizCard(),
            new QuizCard()
        ]
        const cardDeco1 = new PIXI.Sprite(App.Handle.currentGame.getViewerResource("box_bgline.png").texture )
        cardDeco1.position.set(-5,300-50);
        const cardDeco2 = new PIXI.Sprite(App.Handle.currentGame.getViewerResource("box_bgline.png").texture )
        cardDeco2.position.set(-5,300+50);
        this.addChild(cardDeco1,cardDeco2);

        for( const card of this.mCards ){
            this.addChild( card );
        }

        this.mCorrectSound = App.Handle.currentGame.getViewerResource("rm_sfx_3.mp3").sound;
        this.mWrongSound = App.Handle.currentGame.getViewerResource("rm_sfx_4.mp3").sound;
    }

    makeWordQuiz( correctWord: string ): SelectSide{
        const spr = this.mCards[0];
        this.mCards[0].init();
        this.mCards[1].init();

        this.mCards[0].isCorrect = true;
        this.mCards[1].isCorrect = false;
        
        this.mCards[0].setText( correctWord );
        this.mCards[1].setBarricate();
        
        shuffleArray( this.mCards );
        
        this.mCards[0].position.set( 350, 300);
        this.mCards[1].position.set( 1280-350, 300);

        if( this.mCards[0] == spr ){
            return SelectSide.left;
        }else{
            return SelectSide.right;
        }
    }

    makeImageQuiz( correctImageTexture: PIXI.Texture, wrongImageTexture: PIXI.Texture ){
        const spr = this.mCards[0];
        this.mCards[0].init();
        this.mCards[1].init();
        this.mCards[0].isCorrect = true;
        this.mCards[1].isCorrect = false;

        this.mCards[0].setImage( correctImageTexture );
        this.mCards[1].setImage( wrongImageTexture );
        
        shuffleArray( this.mCards );
        
        this.mCards[0].position.set( 350, 300);
        this.mCards[1].position.set( 1280-350, 300);

        if( this.mCards[0] == spr ){
            return SelectSide.left;
        }else{
            return SelectSide.right;
        }
    }
    makeFullTextQuiz( correctWord: string, wrongWord: string ): SelectSide{
        const spr = this.mCards[0];
        this.mCards[0].init();
        this.mCards[1].init();

        this.mCards[0].isCorrect = true;
        this.mCards[1].isCorrect = false;
        
        this.mCards[0].setText( correctWord );
        this.mCards[1].setText( wrongWord );
        
        shuffleArray( this.mCards );
        
        this.mCards[0].position.set( 350, 300);
        this.mCards[1].position.set( 1280-350, 300);

        if( this.mCards[0] == spr ){
            return SelectSide.left;
        }else{
            return SelectSide.right;
        }
    }
    show(){
        
        this.visible = true;
        this.alpha = 0;
        gsap.to( this, {alpha:1, duration:0.5} )
        .eventCallback("onComplete",()=>{
            this.mCards[0].interactive = true;
            this.mCards[1].interactive = true;
        })
    }

    close(): Promise<void>{
        return new Promise<void>( (resolve, reject)=>{
            this.mCards[0].interactive = false;
            this.mCards[1].interactive = false;
            gsap.to( this, {alpha:0, duration:0.5} )
            .eventCallback("onComplete",()=>{
                gsap.delayedCall( 1, ()=>resolve())
                this.visible=false
            });
        })
        
    }

    selectAnswer( card: QuizCard): boolean{
        this.mCards[0].interactive = false;
        this.mCards[1].interactive = false;        
        this.onSelectAnswer( 
            card == this.mCards[0]?SelectSide.left:SelectSide.right,
            card.isCorrect
        );
        if(card.isCorrect){
            this.mCorrectSound.play();
            return true;
        }else{
            this.mWrongSound.play();
            return false;
        }
    }
    onSelectAnswer( selectSide: SelectSide, isCorrect: boolean ){
        //
    }
}
