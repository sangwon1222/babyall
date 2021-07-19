
// 유저 학습 설정정보
// export interface UserInfo{
//     isFirstPlay: boolean;
//     uid: string;
//     level: PlayLevel;
//     mode: PlayMode;
//     playAvailMinutes: number;

//     coin: number;
// }

// 하우투 최초 진입시 정보 요청
export namespace HowTo{
    export interface HowToData{
        storybooks: {
            movie: boolean;
            catch: boolean;
            touch: boolean;
            match: boolean;
            finder: boolean;
            quiz: boolean;
            makingbook: boolean;
        };
        alphabet: {
            catch: boolean;
            match: boolean;
            touch: boolean;
            block: boolean;
            quiz: boolean;
        };
    }
}

// 유저info by JWT
export interface UserInfoJWT{
    childAge: number;
    childId: string; //"MC-51735821592813658"
    childName: string; //"아람"
    childThumbnail: string; //"https://cdn.smartdoodle.net/member/user/child/profile/202006/1592987172006779.jpg"
    exp: number; //1594091937
    iat: number; //1593487137
    sub: string; //"childToken"
}

//------------------------------------------------------
// 자녀설정
//------------------------------------------------------

// 플레이 모드
export enum PlayMode{
    free="LM02",    // 탐험가
    step="LM01",    // 과학자
}

// 학습 선택레벨
export enum PlayLevel{
    easy="LC01",
    normal="LC02",
    hard="LC03",
}

// 자녀설정
export interface ChildSetting{
    lrngChoLvlCd: PlayLevel;  //레벨
    lrngModeCd: PlayMode;  // 진행모드
    playPosbTime: number;  // 사용시간(분) -1무제한
    isNonLimitToPlay: boolean;
}

//------------------------------------------------------
// Home
//------------------------------------------------------
export namespace Home {
    // storybookInfo
    export interface HomeDataSB{    
        bookID: number;         // 북아이디
        bookTitle: string;      // 해당 북타이틀
        currentAcvt: string;        // 시작할 액티비티
        cpltAcvtCnt: number;    // 완료 액티비티수(완료 별표시용)
    }
    // alphabetInfo 
    export interface HomeDataAL{    
        symbol: string;         // 알파벳 심볼
    }
    // mypetInfo 
    export interface HomeDataMyPet{     
        recievedPet: boolean;         // 마이펫 받은 지 여부
    }
    // userInfo 
    export interface HomeDataUserInfo{
        acornCnt: number;           // 보유 도토리 개수
        childNm: string;            // 유저 이름
        profileUrl: string;         // 프로필 사진
        birthDay: string;           // 생년월일
        cpltBookCnt: number;        // 완독 도서수
        playPosbTime: number;       // 잔여 플레이 시간 : number( 분 )
        lrngModeCd: PlayMode;       // 플레이 모드
        lrngChoLvlCd: PlayLevel;    //선택 레벨
    }

    export interface HomeData{
        storybookInfo: HomeDataSB;
        alphabetInfo: HomeDataAL;
        mypetInfo: HomeDataMyPet;
        userInfo: HomeDataUserInfo;
    }

    export interface Birth{
        name: string;
        birthday: string;
    }
}

//----------------------------------------
// My Room
//----------------------------------------

export namespace MyRoom{
    export interface BadgeInfo{
        rcvdBadgeLv1Date: string;   // 배지lv1 받은날짜
        rcvdBadgeLv2Date: string;   // 배지lv2 받은날짜
        rcvdBadgeLv3Date: string;   // 배지lv3 받은날짜
    }

    export interface BadgeData{
        [bookID: number]: BadgeInfo;
    }

    // 메이킹북 Array<string>  : urls..
    // 마이펫 Array<string>  : urls..
}

//----------------------------------------
// My Pet
//----------------------------------------

export namespace MyPet{
    export interface ScreenShotData{
        screenShot: Blob;
    }
}

//----------------------------------------
// Story Books
//----------------------------------------
export namespace Storybooks{
    // 책별 완료 정보
    export interface FinishResultInfo{
        bookID: number;
        cpltAcvtCnt: number;        // 완료한 액티비티수, 0이면 무비를 최초실행하는 것임
        currentAcvt: string;        // 시작할 액티비티
        isLocked: boolean;          // 잠금여부
    }
    export interface FinishResultInfoData{ 
        [bookID: string]: FinishResultInfo; 
    }

