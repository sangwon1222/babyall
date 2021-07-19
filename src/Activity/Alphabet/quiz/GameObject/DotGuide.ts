import { AnswerSection } from "./QuizType2";

export class DotGuide extends PIXI.Graphics {
  // 타입이 스파인이나 이미지로 바뀔 가능성이 크다.
  private mID: number;
  private mEndID: number;
  constructor(ID: number, endID: number, x: number, y: number) {
    super();
    this.mID = ID;
    this.mEndID = endID;
    this.beginFill(0x000000, 1);
    this.drawCircle(x, y, 5);
    this.endFill();

    this.interactive = true;
    this.buttonMode = true;

    if (this.mID == 0) {
      this.on("mousedown", () => {
        // (this.parent.parent as AnswerSection).markFlag = true;
      });
    }
    if (this.mID == this.mEndID) {
      this.on("mouseup", () => {
        // (this.parent.parent as AnswerSection).markFlag = false;
      });
    }
  }
}
