import { PlayMode, PlayLevel, ParentInfo, ChildSetting } from './Define'


const childSetting: ChildSetting={
    lrngChoLvlCd: PlayLevel.easy,
    lrngModeCd : PlayMode.free,
    // playPosbTime : 0,
    playPosbTime : 100,
    isNonLimitToPlay: true
} 
// 최초 접속시의 homeData
const homeData = {
    storybookInfo: {
        bookID: 1001,
        bookTitle: "1-1",
        currentAcvt: "movie",
        cpltAcvtCnt: 0,
    },
    alphabetInfo: {
        symbol: 'A'
    },
    mypetInfo: {
        recievedPet: false
    },
    userInfo: {
        acornCnt: 120,
        childNm: "테스트",
        profileUrl: "img/user-thumb.png",
        birthDay: "20161222",
        cpltBookCnt: 5,
        playPosbTime: 30,
        lrngModeCd: PlayMode.free,
        lrngChoLvlCd: PlayLevel.easy
    }
}

// 알파벳 완료 정보
const alphabetSaveData = {
    a: {isLocked:false}, b: {isLocked:false}, c: {isLocked:false}, d: {isLocked:false},
    e: {isLocked:false}, f: {isLocked:false}, g: {isLocked:false}, h: {isLocked:false},
    i: {isLocked:false}, j: {isLocked:false}, k: {isLocked:false}, l: {isLocked:false},
    m: {isLocked:false}, n: {isLocked:true}, o: {isLocked:true}, p: {isLocked:true},
    q: {isLocked:true}, r: {isLocked:true}, s: {isLocked:true}, t: {isLocked:true},
    u: {isLocked:true}, v: {isLocked:true}, w: {isLocked:true}, x: {isLocked:true},
    y: {isLocked:true}, z: {isLocked:true},
}

// 마이룸 벳지 데이터
const badgeData = {
    1001: { rcvdBadgeLv1Date: '2020.01.01', rcvdBadgeLv2Date: null, rcvdBadgeLv3Date:null },
    1002: null,
    1003: null,
    1004: null,
    1005: null,
    1006: null,
    1007: null,
    1008: null,
    1009: null,
    1010: null,
    1011: null,
    1012: null,
    1013: null,
    1014: null,
    1015: null,
    1016: null,
    1017: null,
    1018: null,
    1019: null,
    1020: null,

    2001: null,
    2002: null,
    2003: null,
    2004: null,
    2005: null,
    2006: null,
    2007: null,
    2008: null,
    2009: null,
    2010: null,
    2011: null,
    2012: null,
    2013: null,
    2014: null,
    2015: null,
    2016: null,
}

// 스토리 북
const storybookFinishInfo={
    // 1001:{
    //     bookID: 1001,
    //     cpltAcvtCnt: 3,
    //     currentAcvt: "movie",
    //     isLocked: false,
    // },
    // 1002:{
    //     bookID: 1002,
    //     cpltAcvtCnt: 6,
    //     currentAcvt: "match",
    //     isLocked: false,
    // },
}
// parentSetup SlotData
const parentActReportSlotData: ParentInfo.ActSlotReport = {
    storybook:{
        existNew: false,
        lv1: [
            // {
            //     createdDate: "1111-01-10",
            //     cpltBookList: [1001,1002,1003,1004],
            //     lrngSttcSeqno: 1
            // },
            // {
            //     createdDate: "2020-01-10",
            //     cpltBookList: [1005,1006,1007,1008],
            //     lrngSttcSeqno: 2
            // }
        ],
        lv2: [
            // {
            //     createdDate: "2222-02-20",
            //     cpltBookList: [1001,1002,1003,1004],
            //     lrngSttcSeqno: 3
            // },
        ],
        lv3: []
    },
    alphabet:{
        existNew: false,
        lv1: [
            // {
            //     createdDate: "XXXX-XX-XX",      // 생성날짜
            //     cpltType: 0,                    // 완료 목록 0:A-M, 1:N-Z
            //     lrngSttcSeqno: 11,              // 해당슬롯 인덱스키
            // },
            // {
            //     createdDate: "YYYY-YY-YY",          
            //     cpltType: 1,                        
            //     lrngSttcSeqno: 12,          
            // }
        ],
        lv2: [
            // {
            //     createdDate: "XXXX-XX-XX",      // 생성날짜
            //     cpltType: 0,                    // 완료 목록 0:A-M, 1:N-Z
            //     lrngSttcSeqno: 11,              // 해당슬롯 인덱스키
            // },
        ],
        lv3: [
            // {
            //     createdDate: "YYYY-YY-YY",          
            //     cpltType: 1,                        
            //     lrngSttcSeqno: 12,          
            // }
        ]
    }
}

