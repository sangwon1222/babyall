export interface LevelData {
    exemple: number; // 보기 선제시
    exempleSize: number; //  보기 사이즈
    writeStep: number; //   쓰기 차례
    // viewStep: number; //   쓰기 순서 보기
    writeDirection: number; //   쓰기 방향
    mixIncorrect: number; //   오답 섞기 /상->오답2/중->오답1/하->오답X

    imageList: { [sampleString: string]: string };
  }

  export interface QuizDataTypeBase{
    type: number;
    guide: string;
    lines: Array<string>;
    correct: Array<string>;
    wrong: Array<string>;
    picture: Array<string>;
    sound: string;
  }

  export interface QuizDataType1 extends QuizDataTypeBase{
    guide: string;
    lines: Array<string>;
    correct: Array<string>;
    wrong: Array<string>;
    sound: string;
}
export interface QuizDataType2 extends QuizDataTypeBase {
    lines: Array<string>;
    correct: Array<string>;
    wrong: Array<string>;
    picture: Array<string>;
    sound: string;
}

  