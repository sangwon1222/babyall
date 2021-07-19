import gsap from "gsap";
import { App } from "../../../Core";

import { QuizTypeBase } from "./QuizTypeBase";

import { Choice2Side } from "./Choice2Side";
import { SoundButton } from "./SoundButton";
import { ChoiceSide } from "./Choice2Side";
import { ResultMark } from "./ResultMark";
import { CardBG } from "./CardBG";

export class QuizType1 extends QuizTypeBase {
  private mChoice: Choice2Side;
  private mSoundButton: SoundButton;
  private mResultMark: ResultMark;
  private mCardBG: CardBG;
  private mCorrectSide: ChoiceSide;

  constructor(quizIDX: number) {
    super();

    const bookID = App.Handle.appData.bookID;
    this.setBackground(`sq_bg1.png`);

    /**sq_bg1.png => OX 화면 * sq_bg2.png => 양면 화면 * sq_bg3.png => 파란줄무늬 화면 */
    this.mChoice = new Choice2Side(quizIDX);
    this.mChoice.onResult = async (isCorrect: boolean) => {
        // console.log(`%c 사운드반복 끝`, "color:red;font-weight:bold;");
        this.mSoundButton.repeatSound(false, this.mCardBG);

        console.log("onResult ", isCorrect);
        if (isCorrect == false) {  this.wrongCount += 1;  }
        this.mSoundButton.clickLock(true);
        await this.mResultMark.show(isCorrect ,this.mSoundButton.soundDuration);
        //다음문제로 넘어간다.
        this.endQuiz();
    };
    this.addChild(this.mChoice);

    this.mCardBG = new CardBG();
    this.mCardBG.interactive = true;
    this.mCardBG.position.set( (1280 / 2)+4 , 720 / 2);

    this.addChild(this.mCardBG);
    const img = new PIXI.Sprite(
      App.Handle.currentGame.getProductResource(`sq_${bookID}_${quizIDX}.png`).texture);
    img.anchor.set(0.5);
    this.mCardBG.addToSlot(img);
    if (Math.random() > 0.5) {
      this.mCorrectSide = ChoiceSide.left;
    } else {
      this.mCorrectSide = ChoiceSide.right;
    }
    if(quizIDX!=3){
      this.mChoice.addToLeftSlot(new PIXI.Sprite(App.Handle.currentGame.getResource(`o.png`).texture)  )
      this.mChoice.addToRightSlot(new PIXI.Sprite(App.Handle.currentGame.getResource(`x.png`).texture)  )
    }

    let soundFname = `sq_${bookID}_${quizIDX}_1.mp3`;
    if (this.mCorrectSide == ChoiceSide.right) {
      soundFname = `sq_${bookID}_${quizIDX}_2.mp3`;
    }

    this.mSoundButton = new SoundButton(
      App.Handle.currentGame.getProductResource(soundFname).sound
    );
    this.mSoundButton.position.set(1280 / 2, 100);
    this.mSoundButton.clickLock(true);
    this.addChild(this.mSoundButton);

    this.mResultMark = new ResultMark();
    this.mResultMark.position.set(1280 / 2, 720 / 2);
    this.addChild(this.mResultMark);
  }

  async onStart() {
    // this.mSoundButton.repeatSound();
    this.mSoundButton.repeatSound(true, this.mCardBG);

    await this.mCardBG.show();
    this.mChoice.start(this.mCorrectSide);
  }
}
