<template>
  <div class="dimmed" v-if="showRestartPopupFlag">
    <div class="popup-body" @click.stop="">
      <div class="logo">
        <img src="img/lobby/img_kids.png" />
      </div>
      <div class="comment">
        <p>
          The time for today is over.<br />
          See you next time!<br />
          Bye bye!
        </p>
      </div>
      <div class="restartBTN">
        <img src="img/lobby/btn_restart.png" @click="_restart()" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dimmed {
  width: 102%;
  height: 102%;
  position: absolute;
  top: -2px;
  left: -2px;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 2px #000 solid;
  box-sizing: border-box;

  .popup-body {
    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;
    width: 800px;
    height: 650px;
    border-radius: 20px;
    background-color: #e7ffdf;
    .comment {
      margin-top: 0;
      p {
        line-height: 60px;
        font-family: "Noto sans";
        font-size: 40px;
      }
      text-align: center;
    }
    .logo {
      margin-top: 10px;
    }
    .restartBTN {
      margin-top: 2rem;
      cursor: pointer;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/UserStore";
import { SystemModule } from "@/store/System";
import ParentCheckPopup from "./ParentCheckPopup.vue";
import { ParentSetupModule } from "@/store/ParentSetup";

@Component
export default class RestartPopup extends Vue {
  get showRestartPopupFlag() {
    return UserModule.remainTime <= 0;
  }

  async mounted() {
    // console.error(this.showRestartPopupFlag);
  }
  _close() {
    this.$emit("onClose");
  }

  async _restart() {
    //부모 확인 열기
    (this.$parent.$refs.ParentCheckPopup as ParentCheckPopup).show(async () => {
      //
      console.log(`restartPop.vue`);
      await ParentSetupModule.updateRemainTime(0);

      SystemModule.resetTimer();

      await ParentSetupModule.resetTime();
      await UserModule.getHomeData();
      this.$emit("onClose");
    });
  }
}
</script>
