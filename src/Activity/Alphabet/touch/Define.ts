export interface LevelData {
    sliceCount: number; //몇개로 쪼개질지 여부
    moveSpeed: number; //이동속도
    firstFix: number; //선제시 카드수
    /*
    {
      A:"a1.png"
      a:"a2.png"
      #:"a3.png"
      @:"a4.png"
    }
    */
    // imageList: { [sampleString: string]: string };
  }

  
  export interface GameStartArgument {
    level: number;
    userName: string;
    etc: any;
  }
  
  