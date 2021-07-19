import Vue from "vue";
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";

import store from "@/store";

import Swal from "sweetalert2";
import Axios from "axios";
import Util from "../Util";
import { UserInfoJWT, PlayLevel, PlayMode, Home, HowTo } from "./Define";
import DefaultData from "./DefaultData";

import { ChildSetting, API } from "./Define";
import { SystemModule } from "./System";
import { ParentSetupModule } from "./ParentSetup";
import { HowtoPopup } from "@/Activity/Core/Popup/MenuScreen";

//--------------------------------------------

@Module({
  namespaced: true,
  name: "user",
  dynamic: true,
  store,
})
class User extends VuexModule {
  //데모버젼용 선택 레벨
  private mDemoLevel = -1;
  get demoLevel() {
    return this.mDemoLevel;
  }
  @Mutation SetDemoLevel(v: number) {
    this.mDemoLevel = v;
  }

  //-----------------------------------------
  // 자녀설정
  private mChildSetting: ChildSetting = null;

  get childSetting(): ChildSetting {
    return this.mChildSetting;
  }
  @Mutation SET_CHILD_SETTING(setting: ChildSetting) {
    this.mChildSetting = setting;
    console.error(DefaultData.childSetting);
  }
  @Action // 자녀설정
  async setChildSetting(payloads: ChildSetting) {
    try {
      console.log("setChildSetting:", payloads.playPosbTime);
      const response = await Axios.post(
        `${Util.Config.restAPIProd}${API.home.settings.req}`,
        payloads
      );
      if (response.data.ok == true) {
        this.SET_CHILD_SETTING(payloads);
      } else {
        Swal.fire({
          icon: "error",
          title: "setChildSetting 에러",
          text: response.data.err,
        });
      }
    } catch (e) {
      this.SET_CHILD_SETTING(payloads);
      DefaultData.childSetting = payloads;
      console.warn(e);
    }
  }
  @Action // 자녀설정 가져오기
  async getChildSetting() {
    try {
      const response = await Axios.get(
        `${Util.Config.restAPIProd}${API.home.settings.res}`
      );
      console.log("childSetting", response);

      if (response.data.ok == true) {
        this.SET_CHILD_SETTING(response.data.infolist);
      } else {
        Swal.fire({
          icon: "error",
          title: "getChildSetting 에러",
          text: response.data.err,
        });
      }
    } catch (e) {
      this.SET_CHILD_SETTING(DefaultData.childSetting);
      console.error(DefaultData.childSetting);
      console.warn(e);
    }
  }

  //-----------------------------------------
  // HomeData
  get remainTime(): number {
    if (this.mHomeData) {
      // console.log( "remainTime:", this.mHomeData.userInfo.playPosbTime-SystemModule.elapsedSec );
      const sec =
        this.mHomeData.userInfo.playPosbTime - SystemModule.elapsedSec;
      //무제한모드일경우
      if (this.childSetting.isNonLimitToPlay) {
        return 30 * 60;
      }
      // if (sec <= 0) {
      //   ParentSetupModule.updateRemainTime(0);
      //   return 0;
      // } else {
      //   return this.mHomeData.userInfo.playPosbTime - SystemModule.elapsedSec;
      // }
      if (sec == 0) {
        ParentSetupModule.updateRemainTime(0);
      }
      if (sec < 0) {
        return 0;
      } else {
        return this.mHomeData.userInfo.playPosbTime - SystemModule.elapsedSec;
      }
    }
    return 10 * 60;
  }

