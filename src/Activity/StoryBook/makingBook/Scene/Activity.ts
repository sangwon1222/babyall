import { SceneBase, App } from '../../../Core';
import { Stage } from '../GameObject/Stage';
import gsap from 'gsap'
import PIXISound from 'pixi-sound'
import { UserModule } from '@/store/UserStore';
import { StoryBooksModule } from '@/store/StoryBooks';

import Config from "../../../../Util/Config"
import { SystemModule } from '@/store/System';


export class Activity extends SceneBase{

    private mStage: Stage;
    private mBGM: PIXI.sound.Sound;

    constructor(){
        super()
        this.mBGM = App.Handle.currentGame.getResource(`mb_bgm.mp3`).sound;

        this.mStage = new Stage();
    }
    async onInit(){
        
        this.addChild(this.mStage)
        await this.game.endLoadingScreen();
        // 레디 연출. 연출이 끝나면 시작
        await this.game.startReadyScreen(-1,"sb_makingbook");
        
        this.start();
    }

    onStart(){
        PIXISound.stopAll();
        this.mBGM.play({loop:true})
        window.onkeyup=(evt)=>{
            if( evt.key=="+" ){
                App.Handle.nextGame();
                window.onkeyup = null;
            }
        }
    }

    async onEnd(){
        // 서버로 학습결과를 전송
        if( Config.excuteMode == "main" && SystemModule.token!=""){

            console.log("스토리 메이킹북 끝", 
                this.game.gameName,
                App.Handle.appData.bookID,
                UserModule.childSetting.lrngChoLvlCd,
                
            );
            StoryBooksModule.setActivityEnd({
                activity: this.game.gameName,
                endinfo:{
                    bookID: App.Handle.appData.bookID,
                    lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,       
                    complete: true,      // 무비, 메이킹북
                    // wrongCount?: number;     // 캐치,터치,매치,스팟파인더
                    // quizResult?: Array<boolean>[5]; //퀴즈
                }
            })
            
        }else{
            console.warn("스토리 메이킹북 학습결과를 전송하지 않습니다.")
        }
        PIXISound.stopAll();
        gsap.globalTimeline.clear();
        await this.game.startEOPScreen(0,true);
    }

}