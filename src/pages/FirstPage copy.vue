<template>
  <div class="FirstPage">
    <!-- page1 -->
    <div class="page" v-if="mPageIDX == 1">
      <div class="contents">
        <p>베이비올 영어에 오신걸 환영합니다.</p>
        <p>자녀 수준 맞춤 활동을 할 수 있도록 자녀의 정보를 설정해 주세요.</p>
      </div>
      <span class="button" @click="mPageIDX = 2">다음</span>
    </div>
    <!-- page2 -->
    <div class="page" v-if="mPageIDX == 2">
      <h1>추천레벨</h1>
      <div class="contents">
        <CheckGroup
          :datalist="mLevelList"
          @onSelectItem="_onSelectLevel"
        ></CheckGroup>
        <p>
          자녀의 생년월일을 기준으로 레벨을 추천하며 레벨은 월령별 인지 능력에
          따라 활동 난이도에 차이가 있습니다.
        </p>
        <p>
          학습 레벨은 변경 가능합니다.
        </p>
      </div>
      <span class="button" @click="mPageIDX = 3">다음</span>
    </div>
    <!-- page3 -->
    <div class="page" v-if="mPageIDX == 3">
      <h1>진행모드</h1>
      <div class="contents">
        <CheckGroup
          :datalist="mModeList"
          @onSelectItem="_onSelectMode"
        ></CheckGroup>
        <p>
          자녀의 성향에 맞게 선택해주세요. 도서 선택을 자유롭게 하는 탐험가
          모드와 순서대로 하는 과학자 모드가 있습니다.
        </p>
        <p>
          진행 모드는 변경 가능합니다.
        </p>
      </div>
      <span class="button" @click="mPageIDX = 4">다음</span>
    </div>
    <!-- page4 -->
    <div class="page" v-if="mPageIDX == 4">
      <h1>하루사용시간</h1>
      <div class="contents">
        <vue-slider
          v-model="PAM"
          :data="mPAMList"
          :marks="true"
          @change="_onSelectPAM"
          class="slider"
        />
        <p>
          자녀와 약속한 시간을 설정해주세요. 시간이 다되면 활동을 할 수
          없습니다.
        </p>
        <p>매일 0시에 갱신되며 재시작 및 사용 시간 설정 변경 가능합니다.</p>
      </div>
      <span class="button" @click="mPageIDX = 5">다음</span>
    </div>
    <!-- page5 -->
    <div class="page" v-if="mPageIDX == 5">
      <div class="contents">
        <p>자녀에 관한 모든 리포트 및 가이드는 맘&대디에 있습니다.</p>
      </div>
      <span class="button" @click="_endConfig()">시작</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.FirstPage {
    background: #cbe697;
    width: inherit;
    height: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
}
p{
    font-size: 1.5rem;
}
h1{
    font-size: 2rem;
}
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: inherit;
  .contents {
    width: 80%;
    height: 70%;
    .check-group {
      display: flex;
      flex-direction: column;
    }
  }
  .slider {
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .button {
    position: fixed;
    bottom: 100px;
    background-color: #fff;
    color: rgb(51, 69, 109);
    text-shadow: none;
    padding: 20px;
    border-radius: 20px;
    min-width: 100px;
    text-align: center;
    transition: all 0.5s;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    font-size: 1.5rem;
  }

  .button:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    bottom: 95px;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import CheckGroup from "./FirstPage/CheckGroup.vue";
//https://nightcatsama.github.io/vue-slider-component/#/api/events
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

import { PlayLevel, PlayMode, ChildSetting } from '../store/Define';
import { UserModule } from '../store/UserStore';
import { SystemModule } from '../store/System';
//import axios from "axios";

@Component({
    components:{ CheckGroup, VueSlider }
})
export default class FirstPage extends Vue {
    private mPageIDX = 1;
    private mLevelList: Array<{ label: string; checked: boolean }>=[
        { label: "레벨1", checked: false },
        { label: "레벨2 -추천", checked: true },
        { label: "레벨3", checked: false }
    ];
    private mModeList: Array<{ label: string; checked: boolean }>=[
        { label: "씩씩한 탐험가(자유롭게)", checked: true },
        { label: "꼼꼼한 과학자(순서대로)", checked: false }
    ];
    private mPAM = 60;
    private mPAMList: Array<number>=[10, 20, 30, 60, 90, 120];
    
    get PAM(): number{ return this.mPAM }
    set PAM(v: number){ this.mPAM = v; }
    private _onSelectLevel(idx) {
        if( idx == 0 ) UserModule.childSetting.lrngChoLvlCd = PlayLevel.easy;
        else if( idx == 1 ) UserModule.childSetting.lrngChoLvlCd = PlayLevel.normal;
        else if( idx == 2 ) UserModule.childSetting.lrngChoLvlCd = PlayLevel.hard;
        console.log("->select Level", UserModule.childSetting.lrngChoLvlCd );
    }

    private _onSelectMode(idx) {
        if (idx == 0) {
            UserModule.childSetting.lrngModeCd = PlayMode.free;
        } else {
            UserModule.childSetting.lrngModeCd = PlayMode.step;
        }
        //this.configData.level = idx + 1;
        console.log("->select Mode", UserModule.childSetting.lrngModeCd );
    }

    private _onSelectPAM(t: number) {
        UserModule.childSetting.playPosbTime = t;
        console.log("->select PMA", UserModule.childSetting.playPosbTime );
    }
    
    private _endConfig() {
        // console.log("end config", this.mConfigData);
        // UserModule.setupUserInfo( { info: this.mConfigData } );
        SystemModule.setCurrentPage( "Lobby" );
    }
}
</script>