    // 액티비티 종료 정보 request
    export interface EndActivityInfo{
        bookID: number;
        lrngChoLvlCd: PlayLevel;       
        complete?: boolean;      // 무비, 메이킹북
        wrongCount?: number;     // 캐치,터치,매치,스팟파인더
        quizResult?: Array<boolean>; //퀴즈 [5]
        
    }

    // 액티비티 종료 반환 response
    export interface EndActivityResponse{
        cpltAcvtCnt: number;        // 해당 책의 액티비티 완료 개수
        acornCnt: number;           // 획득 도토리 개수가 반영된 총 보유 도토리 개수
    }

    // 메이킹북 스샷 저장
    export interface ScreenShotData{
        screenShot: Blob;
    }
}
//----------------------------------------
// Alphabet School
//----------------------------------------
export namespace Alphabet{
    // 완료 정보
    export interface FinishResultInfo{
        isLocked: boolean;          // 잠금여부
    }
    export interface FinishResultInfoData{ 
        [symbol: string]: FinishResultInfo;
    }
    // 액티비티 종료 정보
    export interface EndActivityInfo{
        symbol: string;         // 시작하는 알파벳 심볼
        lrngChoLvlCd: PlayLevel;
        wrongCount?: number;    // 캐치, 터치, 블록
        completeTime?: number;   // 매치(초),
        quizResult?: Array<boolean>;  //퀴즈(오답여부, 정답일때 false로 채움 )[5]
        
    }

    export interface EndActivityResponse{
        acornCnt: number;           // 획득 도토리 개수가 반영된 총 보유 도토리 개수
    }
}

//----------------------------------------
// 부모화면
//----------------------------------------
export namespace ParentInfo{
    
    // @활동 리포트 스토리북스,알파벳 슬롯정보 요청 Response
    export interface SBReportSlot{
        createdDate: string;            // 생성날짜
        cpltBookList: Array<number>;    // 완료 책목록[4]
        lrngSttcSeqno: number;          // 해당슬롯 인덱스키
    }
    export interface ALReportSlot{
        createdDate: string;            // 생성날짜
        cpltType: number;       // 완료 목록[2] 0:A-M, 1:N-Z
        lrngSttcSeqno: number;          // 해당슬롯 인덱스키
    }
    export interface ActReportSB{
        existNew: boolean;      // New가 존재하나요?
        lv1: Array<SBReportSlot>;
        lv2: Array<SBReportSlot>;
        lv3: Array<SBReportSlot>;
    }
    export interface ActReportAL{
        existNew: boolean;      // New가 존재하나요?
        lv1: Array<ALReportSlot>;
        lv2: Array<ALReportSlot>;
        lv3: Array<ALReportSlot>;
    }

    export interface ActSlotReport{
        storybook: ActReportSB;
        alphabet: ActReportAL;
    }

    //=============================
    // @활동 리포트 종합요약요청
    export interface ActSummaryLevelInfo{
        progressRate?: number;                // 진도율( 퍼센트 )
        childAchvmnts?: number;              // 평균 성취도/자녀
        avgAchvmnts?: number;                // 평균 성취도/평균
        storybookProgress?: Array<number>;    // 진도/ 스토리북스[2]
        alphabetProgress?: Array<number>;     // 진도/ 알파벳스쿨[2]
        wrdAchvmnts?: Array<number>;         // 성취/ 단어 [2]
        xprsAchvmnts?: Array<number>;        // 성취/ 표현[2]
    }

    export interface ActSummaryReport{
        lrngTime: number;           // 활동누적/학습 시간(분)
        avgLrngTime: number;        // 활동누적/평균 학습시간(분)
        lrngActTcnt: number;        // 활동누적/활동 횟수
        acornCnt: number;           // 활동누적/현재 보유 도토리수

        lrngWrdEcnt: number;        // 학습누적/접한 단어 :  number(개수),
        lrngXprsEcnt: number;       // 학습누적/접한 표현 :  number(개수),
        lrngAcvtEcnt: number;       // 학습누적/액티비티 :  number(개수),
        lrngQstPrcsEcnt: number;    // 학습누적/푼문제수 :  number(개수),

        mdaLsngTcnt: number;        // 학습누적/미디어청취 :  number(개수),
        mdaPtkEcnt: Array<number>;  // 학습누적/미디어활용 :  number[2](개수),