  // --생년월일
  private mBirthData: Home.Birth;
  get birthData(): Home.Birth {
    return this.mBirthData;
  }
  @Mutation SET_BIRTH_DATA(birthData: Home.Birth) {
    this.mBirthData = birthData;
  }
  @Action async getBirthData() {
    try {
      const response = await Axios.get(
        `${Util.Config.restAPIProd}${API.user.res}`
      );
      if (response.data.ok == true) {
        this.SET_BIRTH_DATA(response.data.infolist);
      } else {
        Swal.fire({
          icon: "error",
          title: "birthday error",
          text: response.data.error,
        });
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // @Mutation SET_REMAINTIME( sec: number ){
  //     this.mHomeData.userInfo.playPosbTime = sec;
  // }

  // @Action async resetRemainTime(){
  //     console.log( "ChildSetting.playPosbTime:", this.mChildSetting.playPosbTime);
  //     const resetT = this.mChildSetting.playPosbTime;
  //     SystemModule.resetTimer();
  //     this.SET_REMAINTIME( resetT );
  //     this.saveRemainTime( resetT );
  // }

  // @Action async saveRemainTime( resetSec: number){
  //     // TODO: 서버전송
  //     ParentSetupModule.updateRemainTime( resetSec );
  //     // this.SET_REMAINTIME( this.remainTime );
  // }

  private mHomeData: Home.HomeData | null = null;
  get homeData(): Home.HomeData {
    return this.mHomeData;
  }
  get profileURL() {
    if (this.mHomeData == null) return "img/lobby/nouser.png";
    if (this.mHomeData.userInfo == null) return "img/lobby/nouser.png";
    if (this.mHomeData.userInfo.profileUrl == undefined) {
      this.mHomeData.userInfo.profileUrl = "img/lobby/nouser.png";
    }
    return this.mHomeData.userInfo.profileUrl;
  }
  get childNm() {
    if (this.mHomeData == null) return "알수없음";
    if (this.mHomeData.userInfo == null) return "알수없음";
    if (this.mHomeData.userInfo.childNm == undefined) {
      this.mHomeData.userInfo.childNm = "알수없음";
    }
    return this.homeData.userInfo.childNm;
  }

  @Mutation SET_HOME_DATA(homedata: Home.HomeData) {
    this.mHomeData = homedata;
  }

  @Action async getHomeData() {
    if (SystemModule.isDemoMode) return;
    try {
      const response = await Axios.get(
        `${Util.Config.restAPIProd}${API.home.recent.req}`
      );
      if (response.data.ok == true) {
        console.log("getHomeData", response.data.infolist);
        // ParentSetupModule.updateRemainTime(this.childSetting.playPosbTime);
        // this.SET_HOME_DATA( DefaultData.homeData );
        this.SET_HOME_DATA(response.data.infolist);
      } else {
        Swal.fire({
          icon: "error",
          title: "getHomeData 에러",
          text: response.data.err,
        });
      }
    } catch (e) {
      console.warn(e);
      this.SET_HOME_DATA(DefaultData.homeData);
    }
  }
  //--하우투 최초진입 정보 요청-------------------------------------------
  private mHowTo: HowTo.HowToData = {
    storybooks: {
      movie: false,
      catch: false,
      touch: false,
      match: false,
      finder: false,
      quiz: false,
      makingbook: false,
    },
    alphabet: {
      catch: false,
      match: false,
      touch: false,
      block: false,
      quiz: false,
    },
  };

  get howtoData(): HowTo.HowToData {
    return this.mHowTo;
  }

  @Mutation SET_HOWTO_DATA(infolist: any) {
    if (infolist.storybook != undefined) {
      for (const actInfo of infolist.storybook) {
        if (actInfo.activity && actInfo.learned) {
          this.mHowTo.storybooks[actInfo.activity] = actInfo.learned;
        }
      }
    }

    if (infolist.alphabet != undefined) {
      for (const actInfo of infolist.alphabet) {
        if (actInfo.activity && actInfo.learned) {
          this.mHowTo.alphabet[actInfo.activity] = actInfo.learned;
        }
      }
    }
  }
  @Action async getHowToData() {
    if (SystemModule.isDemoMode) {
      return false;
    }
    try {
      const response = await Axios.get(
        `${Util.Config.restAPIProd}${API.babyall.howto.info.res}`
      );
      if (response.data.ok == true) {
        this.SET_HOWTO_DATA(response.data.infolist);
      } else {
        Swal.fire({
          icon: "error",
          title: "getHowTo 에러",
          text: response.data.err,
        });
      }
    } catch (e) {
      console.warn(e);
    }
  }
  //---------------------------------------------
  @Action //모든 정보 초기화.( 테스트용 )
  async resetData() {
    try {
      const response = await Axios.get(
        `${Util.Config.restAPIProd}/learning/parents/sttc/reset`
      );
      if (response.data.ok == true) {
        console.error(this.mHomeData);
      } else {
        Swal.fire({
          icon: "error",
          title: "setMypetScreenShot error",
          text: response.data.err,
        });
      }
    } catch (e) {
      console.warn(e);
    }
  }

  //---------------------------------------------
  get levelIDX() {
    if (this.childSetting == null) return 1;
    else if (this.childSetting.lrngChoLvlCd == PlayLevel.easy) return 1;
    else if (this.childSetting.lrngChoLvlCd == PlayLevel.normal) return 2;
    else if (this.childSetting.lrngChoLvlCd == PlayLevel.hard) return 3;
  }
}

export const UserModule = getModule(User);
