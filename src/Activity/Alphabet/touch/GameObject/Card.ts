import * as PIXI from "pixi.js";
import gsap from "gsap";
import { App } from "../../../Core";
import { CardGroup } from './CardGroup';

export class Card extends PIXI.Sprite {
	private mMoveTween: gsap.core.Tween;
	private mEndTween: gsap.core.Tween;
	private misOK: boolean;
	private moveSpeed: number;
	private mAllowClick: boolean;
	
	get allowClick(): boolean { return this.mAllowClick }
	//  CARD SIZE :556,473
	constructor(
		height = 100,
		currentStep = 0,
		speed = 1,
		cardTexture: PIXI.BaseTexture
	) {
		super();
		
		this.misOK = false;
		this.mAllowClick = true;

		const SlicedCard = new PIXI.Texture(
			cardTexture,
			new PIXI.Rectangle(0, height * currentStep, 473, height)
		);

		// 카드 모션
		this.texture = SlicedCard;
		this.anchor.x = 0.5;
		this.x = -800;
		this.mMoveTween = gsap.to( this.position, {x: 200, duration: speed*2, ease: "none" });
		this.mMoveTween.eventCallback( 'onComplete',()=>{
			this.mMoveTween = gsap.to( this.position, {x: -200, duration: speed, ease: "none" })
			this.mMoveTween.repeat(-1);
			this.mMoveTween.yoyo(true);	
		})
		this.mMoveTween.pause();
		this.visible = false;
	}
	miniGameEnd(delay = 1) {
		//  한문제 풀었을때 모션 / 카드 합쳐지는 모션
		
		gsap.to(this.position, {
			x: 0,
			duration: 0.5,
			ease: "none"
		})
		.delay(delay);
		this.visible = true;

		console.log("end");
	}
	fix(): Promise<void>{
		return new Promise<void>((resolve,reject)=>{
			this.x = 0;
			this.visible = true;
			this.alpha=0;
			this.scale.set(0.8)
			gsap.to(this.scale,{x:1,y:1,duration:0.3})
			gsap.to(this,{alpha:1,duration:0.3})
			.eventCallback("onComplete",()=>{resolve();})
		})
		
	}
	// 카드 모션 시작
	start() {
		this.visible = true;
		this.mMoveTween.play()
	}
	// 카드 통과영역 테스트
	isOK() {
		return this.misOK;
	}
	// 카드 통과영역 통과
	stop(): boolean {
		console.log(this.mAllowClick)
		if (this.x >= -50 && this.x <= 50) {
			this.mMoveTween.pause();
			this.misOK = true;
			return true;
		} else {
			this.mMoveTween.pause()
			gsap.delayedCall(1, () => {
				this.mMoveTween.play()
			})
			this.misOK = false;
			return false;
		}
	}
}
