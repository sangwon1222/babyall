<!-- 부모 설정화면 -->
<template>
<div class="level">
    <div class="head">하루 사용 시간</div>
    <div class="row" style="margin-top:4rem">
        <div class="subpanel">
            <div class="timer"> <img src="img/firstconfig/timer.png" /> {{this.timerValueString}} </div>
            <div class="slider">
                <Slider 
                    v-if="!this.isUnlimitMode"
                    start="5분" end="150분" 
                    cursorColor="#ff9f15"
                    guageColor ="#4CAF50"
                    bgColor="#C4C4C4"
                    min="5"
                    max="150"
                    step="5"
                    :init="this.timerValue"
                    @onValueChanged="_onTimerChange"
                />        
            </div>
            <div class="subpanel-contents"> 
                <label class="checkcontainer"> 제한 없음
                    <input type="checkbox"  
                        :checked="this.isUnlimitMode?'checked':''" 
                        @click="this._toggleUnlimited"
                        name="timer" />
                    <span class="checkmark"></span>
                </label>                    
            </div>
        </div>
    </div>
    <div class="row">
        <ul class="list">
            <li>자녀와 약속한 사용 시간을 설정해주세요.</li>
            <li>시간이 다 되면 활동을 할 수 없습니다.</li>
            <li>사용 시간은 변경 가능합니다.</li>
        </ul>
    </div>
    <div class="row">
        <div class="btn" @click="_next"> 다음 </div>
    </div>
</div>
</template>

<style lang="scss" scoped>
.level{
    position:relative;
    background-color: #f0f0f0;
    width:100%;
    height:100%;
    .head{
        text-align: center;
        font-family: 'Noto sansCJKkr Medium';
        color: #000;
        text-shadow: none;
        font-size: 2rem;
        font-weight: bold;
        margin-top: 7rem;
    }
}
.subpanel{
    text-shadow:none;
    color: #000;
    background-color: rgba(255,255,255,0.5);
    padding: 2rem;
    width: 1000px;
    display:flex;
    flex-wrap:wrap;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    box-sizing: border-box;
    .slider{
        margin-top:-50px;
        width:500px;
        height:100px;
    }
    .subpanel-contents{
        width:9rem;
        border-bottom: 2px solid #e3e3e3;
        padding-bottom: 15px;
        margin: 10px;
        .pick{
            color: #44a231;
            font-size: 0.8rem;
            font-family: Arial;
        }
    }
    .subpanel-contents:last-child{
        border-bottom: none;
        padding-bottom: 0px;
    }
}
.timer{
    width:8rem;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    img{ 
        margin-right: 20px;
    }
}

.row{
    
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 1rem;
}
.list{
    color: #000;
    text-shadow: none;
    margin-left: 80px;
    margin-right: 80px;
    li{
        margin-top:0.5rem;
        width:920px;
        font-family: 'Noto sans';
        font-size: 20px;
        font-weight: bold;
    }
    span{
        color: #ff7515;
        font-family: 'Noto sans';
        font-size: 20px;
    }
}
.btn{
    cursor: pointer;
    position: absolute;
    bottom:90px;
    left:50%;

    width:260px;
    height:70px;
    transform: translateX(-50%);
    background-color: #93c340;
    padding: 20px;
    text-align: center;
    font-family: 'Noto sans';
    font-size: 23px;
    text-shadow: none;
    border-radius: 50px;
    box-sizing: border-box;
}


//Customize the label (the container)
.checkcontainer{
    // display: block;
    position: relative;
    padding-left: 60px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    // font-weight: bold;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-family: Arial;
    font-size: 1.2rem;
    // color: #888;
    //Hide the browser's default radio button
    input{
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0; 
    }
    //Create a custom radio button
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #FFF;
        border: 1px solid #d2d2d2;
        border-radius: 50%;
        
    }
    // Style the indicator
    .checkmark:after {
        top: 4px;
        left: 4px;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: #93c340;
    }
}
// On mouse-over
.checkcontainer:hover input ~ .checkmark {
    background-color: #FFF;
    border: 2px solid #add36b;
}
// When the radio button is checked
.checkcontainer input:checked ~ .checkmark {
    background-color: #FFF;
    border: 2px solid #93c340;
}
// Create the indicator
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}
// Show the indicator
.checkcontainer input:checked ~ .checkmark:after {
    display: block;
}
</style>

<script lang="ts">
import { UserModule } from '@/store/UserStore';
import { Component, Prop, Vue } from "vue-property-decorator";
import Slider from '../ParentSetup/components/Slider.vue'

@Component({
    components:{
        Slider,
    }
})
export default class PlayTimeLimit extends Vue {
    private mValue = 30;
    private mIsNonLimitToPlay = false;
    get timerValue(): number{
        return this.mValue;
    }
    get timerValueString(){
        if( this.mIsNonLimitToPlay ) return "무제한"
        else{
            return this.mValue+"분"
        }
    }
    get isUnlimitMode(){ 
        return this.mIsNonLimitToPlay
    }

    private _toggleUnlimited(){
        // if( UserModule.childSetting.isNonLimitToPlay ){
        //     this.mValue = 30;
        // }else{
        //     this.mValue = -1;
        // }
        this.mIsNonLimitToPlay = !this.mIsNonLimitToPlay;
        // UserModule.setChildSetting( UserModule.childSetting );
    }
    private _onTimerChange(v){
        this.mValue = v; 
    }

    async mounted(){
        //
        
    }


    _select( v: number){
        this.mValue = v;
    }
    
    _next(){
        this.$emit("onSetPlayTime", this.mValue, this.mIsNonLimitToPlay );
    }
}
</script>
