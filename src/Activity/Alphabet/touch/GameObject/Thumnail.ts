import { App } from "@/Activity/Core";
import gsap from 'gsap';

export class Thumnail extends PIXI.Container {
  private mClearArray: Array<PIXI.Sprite>;
  private mCheckArray: Array<PIXI.Sprite>;
  private mBlurArray: Array<PIXI.Sprite>;
  private mShadowArray: Array<PIXI.Sprite>;

  constructor() {
    super();
    const symbolText = App.Handle.appData.symbol.toLowerCase();
    this.mClearArray = [];
    this.mCheckArray = [];
    this.mBlurArray = [];
    this.mShadowArray = [];
    
    let y=0;
    for (let i = 1; i < 5; i++) {
        const card = new PIXI.Sprite(App.Handle.currentGame.getResource(`memo.png`).texture);
        card.anchor.x=0.5;
        card.position.y = y*152
        this.addChild(card)
        
        const clear = new PIXI.Sprite(App.Handle.currentGame.getProductResource(`ex_${symbolText}${i}.png`).texture);
        clear.anchor.x=0.5;
        clear.alpha=0;
        card.addChild(clear);
        this.mClearArray.push(clear);

        const blur = new PIXI.Sprite(App.Handle.currentGame.getProductResource(`ex_${symbolText}${i}_focus.png`).texture);
        blur.anchor.x=0.5;
        blur.alpha=0;
        card.addChild(blur);
        this.mBlurArray.push(blur);

        const cardShadow = new PIXI.Sprite(App.Handle.currentGame.getResource(`memo_shadow.png`).texture);
        cardShadow.anchor.x=0.5;
        cardShadow.position.y = y*152;
        cardShadow.alpha=0.5;
        this.addChild(cardShadow)
        this.mShadowArray.push(cardShadow);

        const check = new PIXI.Sprite(App.Handle.currentGame.getResource(`check.png`).texture);
        check.position.set(-check.width/2 +58 ,check.height/2 -56)
        check.scale.set(1.2)
        check.alpha=0;
        card.addChild(check);
        this.mCheckArray.push(check);

        y+=1;
    }
  }

  ready(){
    for (let i = 0; i < this.mBlurArray.length; i++) {
        gsap.to(this.mBlurArray[i],{alpha:1,duration:1,delay:i/4})
    }
  }

  onCorrect(idx: number): Promise<void>{
      return new Promise<void>((resolve, reject)=>{
        gsap.to(this.mCheckArray[idx],{alpha:1,duration:0.5})
        gsap.to(this.mCheckArray[idx].scale,{x:1,y:1,duration:0.5})
        gsap.to(this.mBlurArray[idx],{alpha:0,duration:0.5})
        gsap.to(this.mShadowArray[idx],{alpha:0,duration:0.5})
        .eventCallback("onComplete",()=>{
            gsap.to(this.mClearArray[idx],{alpha:1,duration:0.5})
            .eventCallback("onComplete",()=>{resolve();})
        })
      })
  }
}
