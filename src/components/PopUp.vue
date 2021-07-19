<template>
<div class="dimmed" v-if="mHelpPopupFlag">
    <div class="bgPanel" :style="this.mAcornPopupFlag?`max-width:700px`:`max-width:800px`">
        <div class="logo"> <img src="img/parent/pop_logo.png" /> </div>
        <div class="textContents" style="height: 350px;" v-if="this.mTextPopupFlag" >
            <p v-html=mTextContents style="font-size:1.4rem; "></p>
        </div>

        <div class="acornPanel" v-if="this.mAcornPopupFlag">
            <div class="textContents" style="width: 80%;padding:30px;">
                <div class="row">
                    <div class="totalAcorn">
                        <img src="img/parent/acorn_small.png" />
                        <span class="count"> {{this.acornTotal}} </span>
                    </div>
                    <div class="guage">
                        <span class="currCount">+{{this.mAcornChargeCount}}개</span>
                        <Slider 
                            start="0개" end="100개" 
                            cursorColor="#ff9f15"
                            guageColor ="#ffca4a"
                            bgColor="#C4C4C4"
                            min="0"
                            max="100"
                            step="1"
                            :init="0"
                            @onValueChanging="_sliderValueChange"
                            />        
                    </div>
                </div>
            </div>
            <img class="chargeButton" src="img/parent/btn_charge.png" @click="_charge"/>
        </div>
        <img class="close" src="img/parent/pop_close.png" @click="_closeHelpPopup"/>
    </div>
</div>
</template>

<style lang="scss" scoped>
.dimmed{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    z-index: 10000;
    background-color: rgba(0,0,0,0.5);
    width: 110%;
    height: 110%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.bgPanel{
    position: relative;
    background-color: #39d1cd;
    width: 90%;
    max-width: 800px;
    height: 500px;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    align-items: center;

    .close{
        position: absolute;
        top:20px;
        right:20px;
        cursor: pointer;
    }
    .logo{
        // border: 1px solid #FF0000;
        width:100%;
        height: 120px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .chargeButton{
        margin-top: 50px;
        cursor: pointer;
    }
    
}

.textContents{
    // border:1px solid #F00;
    background-color: #FFF;
    border-radius: 20px;
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    p{
        // border: 1px solid #FF0000;
        line-height: 180%;
        font-family:  "Noto sans";
        font-size: 1.2rem;
        font-weight: bold;
        letter-spacing: -0.05rem;
        padding: 2rem;    
        text-align: center;
    }
}

.acornPanel{
    // border:1px solid #F00;
    width: 100%;
    height:350px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .row{
        display:flex;
        flex-direction: row;
    }
    .totalAcorn{
        background-color: #c3e77f;
        width: 224px;
        border-radius: 224px;
        // position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .count{
            color: #216104;
            font-family:  "Noto sans";
            font-size: 30px;
            font-weight: bold;
        }
    }
    .guage{
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
        position: relative;
        .currCount{
            position: absolute;
            right: 10px;
            top: -10px;
            font-family:  "Noto sans";
            font-size: 30px;
            font-weight: bold;
            color:#ff575d;
        }
    }
}

</style>

<script lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import { component } from 'vue/types/umd';
import { SystemModule } from '@/store/System';

import Slider from '@/pages/ParentSetup/components/Slider.vue'
import { UserModule } from '@/store/UserStore';
import { ParentSetupModule } from '@/store/ParentSetup';

@Component({
    components:{
        Slider,
    }
})
export default class PopUp extends Vue {
    private mHelpPopupFlag =  false;
    
    private mTextPopupFlag =  false;
    private mTextContents = ""

    private mAcornPopupFlag =  false;
    private mAcornChargeCount = 0;

    get acornTotal(): number{
        return UserModule.homeData.userInfo.acornCnt + this.mAcornChargeCount;
    }
    mounted(){
        SystemModule.setPopup( this );
    }

    destroyed(){
        SystemModule.setPopup( null );
    }

    _closeHelpPopup(){
        this.mHelpPopupFlag = false;
    }
    
    showMessageHelp( innerHTML: string ){
        this.mHelpPopupFlag = true;
        this.mTextPopupFlag = true;
        this.mAcornPopupFlag = false;
        this.mTextContents = innerHTML;
    }
    
    showAcornCharge(){
        this.mHelpPopupFlag = true;
        this.mTextPopupFlag = false;
        this.mAcornPopupFlag = true;
        // this.mTextContents = this.ContentsList[0].contents
    }
    _sliderValueChange(v: number){
        this.mAcornChargeCount = v;
    }
    _charge(){
        //
        ParentSetupModule.chargeAcorn({acornChargeCnt: this.mAcornChargeCount })
        this.mAcornChargeCount = 0;
        this.mHelpPopupFlag = false;
    }
}
</script>>  