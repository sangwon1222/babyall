import { App } from "../../../Core";
import { Choice2Side } from "./Choice2Side";
import { QuizTypeBase } from "./QuizTypeBase";
import { NineSlicePlane } from "pixi.js";
import { SoundButton } from "./SoundButton";
import { ChoiceSide } from "./Choice2Side";
import { ResultMark } from "./ResultMark";
import { CardBG } from "./CardBG";
import { ChoiceCards } from "./ChoiceCards";

const TextStyle = new PIXI.TextStyle({
  fontFamily: "minigate",
  fontSize: 50,
  fontWeight: "bold",
  fill: "#000000",
});

export class WordBox extends PIXI.Container {
  private mBG: PIXI.NineSlicePlane;
  private mText: PIXI.Text;

  get text(): string {
    return this.mText.text;
  }
  set text(v: string) {
    this.mText.text = v;
    this.resetPos();
  }

  constructor() {
    super();
    this.mBG = new PIXI.NineSlicePlane( App.Handle.currentGame.getViewerResource("sq_text_box.png").texture, 50, 50, 50, 50 );
    this.mBG.height = 90;
    
    this.addChild( this.mBG );

    this.mText = new PIXI.Text( "", TextStyle );
    this.mText.anchor.set(0.5);
    this.mText.position.y = 40;
    this.mBG.addChild( this.mText );
  }
  resetPos(){
      this.mBG.width = this.mText.width+150;
      this.mBG.pivot.set( this.mBG.width/2, this.mBG.height/2);
      this.mText.x = this.mBG.width/2; 
  }
}

export class QuizType3 extends QuizTypeBase {
  private mWordBox: WordBox;
  private mSoundButton: SoundButton;
  private mResultMark: ResultMark;
  private mChoiceCards: ChoiceCards;

  constructor(quizIDX: number, quizText: string) {
    super();
    const bookID = App.Handle.appData.bookID;
    this.setBackground("sq_bg3.png");

    //카드 생성.
    this.mChoiceCards = new ChoiceCards();
    this.mChoiceCards.position.set(1280 / 2, 720/2 + 50);
    this.mChoiceCards.onResult = async (isCorrect: boolean) => {
        // console.log(`%c 사운드반복 끝`, "color:red;font-weight:bold;");
        this.mSoundButton.clickLock(true);
        this.mSoundButton.repeatSound(false);

        console.log("onResult ", isCorrect);
        if (isCorrect == false) {  this.wrongCount += 1; }
        await this.mResultMark.show(isCorrect ,this.mSoundButton.soundDuration);
      //다음문제로 넘어간다.
        this.endQuiz();
    };
    this.addChild(this.mChoiceCards);

    if (App.Handle.appData.level == 1) {
      // 레벨'하'라면, 카드2개 이후 레벨은 3개
      const card1 = new CardBG(quizIDX)
      card1.isCorrect = true;
      const img1 = new PIXI.Sprite( App.Handle.currentGame.getProductResource(`sq_${bookID}_5.png`).texture );
      img1.anchor.set(0.5);
      card1.addToSlot(img1);
      this.mChoiceCards.addCard(card1);
      const card2 = new CardBG(quizIDX)
      const img2 = new PIXI.Sprite( App.Handle.currentGame.getProductResource(`sq_${bookID}_6.png`).texture );
      img2.anchor.set(0.5);
      card2.addToSlot(img2);
      this.mChoiceCards.addCard(card2);
    } else {
      const card1 = new CardBG(quizIDX)
      card1.isCorrect = true;
      const img1 = new PIXI.Sprite(
        App.Handle.currentGame.getProductResource(`sq_${bookID}_5.png`).texture
      );
      img1.anchor.set(0.5);
      card1.addToSlot(img1);
      this.mChoiceCards.addCard(card1);

      const card2 = new CardBG(quizIDX)
      const img2 = new PIXI.Sprite(
        App.Handle.currentGame.getProductResource(`sq_${bookID}_6.png`).texture
      );
      img2.anchor.set(0.5);
      card2.addToSlot(img2);
      this.mChoiceCards.addCard(card2);

      const card3 = new CardBG(quizIDX)
      const img3 = new PIXI.Sprite(
        App.Handle.currentGame.getProductResource(`sq_${bookID}_7.png`).texture
      );
      img3.anchor.set(0.5);
      card3.addToSlot(img3);
      this.mChoiceCards.addCard(card3);
    }

    this.mWordBox = new WordBox();
    this.mWordBox.text = quizText;
    this.mWordBox.position.set(1280 / 2, 80);
    
    this.addChild(this.mWordBox);

    this.mSoundButton = new SoundButton(
      App.Handle.currentGame.getProductResource(
        `sq_${bookID}_${quizIDX}.mp3`
      ).sound
    );
    this.mSoundButton.position.set( - this.mWordBox.width/2-100, 0)
    this.mWordBox.addChild(this.mSoundButton);

    this.mResultMark = new ResultMark();
    this.mResultMark.position.set(1280 / 2, 720 / 2);
    this.addChild(this.mResultMark);
  }

  async onStart() {
    this.mSoundButton.repeatSound(true, this.mChoiceCards);
    await this.mChoiceCards.start();
    // this.mBackground.start( ChoiceSide.right );
  }
}