        sttcByLvl: {                     // 레벨별 정보
            lv1: ActSummaryLevelInfo | null; 
            lv2: ActSummaryLevelInfo | null; 
            lv3: ActSummaryLevelInfo | null; 
        };
    }
    
    //=============================
    // @스토리 북스 상세 리포트 요청 
    // request
    export interface DetailReportSBReq{
        lrngSttcSeqno: number;      // 해당슬롯 인덱스키
    }

    // 영역평가 정보
    export interface AreaCheckInfo{
        acvtMsmtNm: string;         // 측정 라벨명 (어휘, 듣기, 읽기, 말하기)
        acvtMsmtScore: number;      // 자녀 액티비티 측정 점수
        acvtMsmtAvgScore: number;   // 액티비티 측정 평균 점수
    }

    export interface BookReportDetail{
        bookID: number;     // 책번호
        bookTitle: string;  // 책 이름
        progressRate: Array<number>; // 영역 퍼센트[4]
        progressValue: Array<number>; // 영역 값 라벨[4]
        total: {                // 종합평점
            score: number;      // 퍼센트
            grade: string;      // 등급
        };
        cntntUndstdg: number;       // 내용 이해
        quizCorrectRate: number;    // 퀴즈 정답률(%)
        lrngWords: Array<string>;   // 학습 어휘 
    }

    // 확장 지적재능
    export interface SBTalentInfo{       
        asesCtt: string;    // 설명
        score: Array<number>;  // 값
    }
    export interface SBTalentInfoSet{       
        AM013001: SBTalentInfo;           // 확장이해
        AM014001: SBTalentInfo;           // 객체조립
        AM015001: SBTalentInfo;           // 정보 파악
    }

    // response
    export interface DetailReportSB{
        sttcCreDate: string;            // 발행일
        childAge: number;               // 나이
        childNm: string;                // 이름
        cpltBookList: Array<number>;    // 읽은 책아이디[4]
        asesByArea: Array<AreaCheckInfo>;   //영역평가 정보[4];
        
        // 어휘 영역
        AM009: {
            avgScore: number;          // 어휘 영역 평균 점수
            AM009001: {                 // 철자/음절
                msmtScore: number;      // 측정점수
                asesCtt: string;        // 평가내용 
            };
            AM009002: {                 // 의미
                msmtScore: number;      // 측정점수
                asesCtt: string;        // 평가내용
            };
        };
        
        // 듣기 영역
        AM010: {
            avgScore: number;           // 듣기 영역 평균 점수
            AM010001: {                 // 소리와 의미 연결
                msmtScore: number;      // 측정점수
                asesCtt: string;        // 평가내용
            };
            AM010002: {                 // 이해력
                msmtScore: number;      // 측정점수
                asesCtt: string;        // 평가내용
            };
        };
        // 읽기 영역
        AM011: {                        
            avgScore: number;           // 읽기 영역 평균 점수
            AM011001: {                 // 문자 인지
                msmtScore: number;      // 측정점수
                asesCtt: string;        // 평가내용
            };
            AM011002: {                 // 이해력
                msmtScore: number;      // 측정점수
                asesCtt: string;        // 평가내용
            };
        };
        // 말하기 영역
        AM012: {                         
            avgScore: number;           // 말하기 영역 평균 점수
            AM012001: {                 // 맥락 이해
                msmtScore: number;      // 측정점수
                asesCtt: string;        // 평가내용
            };
            AM012002: {                 // 대화 응답
                msmtScore: number;      // 측정점수
                asesCtt: string;        // 평가내용
            };
        };

        // 책별 상세정보
        dtlAsesInfo: Array<BookReportDetail>; // [4]
        xpndIntllctlTalent: SBTalentInfoSet; 
    }


    //=============================
    // @ 알파벳스쿨 상세 리포트 요청 
    // request
    export interface DetailReportALReq{
        lrngSttcSeqno: number;      // 해당슬롯 인덱스키
    }
    
    // response
    export interface DetailReportAL{
        sttcCreDate: string;            // 발행일
        childAge: number;               // 나이
        childNm: string;                // 이름
        alphabetStep: number;          // 배운알파벳: number( 1: a~m, 2:n~z);
        
        asesByArea: Array<AreaCheckInfo>;   //영역평가 정보[4];
        
