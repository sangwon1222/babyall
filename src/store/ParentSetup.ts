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
import { API } from "./Define";
import DefaultData from "@/store/DefaultData";

import { ParentInfo } from "./Define";
import { UserModule } from "./UserStore";
import Config from "@/Util/Config";

//--------------------------------------------
// 동영상 목록 플레이 방식
export enum PlayMode {
  None,
  LoopOne,
  LoopAll,
}
@Module({
  namespaced: true,
  name: "parentsetup",
  dynamic: true,
  store,
})
class ParentSetup extends VuexModule {
  private mThumbPath = `${Config.packageURL}/bookcover`;
  private mMoviePath = `${Config.packageURL}/momanddaddy/movie`;

  //---------------------------------------------
  // 현재 관람중인 동영상 항목 세부정보
  private mCurrentItemData: any | null = null;
  get currentItemData(): any | null {
    return this.mCurrentItemData;
  }
  @Mutation
  private SET_CURRENT_ITEM(item: any) {
    if (this.mCurrentItemData !== null) {
      this.mCurrentItemData.selected = false;
    }
    this.mCurrentItemData = item;
    if (item) item.selected = true;
  }

  //------------------------------------------
  // 현재 가동 플레이 모드
  private mPlayMode: PlayMode = PlayMode.None;
  get playMode(): PlayMode {
    return this.mPlayMode;
  }

  @Mutation
  private SET_PLAYMODE(mode: PlayMode) {
    this.mPlayMode = mode;
  }

  private mParentMovieList = [];
  get parentMovieList(): any {
    return this.mParentMovieList;
  }
  @Mutation private SET_PARENT_MOVIELIST(movielist: any) {
    this.mParentMovieList = movielist;
  }

  @Action // 유저정보를 요청. 만약 최초 진입이면, 최초진입 상태 마킹 처리
  async requestParentMovieList(filter: string) {
    console.log("requestParentMovieList");
    try {
      const response = await Axios.post(
        `${Util.Config.restAPIProd}${API.parent.movie.req}`,
        { filter: filter }
      );
      if (response.data.ok == true) {
        console.log(response.data);
        const temp = [];
        for (const info of response.data.infolist) {
          temp.push({
            subject: info.subject,
            titleColor: info.titleColor,
            thumb: `${this.mThumbPath}/${info.thumb}`,
            movie: `${this.mMoviePath}/${info.movie}/${info.movie}.mpd`,
            movieLength: info.movieLength,
            favoriteFlag: info.favoriteFlag,
            dtlBookSeqno: info.dtlBookSeqno,
            // vidoCtgrCd: info.vidoCtgrCd,
            selected: false,
          });
          // console.warn( info );
        }
        this.SET_PARENT_MOVIELIST(temp);
      } else {
        //this.$swal('Hello Vue world!!!');
        Swal.fire({
          icon: "error",
          title: "requestParentMovieList error",
          text: response.data.err,
        });
      }
    } catch (e) {
      console.warn(e);
    }
  }

  @Action // 활용동영상 즐겨찾기 처리
  async toggleFavorite(payloads: { itemData?: any }) {
    if (payloads.itemData) {
      payloads.itemData.favoriteFlag = !payloads.itemData.favoriteFlag;
    }
    try {
      const response = await Axios.post(
        `${Util.Config.restAPIProd}${API.parent.favorites.req}`,
        {
          dtlBookSeqno: payloads.itemData.dtlBookSeqno,
          value: payloads.itemData.favoriteFlag,
        }
      );
      //console.warn( payloads.itemData.dtlBookSeqno, payloads.itemData.favoriteFlag, response  );
    } catch (e) {
      console.warn(e);
    }
  }

  //해당 동영상을 셀렉트상태로 바꿈.( 이전 셀렉트는 선택해제 )
  @Action
  public selectItem(itemData: any) {
    if (itemData) this.SET_CURRENT_ITEM(itemData);
  }

