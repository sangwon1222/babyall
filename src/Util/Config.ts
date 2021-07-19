const devMode = false;
// 상용 false
// 개발 true

export default {
  devMode: devMode,
  //restAPI:"http://localhost:2244/restAPI/",
  // restAPI: "http://www.imestudy.co.kr:2244/restAPI",
  restAPIProd: devMode
    ? "https://qa-api.arambookclub.com"
    : "https://api.arambookclub.com",
  // ? "https://tobe-qa-user-api.arambookclub.com"
  // ? "https://dev-api.arambookclub.com"

  // restAPIProd: "https://qa-api.arambookclub.com",

  packageURL: "https://contents.arambookclub.com/contents",

  // "main" , "saleskit"
  excuteMode: "main",
  platform: "",
  platformText: "",

  bookList: {
    step1: [
      1001,
      1002,
      1003,
      1004,
      1005,
      1006,
      1007,
      1008,
      1009,
      1010,
      1011,
      1012,
      1013,
      1014,
      1015,
      1016,
      1017,
      1018,
      1019,
      1020,
    ],
    step2: [
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      2012,
      2013,
      2014,
      2015,
      2016,
    ],
  },

  storyBookList: {
    category: [
      "Movie",
      "Catch",
      "Touch",
      "Match",
      "Finder",
      "Quiz",
      "MakingBook",
    ],
    label: [
      "Story Movie",
      "Story Catch",
      "Listening Touch",
      "Reading Match",
      "Spot Finder",
      "Story Quiz",
      "MakingBook",
    ],
  },

  babyTubeList: {
    category: [
      "1001_body_bed720p.mp4",
      "1002_family_daddy720p.mp4",
      "1003_song_solo720p.mp4",
      "1004_furniture_play720p.mp4",
      "1005_clothes_daddy720p.mp4",
      "1006_song_solo720p.mp4",
    ],
    label: [
      "BabyTime Story",
      "Daddy`s Story",
      "PlayTime Story",
      "BabyAll Song",
      "BabyTime Story",
      "BabyTime Story",
    ],
  },

  alphabetList: {
    category: ["Catch", "Match", "Touch", "block", "Quiz"],
    label: [
      "Alphabet Catch",
      "Alphabet Match",
      "Alphabet Touch",
      "Alphabet block",
      "Alphabet Quiz",
    ],
  },
};
