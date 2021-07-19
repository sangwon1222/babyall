<!--
1. connectPage
  보유 유저 목록을 가져온다. -> 유저 선택시 유저의 저장 정보를 가지고 온다. -> 상황에 따라 firstPage or Lobby로 간다.
-->
<template>
  <div class="ConnectPage">
    <Loading v-if="isLoading" />
    <p class="comment">자녀정보를 가져오는 중입니다.<br/> 잠시만 기다려주세요.</p>
    <!-- <div class="userSelector">
      <div
        class="userThumb"
        v-for="info in this.userList"
        :key="info.idx"
        @click="selectUser(info.idx)"
      >
        <img width="64" :src="'img/' + info.thumb" />
        <span>{{ info.name }}</span>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.ConnectPage {
    background: #cbe697;
    width: inherit;
    height: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.comment {
  color: #00736d;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
//   text-shadow: 0px 0px 10px rgb(255, 186, 174);
}
.userSelector {
  display: flex;
  flex-direction: column;
  transition: all 0.5s;
}
@media (orientation: landscape) {
  .userSelector {
    flex-direction: row;
  }
}
.userThumb {
  transition: all 1s;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  border: 5px solid;
  border-color: rgba(0, 162, 255, 0);
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    color: #000;
    font-weight: bold;
  }
}

.userThumb:hover {
  border-color: rgba(0, 162, 255, 1);
}
</style>

<script lang="ts">
//https://github.com/wooyoung85/vuejs-sample-project
import { Component, Prop, Vue } from "vue-property-decorator";
import Loading from "../components/Loading.vue";

import { UserModule } from '../store/UserStore';
import { SystemModule } from '../store/System';

import Util,{parseJwt} from "../Util";
import gsap from 'gsap'
@Component({
    components:{
        Loading
    }
})
export default class ConnectPage extends Vue {
    get isLoading(): boolean {
        return UserModule.childSetting == null;
        // return false;
    }

    // get userList(): Array<UserInfo> {
    //     // console.log( "UserModule.memberInfo ",UserModule.memberInfo );
    //     return UserModule.memberInfo.userList;
    // }
    
    mounted() {
        gsap.delayedCall( 0.5, async()=>{
            await SystemModule.init();

            // console.log( "isDemoMode:", SystemModule.token == "" );
            if( SystemModule.token == "" ){
                SystemModule.setCurrentPage( "Lobby");
            }else{
                await UserModule.getChildSetting();
                if( UserModule.childSetting == null ){
                    SystemModule.setCurrentPage( "FirstPage");
                }else{
                    SystemModule.setCurrentPage( "Lobby");
                }
            }
        });
    }
}

</script>