// parentSetup  종합요약
const parentActSummaryReport: ParentInfo.ActSummaryReport = {
    lrngTime: 0,
    avgLrngTime: 0,
    lrngActTcnt: 0,
    acornCnt: 0,
    
    lrngWrdEcnt: 0,
    lrngXprsEcnt: 0,
    lrngAcvtEcnt: 0,
    lrngQstPrcsEcnt: 0,

    mdaLsngTcnt: 0,
    mdaPtkEcnt: [0,0],

    sttcByLvl:{                     // 레벨별 정보
        lv1: null,
        lv2: null,
        lv3: null
    }
}

// parentSetup  스토리북 상세
const parentDetailSB: ParentInfo.DetailReportSB ={
    sttcCreDate: "",
    childAge: 0,
    childNm: "--",
    cpltBookList:[],
    asesByArea: [
        {
            acvtMsmtNm: '어휘',         // 측정 라벨명 (어휘, 듣기, 읽기, 말하기)
            acvtMsmtScore: 0,      // 자녀 액티비티 측정 점수
            acvtMsmtAvgScore: 0   // 액티비티 측정 평균 점수
        },
        {
            acvtMsmtNm: '듣기',  
            acvtMsmtScore: 0,   
            acvtMsmtAvgScore: 0 
        },
        {
            acvtMsmtNm: '읽기',  
            acvtMsmtScore: 0,   
            acvtMsmtAvgScore: 0 
        },
        {
            acvtMsmtNm: '말하기',
            acvtMsmtScore: 0,   
            acvtMsmtAvgScore: 0 
        },
    ],
    AM009: {
        avgScore : 0,
        AM009001: {
            msmtScore: 0,
            asesCtt: "어휘 영역 / 철자 설명."
        },
        AM009002: {
            msmtScore: 0,
            asesCtt: "어휘 영역 / 음절 설명.",
        }
    },
    AM010: {
        avgScore: 0,
        AM010001: {      
            msmtScore: 0,
            asesCtt: "듣기 영역 / 소리와 의미연결 설명."
        },
        AM010002: {    
            msmtScore: 0,
            asesCtt: "듣기 영역 / 이해력 설명."
        }
    },
    AM011: {                        
        avgScore: 0,
        AM011001: {      
            msmtScore: 0,
            asesCtt: "읽기 영역 / 문자 인지 설명."
        },
        AM011002: {      
            msmtScore: 0,
            asesCtt: "읽기 영역 / 이해력 설명."
        }
    },
    AM012: {                         
        avgScore: 0,
        AM012001: {    
            msmtScore: 0,
            asesCtt: "말하기 영역 / 맥락 이래 설명."
        },
        AM012002: {   
            msmtScore: 0,
            asesCtt: "말하기 영역 / 대화 설명."
        }
    },
    dtlAsesInfo: [
        {
            bookID: 1001,     // 책번호
            bookTitle: "1-1 Body",  // 책 이름
            progressRate: [20,30,25,25], // 영역 퍼센트[4]
            progressValue: [20,30,25,25], // 영역 값 라벨[4]
            total: {                // 종합평점
                score: 30.24,      // 퍼센트
                grade: "C",      // 등급
            },
            cntntUndstdg: 60,       // 내용 이해
            quizCorrectRate: 38,    // 퀴즈 정답률(%)
            lrngWords: [
                'feet','arms'
            ],   // 학습 어휘 
        },
        {
            bookID: 1002,     // 책번호
            bookTitle: "1-2 나도몰라",  // 책 이름
            progressRate: [10,40,20,30], // 영역 퍼센트[4]
            progressValue: [20,30,25,25], // 영역 값 라벨[4]
            total: {                // 종합평점
                score: 0,      // 퍼센트
                grade: "A",      // 등급
            },
            cntntUndstdg: 60,       // 내용 이해
            quizCorrectRate: 38,    // 퀴즈 정답률(%)
            lrngWords: [

            ],   // 학습 어휘 
        },
        {
            bookID: 1003,     // 책번호
            bookTitle: "1-3 이거도",  // 책 이름
            progressRate: [5,20,50,25], // 영역 퍼센트[4]
            progressValue: [20,30,25,25], // 영역 값 라벨[4]
            total: {                // 종합평점
                score: 0,      // 퍼센트
                grade: "B",      // 등급
            },
            cntntUndstdg: 60,       // 내용 이해
            quizCorrectRate: 38,    // 퀴즈 정답률(%)
            lrngWords: [

            ],   // 학습 어휘 
        },
        {
            bookID: 1004,     // 책번호
            bookTitle: "1-4 흠..",  // 책 이름
            progressRate: [0,0,0,0], // 영역 퍼센트[4]
            progressValue: [20,30,25,25], // 영역 값 라벨[4]
            total: {                // 종합평점
                score: 0,      // 퍼센트
                grade: "C",      // 등급
            },
            cntntUndstdg: 60,       // 내용 이해
            quizCorrectRate: 38,    // 퀴즈 정답률(%)
            lrngWords: [

            ],   // 학습 어휘 
        }

    ],
    xpndIntllctlTalent:{
        AM013001:{ asesCtt:"확장이해 설명",score:[10,20,30,40] },
        AM014001:{ asesCtt:"객체 조립 설명",score:[20,30,40,50] },
        AM015001:{ asesCtt:"정보 파악 설명",score:[30,40,50,60] },
    },
}