  //다음 동영상을 select해라~
  @Action
  public selectNext() {
    if (this.mCurrentItemData) {
      const idx = this.mParentMovieList.indexOf(this.mCurrentItemData);
      if (idx != -1) {
        console.warn(idx, this.mParentMovieList.length - 1);
        if (idx == this.mParentMovieList.length - 1) {
          if (this.mPlayMode == PlayMode.LoopAll) {
            this.SET_CURRENT_ITEM(this.mParentMovieList[0]);
            return true;
          }
          return false;
        } else {
          if (this.mPlayMode == PlayMode.LoopOne) {
            this.SET_CURRENT_ITEM(this.mParentMovieList[idx]);
            return true;
          } else {
            this.SET_CURRENT_ITEM(this.mParentMovieList[idx + 1]);
            return true;
          }
        }
      }
    }
    return false;
  }
  //---------------------------------------------

  private mActSlotReport: ParentInfo.ActSlotReport = null;
  get actSlotReport(): ParentInfo.ActSlotReport {
    return this.mActSlotReport;
  }
  @Mutation private SET_ACT_REPORT(data: ParentInfo.ActSlotReport) {
    this.mActSlotReport = data;
  }
  @Action async getActSlotReport() {
    try {
      const response = await Axios.get(
        `${Util.Config.restAPIProd}${API.parent.slotdata.req}`
      );
      if (response.data.ok == true) {
        this.SET_ACT_REPORT(response.data.infolist);
      } else {
        Swal.fire({
          icon: "error",
          title: "getActSlotReport error",
          text: response.data.err,
        });
      }
    } catch (e) {
      //this.SET_ACT_REPORT( null );
      this.SET_ACT_REPORT(DefaultData.parentActReportSlotData);
      console.warn(e);
    }
  }

  //---------------------------------------------
  // < @활동 리포트 종합요약요청 >
  private mActSummaryReport: ParentInfo.ActSummaryReport = null;
  get actSummaryReport(): ParentInfo.ActSummaryReport {
    return this.mActSummaryReport;
  }

  @Mutation private SET_SUMMARY(data: ParentInfo.ActSummaryReport) {
    this.mActSummaryReport = data;
  }
  @Action async getActSummaryReport() {
    try {
      const response = await Axios.get(
        `${Util.Config.restAPIProd}${API.parent.summary.req}`
      );
      if (response.data.ok == true) {
        this.SET_SUMMARY(response.data.infolist);
      } else {
        Swal.fire({
          icon: "error",
          title: "getActSummaryReport error",
          text: response.data.err,
        });
      }
    } catch (e) {
      // this.SET_SUMMARY( null );
      this.SET_SUMMARY(DefaultData.parentActSummaryReport);
      console.warn(e);
    }
  }
  //---------------------------------------------
  // < @스토리 북스 상세 리포트 요청 >
  private mDetailReportSB: ParentInfo.DetailReportSB = null;
  get detailReportSB(): ParentInfo.DetailReportSB {
    return this.mDetailReportSB;
  }

  @Mutation private SET_DETAILREPORT_SB(data: ParentInfo.DetailReportSB) {
    this.mDetailReportSB = data;
  }
  @Action async getDetailReportSB(payload: ParentInfo.DetailReportSBReq) {
    try {
      const response = await Axios.get(
        `${Util.Config.restAPIProd}${API.parent.detailSB.req}/${payload.lrngSttcSeqno}`
      );
      if (response.data.ok == true) {
        console.log("->", response.data.infolist);
        this.SET_DETAILREPORT_SB(response.data.infolist);
      } else {
        Swal.fire({
          icon: "error",
          title: "getDetailReportSB error",
          text: response.data.err,
        });
      }
    } catch (e) {
      // this.SET_DETAILREPORT_SB( null )
      this.SET_DETAILREPORT_SB(DefaultData.parentDetailSB);
      console.warn(e);
    }
  }
  //---------------------------------------------
  // < @알파벳스쿨 상세 리포트 요청 >
  private mDetailReportAL: ParentInfo.DetailReportAL = null;
  get detailReportAL(): ParentInfo.DetailReportAL {
    return this.mDetailReportAL;
  }

