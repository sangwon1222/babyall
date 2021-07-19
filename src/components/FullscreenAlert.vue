<template>
<!-- 풀스크린 체커 : 현재 모드가 풀스크린인지 체크하여, 아닐경우 안내 화면으로 전환-->
<div class="fullscreenAlert">
    <p>
        활동을 진행하기 위해<br/>
        아래 버튼을 눌러주세요.
    </p>
    <br />
    <div class="btn" >
        <img src="img/home/btn_fullscreen_guide.png" @click.stop.prevent="goFullscreen"/>
    </div>
    <!-- <img class="bi" src="img/firstconfig/babyall_bi.png" /> -->
    <img class="ci" src="img/firstconfig/aram_ci.png" />
</div>
</template>

<style lang="scss" scoped>
.fullscreenAlert {
    background: #cbe697;
    position: fixed;
    z-index: 20000;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .ci{
        position: absolute;
        top: calc( 100vh *0.04);
        left: 30px;
        width: calc( 100vw *0.15);
    }
    
    .bi{
        position: absolute;
        bottom: calc( 100vh *0.04);
        width: 30%;
    }
    
    p {
        text-align:center;
        color: #000;
        font-size: calc( 100vh *0.03);
        font-weight: bold;
    }
    
    .btn {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        
        img{
            width: calc( 100vw *0.5);
        }
    }

    @media (orientation: landscape) {
        .ci{
            position: absolute;
            top: calc( 100vh *0.04);
            left: 30px;
            width: 8%;
        }
        .bi{
            position: absolute;
            bottom: calc( 100vh *0.04);
            width: calc( 100vw *0.15);
        }
        p{
            font-size: calc( 100vw *0.03);        
        }
        .btn{
            img{
                width: calc( 100vw *0.3);
            }
        }
    }


}
</style>

<script lang="ts">
import Util from "../Util";
import { Component, Prop, Vue } from "vue-property-decorator";
import { isIOS } from '@/Util/Platform';
import PIXISound from "pixi-sound";


@Component({
    components:{
    }
})
export default class FullscreenAlert extends Vue {
    private msg="";
    
    mounted(){
        if(window['video']!= undefined)window['video'].pause();
    }
    goFullscreen() {
        this.$emit("goFullscreen");
    }
}
</script>