        // 알파벳 글자 영역
        AM001: {
            avgScore: number;               // 알파벳 글자 영역 평균 점수
            progressRate: Array<number>;    // 영역 퍼센트[2]
            AM001001: {                     // 모양 인지
                msmtScore: number;          // 측정점수
                asesCtt: string;            // 평가내용 
            };
            AM001002: {                     // 대소문자 구분 
                msmtScore: number;          // 측정점수
                asesCtt: string;            // 평가내용
            };
            total: {                            // 종합 내용
                score: number;                  // 퍼센트
                grade: string;                  // 등급
                notCompleted: Array<string>;    // 미완성 글자
            };
        };
        
        // 알파벳 듣기 및 읽기 영역
        AM002: {
            avgScore: number;               // 알파벳 듣기 및 읽기 영역 평균 점수
            progressRate: Array<number>;    // 영역 퍼센트[2]
            AM002001: {                     //  소리와 글자(의미)연결
                msmtScore: number;          // 측정점수
                asesCtt: string;            // 평가내용
            };
            AM002002: {                     // 글자와 소리 연결
                msmtScore: number;      // 측정점수
                asesCtt: string;        // 평가내용
            };
            total: {                            // 종합 내용
                score: number;                  // 퍼센트
                grade: string;                  // 등급
                notCompleted: Array<string>;    // 미완성 듣기/읽기
            };
        };

        // 알파벳 쓰기 영역
        AM003: {
            avgScore: number;               // 알파벳 쓰기  영역 평균 점수
            progressRate: Array<number>;    // 영역 퍼센트[2]
            AM003001: {                     // 대문자 쓰기 이해
                msmtScore: number;          // 측정점수
                asesCtt: string;            // 평가내용
            };
            AM003002: {                     // 소문자 쓰기 이해
                msmtScore: number;          // 측정점수
                asesCtt: string;            // 평가내용
            };
            total: {                            // 종합 내용
                score: number;                  // 퍼센트
                grade: string;                  // 등급
                notCompleted: Array<string>;    // 미완성 쓰기
            };
        };
        // 대표 단어 인지 영역
        AM004: {
            avgScore: number;               // 대표 단어 인지 영역 평균 점수
            progressRate: Array<number>;    // 영역 퍼센트[2]
            AM004001: {                     // 대표 단어 글자 인지
                msmtScore: number;          // 측정점수
                asesCtt: string;            // 평가내용
            };
            AM004002: {                     // 대표 단어 의미 이해
                msmtScore: number;          // 측정점수
                asesCtt: string;            // 평가내용
            };
            total: {                            // 종합 내용
                score: number;                  // 퍼센트
                grade: string;                  // 등급
                notCompleted: Array<string>;    // 미완성 단어
            };
        };

        // 확장 지적재능
        xpndIntllctlTalent: {       
            AM005001: {              // 정보이해
                msmtScore: number;  // 값
                avgScore: number;   // 평균값
                asesCtt: string;    // 설명
            };
            AM006001: {              // 객체조립
                msmtScore: number;  // 값
                avgScore: number;   // 평균값
                asesCtt: string;     // 설명
            };
            AM007001: {              // 공통성 파악
                msmtScore: number;  // 값
                avgScore: number;   // 평균값
                asesCtt: string;    // 설명
            };
            AM008001: {              // 수용어휘
                msmtScore: number;  // 값
                avgScore: number;   // 평균값
                asesCtt: string;    // 설명
            };
        };
    }

    //============================
    // @도토리 충전
    export interface AcornChargeReq{
        acornChargeCnt: number; // 충전값
    }
    export interface AcornChargeResponse{
        acornCnt: number; // 결과 보유개수
    }
}

