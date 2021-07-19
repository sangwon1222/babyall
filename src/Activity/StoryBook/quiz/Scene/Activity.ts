import { SceneBase, App } from '../../../Core';

import { QuizTypeBase } from '../GameObject/QuizTypeBase';
import { QuizType1 } from '../GameObject/QuizType1'
import { QuizType2 } from '../GameObject/QuizType2'
import { QuizType3 } from '../GameObject/QuizType3'
import { QuizType4 } from '../GameObject/QuizType4'

import Game, { SBQuizData } from '../index';
import PIXISound from 'pixi-sound'
import { UserModule } from '@/store/UserStore';
import { StoryBooksModule } from '@/store/StoryBooks';
import gsap from 'gsap';

import Config from "../../../../Util/Config"
import { SystemModule } from '@/store/System';

export class Activity extends SceneBase{
    private mCurrentGameIDX: number;
    private mQuizPlayer: Array<QuizTypeBase> 
    private mWrongCount: number

    get currentQuiz() { return this.mQuizPlayer[this.mCurrentGameIDX] }
    get quizData(): SBQuizData{ return (this.game as Game).quizData }

    constructor(){
        super();
        this.mCurrentGameIDX = 0;
        this.mWrongCount= 0;
        this.mQuizPlayer = [];
    }

    async onInit(){
        PIXISound.stopAll();
        // console.log( this.quizData );
        
        let quiz5Text = this.quizData.quiz5Lv2;
        let quiz5Example = this.quizData.quiz5ExampleLv2;
        if( App.Handle.appData.level == 1 ){
            quiz5Text = this.quizData.quiz5Lv1;
            quiz5Example = this.quizData.quiz5ExampleLv1;
        }
        this.mQuizPlayer = [
            new QuizType1( 1 ),
            new QuizType1( 2 ),
            new QuizType2( 3, this.quizData.quiz3 ),
            new QuizType3( 4, this.quizData.quiz4 ),
            new QuizType4( 5, this.quizData.quiz5Answer, quiz5Text, quiz5Example  ),
        ]
        
        this.addChild(this.mQuizPlayer[this.mCurrentGameIDX])
        
        await this.game.endLoadingScreen();

        // 레디 연출. 연출이 끝나면 시작
        await this.game.startReadyScreen(-1,"sb_quiz");
        
        this.start();
    }

    onStart(){
        // const BGM = ResourceManager.Handle.getProductResource(`${App.Handle.appData.bookID}_bgm.mp3`).sound
        // BGM.play({loop:true})
        
        console.log(`총 ${this.mQuizPlayer.length}개의 게임중 현재 ${this.mCurrentGameIDX+1}번째 게임을 진행중입니다.`)
        this.currentQuiz.onStart();
        window.onkeyup=(evt)=>{
            if( evt.key=="+" ){
                App.Handle.nextGame();
                window.onkeyup = null;
            }
        }
    }

    async onEnd() {
        // 서버로 학습결과를 전송
        if( Config.excuteMode == "main" && SystemModule.token!=""){
    
            const quizResult = [false,false,false,false,false]
            for(let i=0; i< this.mCurrentGameIDX; i++){
                // this.mQuizPlayer[i].wrongCount
                if( this.mQuizPlayer[i].wrongCount >0){
                    quizResult[i] = true;
                }
                console.log(`${i}번째 오답수 => [ ${this.mQuizPlayer[i].wrongCount}]`)
                this.mWrongCount += this.mQuizPlayer[i].wrongCount
            }
            console.warn(`틀린갯수 =>[${this.mWrongCount}]`)
            console.log("스토리 퀴즈 끝", 
                this.game.gameName,
                App.Handle.appData.bookID,
                UserModule.childSetting.lrngChoLvlCd,
                quizResult
            );
            
            StoryBooksModule.setActivityEnd({
                activity: this.game.gameName,
                endinfo:{
                    bookID: App.Handle.appData.bookID,
                    lrngChoLvlCd: UserModule.childSetting.lrngChoLvlCd,       
                    // complete: true,      // 무비, 메이킹북
                    //wrongCount: this.mWrongCount,     // 캐치,터치,매치,스팟파인더
                    quizResult: quizResult//퀴즈[5]
                }
            })

        }else{
            console.warn("스토리퀴즈 학습결과를 전송하지 않습니다.")
        }
        
        PIXISound.stopAll();
        gsap.globalTimeline.clear();
        await this.game.startEOPScreen(1,true);
        
        //성과를 저장
    }

    onNextGame(){
        this.mCurrentGameIDX+=1;
        
        if(this.mQuizPlayer[this.mCurrentGameIDX] == undefined){
            App.Handle.nextGame();
            return;
        }
        console.log(`총 ${this.mQuizPlayer.length}개의 게임중 현재 ${this.mCurrentGameIDX+1}번째 게임을 진행중입니다.`)

        this.removeChildren();
        this.addChild( this.mQuizPlayer[this.mCurrentGameIDX] )
        this.mQuizPlayer[this.mCurrentGameIDX].onStart();
    }
}