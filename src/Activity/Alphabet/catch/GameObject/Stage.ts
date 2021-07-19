import * as PIXI from "pixi.js"
import { Mole } from './Mole';

import { gsap } from 'gsap'
import { Hammer } from './Hammer';
import { LevelData } from '../Define';



function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// 게임 두더지들을 Group하는 게임 메인 클래스
export class Stage extends PIXI.Container{
    static debugMode = false;

    private mQuizSymbolText: string;
    private mThemeIDX: number;
    private mMoles: Array<Mole>;
    private mMolesAnchor: PIXI.Container;
    private mHammer: Hammer;
    private mSize: PIXI.Point;
    private mIsTurnEnd: boolean;

    private mCheckManagingT = 1;            // 해당 초마다 등장 두더지를 체크
    private mActiveCountOnce = 3;           // 등장 콜에 나오는 두더지수
    private mActiveCountLimit = 6;          // 최대등장할수 있는 되는 두더지수
    private mMoleHoldSec = 1;               // 작동시 두더지가 오픈되어 머무르는 시간.(초)
    private mActiveMoles: Array<Mole>;      // 턴마다 작동시키는 두더지 모음
    
    private mQuizList: Array<number>;      // 두더지가 받게될 퀴즈 인덱스( 1,2,3,4 ) 1:대문자 2:소문자 3:오답1 4:오답2
    private mQuizStepIDX: number;
    // 전체 두더지 개수
    constructor( symbol: string, themeIDX: number, levelData: LevelData ){
        super();

        this.mCheckManagingT = levelData.appearTiming;
        this.mActiveCountOnce = levelData.activeCountOnce;
        this.mActiveCountLimit = levelData.activeCountLimit;
        this.mMoleHoldSec = levelData.moleHoldDelay;

        this.mIsTurnEnd =  true;
        this.mQuizSymbolText = symbol;
        this.mThemeIDX = themeIDX;
        this.mMoles = [];
        this.mMolesAnchor = null;
        this.mHammer = null;
        this.mSize = new PIXI.Point( 0,0 );

        this.mQuizList=[];

        this._createMoles( levelData.holeCount );
        this._createHammer();
    }

    private _createHammer(){
        this.mHammer = new Hammer();
        this.addChild( this.mHammer );
    }
    // 두더지를 생성한다. 가로 최대 3개로 해서 생성.
    private _createMoles( count: number ){
        this.mMoles = [];
        this.mMolesAnchor = new PIXI.Container();
        this.addChild( this.mMolesAnchor );
        
        const rowCount = Math.ceil( count / 3 );

        let x = 0;
        let y = 0;
        
        let cnt = 0;
        let mole: Mole = null;
        for( let i=0; i<rowCount; i++){
            x = 0;
            for( let j =0; j<3; j++){
                if( cnt < count ){
                    mole = new Mole(this.mQuizSymbolText, this.mThemeIDX, this.mMoleHoldSec );
                    mole.on("fail",( arg )=>{ this.onFail(arg) }, mole);
                    mole.on("success",( arg )=>{ this.onSuccess(arg) }, mole);
                    this.mMoles.push( mole );
                    mole.position.set( x,y );
                    this.mMolesAnchor.addChild( mole );
                    cnt += 1;    
                    x += mole.width + mole.marginX;
                }
            }
            y += mole.height+mole.marginY;
        }
        this.mSize.set( x-mole.marginX, y-mole.marginY );
        this.mMolesAnchor.pivot.set( this.mSize.x/2, this.mSize.y/2 );
        

        if( Stage.debugMode ){
            // 클릭 영역 시각화
            const debug = new PIXI.Graphics();
            debug.lineStyle(2, 0x00FFFF, 1);
            debug.drawRect(0, 0, this.mSize.x, this.mSize.y);
            this.mMolesAnchor.addChild(debug);

            // 중심 표시
            const debugCenter = new PIXI.Graphics();
            debugCenter.lineStyle(2, 0xFFFF00, 1);
            debugCenter.moveTo( 0, -10 );
            debugCenter.lineTo( 0, 10);
            debugCenter.moveTo( -10, 0 );
            debugCenter.lineTo( 10, 0);
            this.addChild(debugCenter);
        }
        
    }

    ready(){
        for( const mole of this.mMoles ){
            mole.readyForStart();
        }
    }
    start( stepIDX: number){
        this.mQuizStepIDX = stepIDX;
        this.mIsTurnEnd = false;
        this._activeMole();
        
        //this.addListener()
        //퀴즈를 맞출때까지 두더지등장.
        //this.startTurn();
    }

    private _activeMole(){
        while( this.mQuizList.length < this.mMoles.length ){
            const temp = [1,2,3,4];
            shuffle( temp );
            this.mQuizList = this.mQuizList.concat( temp );
        }
        // 두더지 리스트를 섞는다.
        shuffle( this.mMoles );
        
        let activeCnt = 0;
        for( const mole of this.mMoles ){
            if( !mole.isReady() ){ activeCnt +=1;}
        }
        
        if( activeCnt < this.mActiveCountLimit ){
            let chk = this.mActiveCountOnce;
            for( const mole of this.mMoles ){
                if( chk>0 && mole.isReady() ){
                    const idx = this.mQuizList.shift();
                    let isAnswer = false;
                    if( this.mQuizStepIDX == 1 || this.mQuizStepIDX == 3 ){
                        isAnswer = idx==1;
                    }
                    if( this.mQuizStepIDX == 2 || this.mQuizStepIDX == 4 ){
                        isAnswer = idx==2;
                    }
                    mole.start( idx, isAnswer );
                    chk -=1;
                }
            }    
        }
        
        gsap.delayedCall( this.mCheckManagingT, ()=>{
            if( this.mIsTurnEnd == false ) this._activeMole();
        })
    }

    
    // 정답 두더지를 클릭한 경우 호출
    onSuccess( mole: Mole ){
        this.mIsTurnEnd = true;
        this.mHammer.position.set( 
            mole.position.x - this.mSize.x/2, 
            mole.position.y - this.mSize.y/2
            );
        this.mHammer.success();
        // 정답뺀 나머지 두더지들은 다 들어가라..
        for( const mole of this.mMoles ){ mole.stop( );}
        
        // 애니가 끝나고 부모(stage)에 콜백호출
        this.emit("success" );
    }

    // 정답 아닌 두더지를 클릭한 경우 호출
    onFail( mole: Mole ){
        this.mHammer.position.set( 
            mole.position.x - this.mSize.x/2, 
            mole.position.y - this.mSize.y/2
            );
        this.mHammer.fail();
        // 정답뺀 나머지 두더지들은 다 들어가라..
        for( const mole of this.mMoles ){ mole.stop( );}
        // 애니가 끝나고 호출
        gsap.delayedCall( 3, ()=>{
            this.emit("fail" );
        });
    }    
}