export const API={
    //[유저 이름/생일]
    user:{
        res: "/learning/child/birthday"
    },
    // [ 홈화면 ]
    home:{
        // <@자녀설정>
        settings:{
            req:"/learning/child/settings", // (POST) /learning/child/settings
            res:"/learning/child/settings", // (GET) /learning/child/settings
        },
        // <@학습창 진입시 최초 필요정보>
        recent:{
            req:"/learning/child/recent",   // (GET) /learning/child/recent
        },
    },
    // [ 마이룸 ]
    myRoom:{
        
        // <@ 배지정보 요청>
        badge:{
            req:'/learning/child/myroom/badge', //(GET) /learning/child/myroom/badge
        },
        // <@ 메이킹북 결과물 요청>
        makingbook:{
            req:'/learning/child/myroom/makingbook',    //(GET) /learning/child/myroom/makingbook
        },
        // <@ 앨범(마이펫) 결과물 요청>
        myPet:{
            req:'/learning/child/myroom/album'      //(GET) /learning/child/myroom/album
        },
    },
    // [ 마이펫 ]
    myPet:{
        //<@마이펫 최초 받기 처리>
        recieved:{
            req:'/learning/child/mypet'
        },
        //<@마이펫 스샷 저장>
        screenShot:{
            req:'/learning/child/mypet/screenshot',//(POST) /learning/child/mypet/screenshot
        }
    },
    //[ 스토리북스 ]
    storybooks:{
        //<@ 모든 책의 완료정보 목록>
        finishList:{
            req:'/learning/child/storybook',//(GET) /learning/child/storybook
        },
        getFinishInfo:{
            req:'/learning/child/storybook/',//(GET) /learning/child/storybook/{bookID}
        },
        
        //<@액티비티 종료 > 
        endActivity:{
            req: '/learning/child/storybook',//( POST ) / learning / child /{{ content }}/{{ activity }}, ex : / learning / child / storybook / quiz
        },
        //<@메이킹북 스샷 저장 >
        makingBookScreenShot:{
            req:'/learning/child/storybook/screenshot',     //(POST) /learning/child/storybook/screenshot
        },        
    },
    //[ 알파벳 스쿨 ]
    alphabet:{
        //<@ 알파벳의 완료정보 목록>
        finishList:{
            req:'/learning/child/alphabet',//(GET) /learning/child/alphabet
        },
        //<@액티비티 종료 > 
        endActivity:{
            req: '/learning/child/alphabet',//( POST )/learning/child/{{content}}/{{activity}}      ex): /learning/child/alphabet/quiz
        },        
    },
    //[ 베이비 튜브 ]
    babytube:{
        // 동영상 목록 요청
        contentsList:{
            req:'/babytube/getContentsList',
        },
        // 즐겨찾기 처리
        favorites:{
            req:'/babytube/setFavorite',
        },
        //동영상 완료처리
        finish:{
            /*(POST) /babytube/complete
            request :  {
            "dtlBookSeqno": 1,
            "vidoCtgrCd": "VC03"
            }
            response : {
            "ok": true,
            "err": ""}
            */
           req: '/babytube/complete'
        }
    },
    //[ 부모화면  ]
    parent:{
        // 활동영상 목록
        movie:{
            req:'/learning/parents/usablevideo', //(POST)
        },
        favorites:{
            req:'/learning/parents/usablevideo/favorite', //(POST)
        },
        //< @활동 리포트 스토리북스,알파벳 슬롯정보 요청 >
        slotdata:{
            req:'/learning/parents/report/slots', //(GET) /learning/parents/report/slots
        },
        // < @활동 리포트 종합요약요청 > 
        summary:{
            req: '/learning/parents/report/summary', //(GET) /learning/parents/report/summary
        },
        // < @스토리북스 상세 리포트 요청 >
        detailSB:{
            req: '/learning/parents/report/storybook', //(GET) /learning/parents/report/storybook/{{lrngSttcSeqno}}, lrngSttcSeqno 값은 <@활동리포트 스토리북스, 알파벳 슬롯정보 요청> 에서 response 값으로 드립니다.
        },
        // < @알파벳스쿨 상세 리포트 요청 >
        detailAL:{
            req: '/learning/parents/report/alphabet', //(GET) /learning/parents/report/alphabet/{{lrngSttcSeqno}},  lrngSttcSeqno 값은 <@활동리포트 스토리북스, 알파벳 슬롯정보 요청> 에서 response 값으로 드립니다.
        },
        // < @도토리 충전 >
        chargeAcorn:{
            req:'/learning/parents/charge/acorn', //(POST) /learning/parents/charge/acorn
        },        
        // < @잔여플레이시간 설정시간으로 리셋 하기 >
        resetTime:{
            req:'/learning/parents/reset/time', //(POST) 
        },
        // < @잔여플레이시간 업데이트 하기 >
        updateRemainTime:{
            req:'/learning/child/time/remained', //(POST) 
        },
        // @학습(플레이) 시간 업데이트 하기
        updatePlayTime:{
            req:'/learning/child/time/learned', //(POST) request :  { learnedTime: 10 (number - seconds) }             
        },

    },
    babyall:{
        //<최초 진입 정보 요청>
        howto:{
            info:{
                res:"/learning/child/babyall/learned/activity",
            }
        }
    }
    
    
    
}












