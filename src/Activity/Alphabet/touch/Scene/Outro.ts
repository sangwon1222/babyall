import gsap from 'gsap'
import { App, GameBase, SceneBase } from "../../../Core";
import TouchGame from '../index'
import { Activity } from './';
import PIXISound from 'pixi-sound'
import { UserModule } from '@/store/UserStore';
import { AlphabetModule } from '@/store/Alphabet';


import Config from "../../../../Util/Config"
import { SystemModule } from '@/store/System';

export class Outro extends SceneBase {
    private symbolText = 'A'
    private mLeftPBox: PIXI.Container;
    private mRightPBox: PIXI.Container;
    private mCenterPBox: PIXI.Container;
    private mAffordance: PIXI.Container;
    
    constructor() {
        super();
    }

    async onInit() {
        this.start();
        console.error(`틀린갯수 => [${Activity.Handle.wrongCount}]`)
    }

    async onStart(){
        const bg = new PIXI.Sprite(this.game.getResource(`bg_wood.png`).texture);
        this.addChild(bg)
        this.mLeftPBox= new PIXI.Container();
        this.mRightPBox= new PIXI.Container();
        this.mCenterPBox= new PIXI.Container();

        this.mAffordance = new PIXI.Container();
        this.symbolText = App.Handle.appData.symbol.toLowerCase();

        this.createPeeKaBoo();
    }

    createPeeKaBoo() {
        
        let shadow = new PIXI.Sprite(this.game.getResource(`shadow_left.png`).texture)
        for (let i = 3; i > 0; i--) {
            const peeKa = new PIXI.Sprite(this.game.getProductResource(`complete_${this.symbolText}${i}.png`).texture)
            if(i==1){
                shadow = new PIXI.Sprite(this.game.getResource(`shadow_left.png`).texture)
                this.mLeftPBox.addChild(shadow,peeKa)
            }
            if(i==2){
                shadow = new PIXI.Sprite(this.game.getResource(`shadow_right.png`).texture);
                this.mRightPBox.addChild(shadow,peeKa)
            }
            if(i==3){
                shadow = new PIXI.Sprite(this.game.getResource(`shadow_center.png`).texture);
                this.mCenterPBox.addChild(shadow,peeKa)
            }
            shadow.y=15;
            shadow.anchor.set(0.5)
            peeKa.anchor.set(0.5)
        }

        this.mLeftPBox.position.set( (this.width/2)+22- (this.mLeftPBox.width/2) , 0 )
        this.mRightPBox.position.set( (this.width/2) + (this.mRightPBox.width/2)   , 0)
        this.mCenterPBox.position.set( (this.width/2) , 0)
        this.addChild(this.mCenterPBox,this.mRightPBox,this.mLeftPBox)
        // this.addChild(this.mCenterPBox)

        gsap.to(this.mLeftPBox , { y: 720/2 , duration: 1, ease: 'bounce' })
        gsap.to(this.mRightPBox , { y: 720/2, duration: 1, ease: 'bounce' })
        gsap.to(this.mCenterPBox , { y: 720/2, duration: 1, ease: 'bounce' })
        .eventCallback("onComplete",()=>{
            this.createAffordance();
        })
    }

    OpenPeeKaBoo(){
        gsap.to(this.mLeftPBox , {x: this.mLeftPBox.x - (this.mLeftPBox.width/2) , duration: 0.5})
        gsap.to(this.mRightPBox , {x: this.mRightPBox.x + (this.mRightPBox.width/2) , duration: 0.5})
    }

    onSound(){
        // 피카부 사운드 설정
        const openSound = App.Handle.currentGame.getViewerResource(`at_sfx_4.mp3`).sound;
        openSound.play();
        
        const soundTrack = [0,1,0,2]
        let SNDduration = 0
        for(let i=0; i< soundTrack.length; i++){
            const sndPath  = (App.Handle.currentGame as TouchGame).soundList[  soundTrack[i] ];
            const studySound = App.Handle.currentGame.getProductResource(`${sndPath}`).sound;
            if(i==2){SNDduration += studySound.duration+0.5}
            else{SNDduration += studySound.duration}
            gsap.delayedCall( SNDduration , () => {
                studySound.play();
                if(i==0){gsap.to(this.mLeftPBox.scale,{x:1.1,y:1.1,duration:studySound.duration/3}).yoyo(true).repeat(1)}
                if(i==1 || i==3){gsap.to(this.mCenterPBox.scale,{x:1.1,y:1.1,duration:studySound.duration/3}).yoyo(true).repeat(1)}
                if(i==2){gsap.to(this.mRightPBox.scale,{x:1.1,y:1.1,duration:studySound.duration/3}).yoyo(true).repeat(1)}
                /**다음 게임으로 ㄱㄱ */
                if(i == soundTrack.length -1 ){
                    gsap.delayedCall(studySound.duration,()=>{ App.Handle.nextGame();})
                }
            })
        }
    }

    createAffordance(){
        this.mAffordance = new PIXI.Container();
        this.mAffordance.alpha = 0;
        
        const fingerCircle = new PIXI.Sprite(this.game.getViewerResource("circle.png").texture);
        fingerCircle.position.set(0 ,0)
        fingerCircle.anchor.set(0.5)
        gsap.fromTo(fingerCircle.scale ,{x:1.4,y:1.4}, {x: 1 , y:1 , duration: 1}).yoyo(true).repeat(-1)
        this.mAffordance.addChild(fingerCircle)

        
        const finger = new PIXI.Sprite(this.game.getViewerResource("finger.png").texture);
        finger.anchor.set(0.5)
        finger.position.set(0 , 60)
        gsap.to(finger , {y: finger.y + 30 , duration: 1}).yoyo(true).repeat(-1)
        this.mAffordance.addChild(finger)
        
        this.addChild(this.mAffordance)
        this.mAffordance.position.set( this.width/2 , this.height/2)

        gsap.to(this.mAffordance,{alpha:1 , duration:0.5})

        this.mAffordance.interactive = true;
        this.mAffordance.buttonMode = true;
        this.mAffordance
        .on("pointertap",()=>{  
            this.mAffordance.interactive = false;
            this.mAffordance.buttonMode = false;
            gsap.to(this.mAffordance,{alpha:0 , duration: 1})
            this.OpenPeeKaBoo();
            this.onSound();  
        })
    }

    async onEnd() {
        // 서버로 학습결과를 전송
        if( Config.excuteMode == "main" && SystemModule.token!=""){
    
            console.log(" 알파벳 터치 종료",
                this.game.gameName,
                App.Handle.appData.symbol.toLowerCase(),
                UserModule.childSetting.lrngChoLvlCd,
                Activity.Handle.wrongCount
                );
            AlphabetModule.setActivityEnd({
                activity: this.game.gameName,
                endinfo: {
                    symbol: App.Handle.appData.symbol.toLowerCase(),         // 시작하는 알파벳 심볼
                    lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,
                    wrongCount: Activity.Handle.wrongCount
                } 
            });
        }else{
            console.warn("touch 학습결과를 전송하지 않습니다.")
        }
        
        PIXISound.stopAll();
        gsap.globalTimeline.clear();

        await this.game.startEOPScreen(1);
    }
}