// parentSetup  알파벳 상세
const parentDetailAL: ParentInfo.DetailReportAL ={
    sttcCreDate: "",
    childAge: 0,
    childNm: "--",
    alphabetStep:0,
    asesByArea: [
        {
            acvtMsmtNm: '대표단어',         // 측정 라벨명 (어휘, 듣기, 읽기, 말하기)
            acvtMsmtScore: 10,          // 자녀 액티비티 측정 점수
            acvtMsmtAvgScore: 50        // 액티비티 측정 평균 점수
        },
        {
            acvtMsmtNm: '글자',  
            acvtMsmtScore: 20,   
            acvtMsmtAvgScore: 50 
        },
        {
            acvtMsmtNm: '평균',  
            acvtMsmtScore: 30,   
            acvtMsmtAvgScore: 50 
        },
        {
            acvtMsmtNm: '쓰기',
            acvtMsmtScore: 40,   
            acvtMsmtAvgScore: 50 
        },
    ],
    // 알파벳 글자 영역
    AM001: {
        avgScore : 10,                          // 알파벳 글자 영역 평균 점수
        progressRate: [10,90],                  // 영역 퍼센트[2]( 동그란그래프 퍼센트 )
        AM001001: {                             // 모양 인지
            msmtScore: 10,                      // 측정점수( 동그란그래프 1번표시값)
            asesCtt: "모양 인지 평가."           // 평가내용
        },
        AM001002: {                              // 대소문자 구분 
            msmtScore: 20,                        // 측정점수 ( 동그란그래프 2번표시값)
            asesCtt: "대소문자 구분  평가.",      // 평가내용
        },
        total: {                            // 종합 내용
            score: 10,                       // 종합 평점 퍼센트
            grade: "A",                     // 등급
            notCompleted: ["a"]    // 미완성 글자
        }
    },
    AM002: {                                    // 알파벳 듣기 및 읽기 영역
        avgScore: 20,
        progressRate: [20,80],
        AM002001: {      
            msmtScore: 30,
            asesCtt: "소리와 글자연결 평가."
        },
        AM002002: {    
            msmtScore: 40,
            asesCtt: "글자와 소리 연결 평가."
        },
        total: {                            // 종합 내용
            score: 20,                       // 퍼센트
            grade: "B",                     // 등급
            notCompleted: ["a","b"]    // 미완성 글자
        }
    },
    AM003: {                                    // 알파벳 쓰기 영역
        avgScore: 30,
        progressRate: [30,70],
        AM003001: {      
            msmtScore: 50,
            asesCtt: "대문자 쓰기 이해 평가."
        },
        AM003002: {      
            msmtScore: 60,
            asesCtt: "소문자 쓰기 이해 평가."
        },
        total: {                            // 종합 내용
            score: 30,                       // 퍼센트
            grade: "C",                     // 등급
            notCompleted: ["a","b","c"]    // 미완성 글자
        }
    },
    AM004: {                                    // 대표 단어 인지 영역
        avgScore: 40,
        progressRate: [40,60],
        AM004001: {    
            msmtScore: 70,
            asesCtt: "대표 단어 글자인지 평가."
        },
        AM004002: {   
            msmtScore: 80,
            asesCtt: "대표 단어 의미 이해 평가."
        },
        total: {                            // 종합 내용
            score: 40,                       // 퍼센트
            grade: "D",                     // 등급
            notCompleted: ["a","b","c","d"]    // 미완성 글자
        }
    },
    xpndIntllctlTalent:{                    // 확장 지적재능
        AM005001:{ 
            asesCtt:"정보이해 설명",         // 설명
            msmtScore:10,                   // 값
            avgScore:80 },                  // 평균값
        AM006001:{ asesCtt:"객체조립 설명",msmtScore:20, avgScore:80 },
        AM007001:{ asesCtt:"공통성파악 설명",msmtScore:30, avgScore:80 },
        AM008001:{ asesCtt:"수용어휘 설명",msmtScore:40, avgScore:80 },
    },
}

export default {
    childSetting,

    alphabetSaveData,   
    homeData,
    badgeData,
    storybookFinishInfo,

    parentActReportSlotData,
    parentActSummaryReport,
    parentDetailSB,
    parentDetailAL,
}