  @Mutation private SET_DETAILREPORT_AL(data: ParentInfo.DetailReportAL) {
    this.mDetailReportAL = data;
  }
  @Action async getDetailReportAL(payload: ParentInfo.DetailReportALReq) {
    try {
      const response = await Axios.get(
        `${Util.Config.restAPIProd}${API.parent.detailAL.req}/${payload.lrngSttcSeqno}`
      );
      if (response.data.ok == true) {
        this.SET_DETAILREPORT_AL(response.data.infolist);
      } else {
        Swal.fire({
          icon: "error",
          title: "getDetailReportAL error",
          text: response.data.err,
        });
      }
    } catch (e) {
      this.SET_DETAILREPORT_AL(DefaultData.parentDetailAL);
      console.warn(e);
    }
  }

  //--------------------------------------
  // 도토리 충전
  @Action async chargeAcorn(payload: ParentInfo.AcornChargeReq) {
    try {
      const response = await Axios.post(
        `${Util.Config.restAPIProd}${API.parent.chargeAcorn.req}`,
        payload
      );
      if (response.data.ok == true) {
        console.log("chargeAcorn", response);
        this.actSummaryReport.acornCnt = response.data.infolist.acornCnt;
        this.SET_SUMMARY(this.actSummaryReport);
        UserModule.homeData.userInfo.acornCnt = response.data.infolist.acornCnt;
        UserModule.SET_HOME_DATA(UserModule.homeData);
        // this.SET_DETAILREPORT_AL( response.data.infolist );
      } else {
        Swal.fire({
          icon: "error",
          title: "getDetailReportAL error",
          text: response.data.err,
        });
      }
    } catch (e) {
      // this.SET_DETAILREPORT_AL( DefaultData.parentDetailAL )
      console.warn(e);
    }
  }

  // 학습시간 리셋
  @Action async resetTime() {
    try {
      const response = await Axios.post(
        `${Util.Config.restAPIProd}${API.parent.resetTime.req}`,
        {}
      );
      if (response.data.ok == true) {
        //
      } else {
        Swal.fire({
          icon: "error",
          title: "resetTime error",
          text: response.data.err,
        });
      }
    } catch (e) {
      // this.SET_DETAILREPORT_AL( DefaultData.parentDetailAL )
      console.warn(e);
    }
  }

  // 학습 잔여시간 업데이트
  @Action async updateRemainTime(overrideSec: number) {
    try {
      if (UserModule.childSetting == null) return;
      if (UserModule.childSetting.isNonLimitToPlay) return;

      console.log("updateRemainTime", overrideSec);
      const response = await Axios.post(
        `${Util.Config.restAPIProd}${API.parent.updateRemainTime.req}`,
        {
          remainedTime: overrideSec,
        }
      );
      if (response.data.ok == true) {
        // console.log( "chargeAcorn",response );
        // this.actSummaryReport.acornCnt = response.data.infolist.acornCnt;
        // this.SET_SUMMARY( this.actSummaryReport );
        // UserModule.homeData.userInfo.acornCnt = response.data.infolist.acornCnt;
        // UserModule.SET_HOME_DATA( UserModule.homeData );
        // this.SET_DETAILREPORT_AL( response.data.infolist );
      } else {
        Swal.fire({
          icon: "error",
          title: "resetTime error",
          text: response.data.err,
        });
      }
    } catch (e) {
      // this.SET_DETAILREPORT_AL( DefaultData.parentDetailAL )
      console.warn(e);
    }
  }
  @Action async updateRemainByCurrent() {
    // console.error(`parentSetup`, UserModule.remainTime);
    this.updateRemainTime(UserModule.remainTime);
  }

  // 학습 진행시간 업데이트
  @Action async updatePlayTime(sec: number) {
    const t = sec;
    if (isNaN(t) || t == undefined || t == null || t <= 0) return;
    try {
      console.warn("updatePlayTime", Math.floor(t));
      const response = await Axios.post(
        `${Util.Config.restAPIProd}${API.parent.updatePlayTime.req}`,
        {
          learnedTime: Math.floor(t),
        }
      );
      if (response.data.ok == true) {
        //
      } else {
        Swal.fire({
          icon: "error",
          title: "resetTime error",
          text: response.data.err,
        });
      }
    } catch (e) {
      // this.SET_DETAILREPORT_AL( DefaultData.parentDetailAL )
      console.warn(e);
    }
  }
}

export const ParentSetupModule = getModule(ParentSetup);
