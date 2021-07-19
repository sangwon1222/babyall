import TouchGame from '../index'
import { App } from '@/Activity/Core';
import { Card } from './Card';
import { gsap } from 'gsap';
import { LevelData } from '../Define';
import { Activity } from '../Scene/Activity';


export class CardGroup extends PIXI.Container {

    private mLevelData: LevelData;
	private mCard: Array<Card>; //한장을 자른 슬라이스 배열
	private mCurrentStep: number; //슬라이스 인덱스
	private mTotalStep: number;
	private mActiveCardIDX: Array<number>;
	private mActiveCardStepIDX: number;
	private mPassMove: gsap.core.Tween;
	private mScaleMove: gsap.core.Tween;
	private mYMove: gsap.core.Tween;
	private mCorrectBGM: PIXI.sound.Sound;
	private mWrongBGM: PIXI.sound.Sound;
	private mStudyBGM: PIXI.sound.Sound;
	private symbolText = 'A'
	private allowClick: boolean;

	constructor( quizIDX: number, levelData: LevelData ) {
        super();
        
        this.mLevelData = levelData;

		this.mCorrectBGM = App.Handle.currentGame.getResource("at_sfx_1.mp3").sound;
		this.mWrongBGM = App.Handle.currentGame.getResource("at_sfx_2.mp3").sound;
		
		this.symbolText = App.Handle.appData.symbol.toLowerCase();
		
		let sndIDX = 0;
		if( quizIDX == 1 || quizIDX == 3 ) sndIDX = 0;
		else if( quizIDX == 2 ) sndIDX = 1;
		else if( quizIDX == 4 ) sndIDX = 2;
		const sndPath = (App.Handle.currentGame as TouchGame).soundList[sndIDX];
		this.mStudyBGM = App.Handle.currentGame.getProductResource(`${sndPath}`).sound;

		this.mCard = [];
		this.mCurrentStep = 0; // 몇번째 슬라이스부터 시작인지
		this.mTotalStep = this.mLevelData.sliceCount;
		this.mActiveCardIDX = [];
		this.mActiveCardStepIDX = 0;

		// 카드 나열
		let y = 0;
		for (let i = 0; i < this.mTotalStep; i++) {
			const height = 556 / this.mTotalStep;
			const card = new Card(
				height,
				i,
				this.mLevelData.moveSpeed,
				App.Handle.currentGame.getProductResource(`que_${this.symbolText}${quizIDX}.png`).texture.baseTexture
			);
			this.addChild(card);
			card.anchor.set(0.5)

			this.mCard.push(card);
			card.y = y + 45;
			y += 556 / this.mLevelData.sliceCount;
		}
		this.hitArea = new PIXI.Rectangle(-800 / 2, -70, 800, 700);
		this.interactive = true;
		this.buttonMode = true;

		//HITAREA
		// const debug = new PIXI.Graphics();
		// debug.lineStyle(2, 0xff0000, 1);
		// debug.drawRect(-(800 / 2), -70, 800, 700);
		// this.addChild(debug);
		
		// 클릭 영역 라인 + 통과범위
		// const passScore = 100;
		// const debug = new PIXI.Graphics();
		// debug.lineStyle(2, 0xff0000, 1);
		// debug.drawRect(-(473 + passScore) / 2, 0, 473 + passScore, 556);
		// this.addChild(debug);
		// 클릭 영역 라인 + GREAT범위
		// const greatScore = 30;
		// const debug1 = new PIXI.Graphics();
		// debug1.lineStyle(2, 0xfa00ff, 1);
		// debug1.drawRect(-(473 + greatScore) / 2, 0, 473 + greatScore, 556);
		// this.addChild(debug1);

		// 카드 클릭시 이벤트
		// const firstStart = true;
		this.allowClick = false;
		gsap.delayedCall(1, () => {
			this.allowClick = true;
		});
		this.on("pointerdown", () => {
			if (this.allowClick) {
				this.checkPlay()
				gsap.delayedCall(1, () => { this.allowClick = true;})
			} else {return}
		});
		
	}
	// 카드 선제시
	async fixPlay(){
		const CardIDX = [1, 2, 3, 4];
		const cnt = 4 - this.mLevelData.firstFix //레벨값;
		for (let i = 0; i < cnt; i++) {
			const rpos = Math.floor(Math.random() * CardIDX.length);
			this.mActiveCardIDX.push(CardIDX[rpos]);
			CardIDX.splice(rpos, 1);
		}
		this.mActiveCardIDX.sort();
		for (let i = 0; i < CardIDX.length; i++) {
			await this.mCard[CardIDX[i]].fix();
		}

		// 기본 고정 카드
		await this.mCard[0].fix();
		await this.mCard[this.mTotalStep - 1].fix();
	}
	// 통과시 애니메이션
	GreatPlay() {
		this.mCorrectBGM.play();
		const PassIMT = new PIXI.Sprite(App.Handle.currentGame.getResource("stamp_great.png").texture);
		this.addChild(PassIMT);
		PassIMT.width = 150;
		PassIMT.height = 150;
		PassIMT.anchor.set(0.5);
		PassIMT.scale.set(0);
		PassIMT.x = -200 + (Math.ceil(Math.random() * 2) * 100);
		PassIMT.y = 520 - (Math.ceil(Math.random() * 5) * 100);
		this.mPassMove = gsap.to(PassIMT.scale, {
			visible: true,
			set: 1.5,
			duration: 0.8,
			ease: "bounce",
			onComplete: () => {
				PassIMT.visible = false;
			},
		});
	}
	GoodPlay() {
		this.mCorrectBGM.play();
		const PassIMT = new PIXI.Sprite(App.Handle.currentGame.getResource("stamp_good.png").texture)
		this.addChild(PassIMT);
		PassIMT.width = 150;
		PassIMT.height = 150;
		PassIMT.anchor.set(0.5);
		PassIMT.scale.set(0);
		PassIMT.x = -200 + (Math.ceil(Math.random() * 2) * 100);
		PassIMT.y = 520 - (Math.ceil(Math.random() * 5) * 100);
		this.mPassMove = gsap.to(PassIMT.scale, {
			set: 1.5,
			visible: true,
			duration: 0.8,
			ease: "bounce",
			onComplete: () => {
				PassIMT.visible = false;
			},
		});
	}
	// 실패시 애니메이션
	BadPlay() {
		this.mWrongBGM.play();
		const BadIMT = new PIXI.Sprite(App.Handle.currentGame.getResource("stamp_wrong.png").texture)
		this.addChild(BadIMT);
		BadIMT.width = 150;
		BadIMT.height = 150;
		BadIMT.anchor.set(0.5);
		BadIMT.x = -200 + (Math.ceil(Math.random() * 2) * 100);
		BadIMT.y = 520 - (Math.ceil(Math.random() * 5) * 100);  /*80~520*/
		BadIMT.scale.set(0);
		this.mPassMove = gsap.to(BadIMT.scale, {
			visible: true,
			set: 1.5,
			duration: 0.8,
			ease: "bounce",
			onComplete: () => {
				BadIMT.visible = false;
			},
		});
	}
	// 카드 통과시 다음단계에 대한 체크
	checkPlay() {
		if (this.mActiveCardStepIDX ==4){
			this.allowClick =false;
		}else {
			this.allowClick =false;
			this.mCurrentStep = this.mActiveCardIDX[this.mActiveCardStepIDX];
			const passScore = this.mCard[this.mCurrentStep].x
			const result = this.mCard[this.mCurrentStep].stop();
			// result = true;
			if (result === true) {
				if (passScore < 15 && passScore > - 15) {
					this.GreatPlay();
				} else {
					this.GoodPlay();
				}
				this.allowClick =false;
				this.onNextStep();
			} else {
				Activity.Handle.wrongCount += 1;
				this.BadPlay();
			}
		}

	}
	async onStartPlay() {
		await this.fixPlay();
		this.mCurrentStep = this.mActiveCardIDX[this.mActiveCardStepIDX];
		gsap.delayedCall(0.5,()=>{
			this.mCard[this.mCurrentStep].start();
			const startSound = App.Handle.currentGame.getResource(`at_sfx_3.mp3`).sound;
			startSound.play();
		})
	}
	// 카드 통과시 다음 단계
	onNextStep() {
		this.mActiveCardStepIDX += 1;

		if (this.mActiveCardStepIDX < this.mActiveCardIDX.length) {
			gsap.delayedCall(1, () => {
				this.mCard[this.mActiveCardIDX[this.mActiveCardStepIDX]].start();
				this.allowClick = true;
			})
		} else {
			// 끝
			this.certify();
		}
	}
	//카드 재조합 후 엔드장면 // 확대
	endScale() {
		this.allowClick =false;
		this.mScaleMove = gsap.fromTo(this.scale, { set: 1 },
			{ set: 1.2, duration: 2, ease: 'bounce' });
		this.mYMove = gsap.to(this.position,
			{ y: 30, duration: 0.1, ease: 'none' });
		this.mScaleMove.seek(1.2);
		this.mScaleMove.play();
		this.mYMove.play();
		gsap.delayedCall(0.5, () => {
			this.mStudyBGM.play();
		});
		gsap.delayedCall(2.5, () => {
			this.mStudyBGM.play();
		});
		gsap.delayedCall(3.5, () => {
			gsap.to(this.position,{y:-700,duration:0.5})
		});
	}
	// 카드 재조합 후 엔드
	certify() {
		this.allowClick =false;
		for (let i = 0; i < 6; i++) {
			this.mCard[i].miniGameEnd(1);
		}
		gsap.delayedCall(2, () => {
			this.endScale();
		});
		gsap.delayedCall(6, () => {
			this.onEnd();
		});
	}
	onEnd() {
		// 
	}
	onNext() {
		// 
	}
}
