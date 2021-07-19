<template>
<!-- 브라우저 IE인지 체크-->
<div class="browserCheck">
    <div id="dimmed">
        <div id="alert_bg">
            <div id="platformText" ref="text" />
            <div id="close" @click="back" ref="close" />
            <div id="btn" @click="goEvent" ref="btn" v-if="this.mode=='IE' || this.mode=='IOS'" />  
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped>
.browserCheck{
    position:fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    z-index: 3000;
    #dimmed{
        position:fixed;
        top:0;
        left:0;
        width:100vw;
        height:100vh;
        background-color: rgba(0,0,0,0.8);
        #alert_bg{
            position:relative;
            margin: 20vh auto;

            width: 60%;
            height: 40%;
            max-width: 800px;
            max-height:500px;

            border-radius: 1rem;
            background-color: #FFF;
            #platformText{
                display:block;
                padding:6rem 0 3rem;
                font-size:1.2rem;
                text-align: center;
            }
            #btn , #close{
                float: right;
                display: inline-block;
                padding:0.5rem 2rem;
                margin-right:4rem;
                font-weight: bold;
                border-radius: 16px;
                border:1px solid rgba(0,0,0,0.8);
                cursor:pointer;
            }
            #close{
                margin-left:1rem;
            }
        }
    }
}
</style>

<script lang="ts">
import Config from "@/Util/Config";
import { Component, Prop, Vue } from "vue-property-decorator";


@Component({
    components:{
    }
})
export default class BrowserCheck extends Vue {
    private mode: string ;

    $refs: {
        text: HTMLDivElement;
        btn: HTMLDivElement;
        close: HTMLDivElement;
    }
    created(){
        this.mode = Config.platform;
    }
    mounted(){
        this.mode = Config.platform;
        this.$refs.text.innerHTML = Config.platformText;
        if(this.mode == "IE"  ) { 
            this.$refs.btn.innerHTML = "크롬 브라우저 설치하기"
            this.$refs.close.innerHTML = "닫기"; 
        }
        if(this.mode == "Android") { 
            this.$refs.close.innerHTML = "종료" 
        }
        if(this.mode == "IOS") { 
            this.$refs.btn.innerHTML = "학습하기"
            this.$refs.close.innerHTML = "닫기"; 
        }
        
    }
    goEvent(){
        if(this.mode == "IE") {  location.href='https://www.google.co.kr/chrome/'     }
        if(this.mode == "Android") { /** */ }
        if(this.mode == "IOS") { this.$emit(`IosPopClose`) }
    }
    back(){
        // history.back()
        location.href='https://www.arambookclub.com/'
    }
}
</script>
