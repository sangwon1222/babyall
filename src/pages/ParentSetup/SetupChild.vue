<template>
    <div class="SetupChild">

        <div class="row userStat">
            <span class="name">{{childName}}</span> 

            <span class="birth">
                {{this.birthString.slice(0,4)}}.{{this.birthString.slice(4,6)}}.{{this.birthString.slice(6,8)}}
            </span>
        </div>

        <div class="col">
            <div class="head"><img src="img/parent/setup_child_head1.png" @click="_onShowHelp('level')"/></div>
            <div class="subpanel">
                <div class="subpanelContents"> 
                    <label class="checkcontainer">레벨 1 <span class="pick"  v-if="fixValue==1" >추천</span>
                        <input type="radio" 
                            :checked="this.level==1?'checked':''" 
                            name="level"
                            @click="_onSelectLevel(1)"
                            />
                        <span class="checkmark"></span>
                    </label>                    
                </div>
                <div class="subpanelContents"> 
                    <label class="checkcontainer">레벨 2 <span class="pick"  v-if="fixValue==2" >추천</span>
                        <input type="radio"  
                            :checked="this.level==2?'checked':''" 
                            @click="_onSelectLevel(2)"
                            name="level" />
                        <span class="checkmark"></span>
                    </label> 
                </div>
                <div class="subpanelContents"> 
                    <label class="checkcontainer">레벨 3 <span class="pick" v-if="fixValue==3" >추천</span>
                        <input type="radio" 
                            :checked="this.level==3?'checked':''" 
                            @click="_onSelectLevel(3)"
                            name="level" />
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="head"><img src="img/parent/setup_child_head2.png" @click="_onShowHelp('playmode')" /></div>
            <div class="subpanel">
                <div class="subpanelContents"> 
                    <label class="checkcontainer">씩씩한 탐험가 ( 자유롭게 )
                        <input type="radio" 
                            :checked="this.playMode==1?'checked':''" 
                            @click="_onSelectPlayMode(1)"
                            name="playmode" />
                        <span class="checkmark"></span>
                    </label>                    
                </div>
                <div class="subpanelContents"> 
                    <label class="checkcontainer">꼼꼼한 과학자 ( 순서대로 )
                        <input type="radio" 
                            :checked="this.playMode==2?'checked':''" 
                            @click="_onSelectPlayMode(2)"
                            name="playmode" />
                        <span class="checkmark"></span>
                    </label> 
                </div>
            </div>
        </div>

        <div class="col">
            <div class="head"><img src="img/parent/setup_child_head3.png" @click="_onShowHelp('time')"/></div>
            <div class="subpanel">
                <div class="timer"> <img src="img/parent/timer.png" /> {{this.timerValueString}} </div>
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
                    @onValueChanging="_onTimerChanging"
                    @onValueChanged="_onTimerChange"
                    />        
                <div class="subpanelContents"> 
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
    </div>
</template>

<style lang="scss" scoped>
.SetupChild {
    overflow-y: scroll;
    display: flex;
    flex-wrap:wrap;
    justify-content: center;
    padding: 110px 0 90px;

    width: 100%;
    height: auto;
    
    background-color: #f0f0f0;
    &::-webkit-scrollbar{display: none;}
    .col{
        display:flex;
        flex-wrap:wrap;
        flex-direction: column;
        align-items: center;
        justify-items: center;

        margin-top: 20px;
        padding: 1rem 2rem 2rem;
        box-sizing: border-box;
        /* width: calc( 90% - 40px); */
        min-width: 800px;

        background-color: #FFF;
        border-radius: 20px;
        
    }
    .row{
        margin-top: 20px;
        padding: 8px;
        width: calc( 90% - 40px);
        background-color: #FFF;
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        
    }
    .head{
        position:relative;
        width: 95%;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        // font-weight: bold;
        font-size: 1.2rem;
        img{
            cursor: pointer;
        }
    }
    .subpanel{
        overflow: hidden;
        display:flex;
        flex-direction: column;

        padding: 20px ;
        width: calc( 100% - 40px);
        
        background-color: #f6f6f6;
        border-radius: 10px;
        box-sizing:border-box;

        .subpanelContents{
            width:100%;
            height:3.5rem;
            line-height:3.5rem;
            
            border-bottom: 2px solid #e3e3e3;
            margin: 0 10px;
            .pick{
                color: #44a231;
                font-size: 0.8rem;
                font-family: Arial;
            }
        }
        .subpanelContents:last-child{
            border-bottom: none;
            padding-bottom: 0px;
            
        }
    }
    .userStat{
        max-width: 800px;
        background-color:#cbe697;
        padding-top: 20px;
        padding-bottom: 20px;
        
        .name{
            font-weight: 600;
            font-size: 1.7rem;
        }
        .birth{
            margin-top: 0.4rem;
            margin-left: 1rem;
            font-size: 1.1rem;
            letter-spacing: -0.05rem;
        }
    }

    .timer{
        margin-top: 30px;
        width:100%;
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        img{ 
            margin-right: 20px;
        }
    }

    //Customize the label (the container)
    .checkcontainer{
        // display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 22px;
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
}

</style>

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import Axios from "axios"
import Slider from "./components/Slider.vue"
import Graph from "./components/Graph.vue"
import CircleGraph from "./components/CircleGraph.vue"
import { UserModule } from '../../store/UserStore';
import { SystemModule } from '../../store/System';
import { PlayLevel, PlayMode } from '../../store/Define';
import { ParentSetupModule } from '@/store/ParentSetup';

@Component({
    components:{
        Slider,
        Graph,
        CircleGraph
    }
})
export default class SetupChild extends Vue {
    private fixValue= 2;
    private mValue= 2;
    
    get childName(): string{
        return UserModule.homeData.userInfo.childNm;
        // if( SystemModule.isDemoMode ){
        //     return "Demo";
        // }else{
        //     return UserModule.userInfoJWT.childName;
        // }
    }

    get level(): number{
        if( UserModule.childSetting.lrngChoLvlCd == PlayLevel.easy ) return 1;
        if( UserModule.childSetting.lrngChoLvlCd == PlayLevel.normal ) return 2;
        if( UserModule.childSetting.lrngChoLvlCd == PlayLevel.hard ) return 3;
        return -1;
    }

    get playMode(): number{
        if( UserModule.childSetting.lrngModeCd == PlayMode.free ) return 1;
        if( UserModule.childSetting.lrngModeCd == PlayMode.step ) return 2;
        return -1;        
    }

    get timerValue(){
        return Math.floor(UserModule.childSetting.playPosbTime/60);
    }
    get timerValueString(){
        if( UserModule.childSetting.isNonLimitToPlay ) return "무제한"
        else{
            return this.timerValue+"분"
        }
    }
    get isUnlimitMode(){ return UserModule.childSetting.isNonLimitToPlay }

    get birthString(){
        // return UserModule.birthData.birthday;
        return UserModule.homeData.userInfo.birthDay;
        // if( SystemModule.isDemoMode ){
        //     return "----.--.--";
        // }else{
        //     return UserModule.homeData.userInfo.birthday;
        // }
    }
    async mounted(){
        
        const user = this.birthString;
        const year = new Date().getFullYear();
        const month = new Date().getMonth()+1 + (  ( year - parseInt( user.slice(0,4) ) ) * 12  ) ;
        if(  month - parseInt(user.slice(4,6)) < 24 )  {this.mValue = 1;}
        if(  month - parseInt(user.slice(4,6)) >= 24 && month - parseInt(user.slice(4,6)) < 48  ) 
                {this.mValue = 2;}
        if(  month - parseInt(user.slice(4,6)) >= 48 )  {this.mValue = 3;}

        console.log(`%c ${user.slice(0,4)}  ${user.slice(4,6)}       user`,"color:red;")
        console.log(`%c ${year}  ${new Date().getMonth()+1}       current`,"color:blue;")
        console.log(`%c ${month - parseInt(user.slice(4,6))}개월`,"color:green; font-weight: bold;")

        this.fixValue = this.mValue;
        //
        // const response = await Axios.post('https://api.arambookclub.com/babytube/getContentsList',{
        //     uid: "XXX",
        //     filter: "step1",
        //     bookID: "1001"
        // });
        // console.log( response );
        // this.mTimerValue = UserModule.userInfo.playAvailMinutes;
    }
    
    private _onSelectLevel( idx: number ){
        if( idx == 1){ UserModule.childSetting.lrngChoLvlCd = PlayLevel.easy }
        if( idx == 2){ UserModule.childSetting.lrngChoLvlCd = PlayLevel.normal }
        if( idx == 3){ UserModule.childSetting.lrngChoLvlCd = PlayLevel.hard }
        console.log( "Select level: ", UserModule.childSetting.lrngChoLvlCd );
        UserModule.setChildSetting( UserModule.childSetting );
    }

    private _onSelectPlayMode( idx: number ){
        if( idx == 1){ UserModule.childSetting.lrngModeCd = PlayMode.free }
        if( idx == 2){ UserModule.childSetting.lrngModeCd = PlayMode.step }
        console.log( "Select Mode: ", UserModule.childSetting.lrngModeCd );
        UserModule.setChildSetting( UserModule.childSetting );
    }

    private _toggleUnlimited(){
        // if( UserModule.childSetting.playPosbTime== -1 ){
        //     UserModule.childSetting.playPosbTime = 30;
        // }else{
        //     UserModule.childSetting.playPosbTime = -1;
        // }
        UserModule.childSetting.isNonLimitToPlay = !UserModule.childSetting.isNonLimitToPlay;
        UserModule.setChildSetting( UserModule.childSetting );
    }

    private _onTimerChanging(v){
        UserModule.childSetting.playPosbTime = v*60;
    }
    private _onTimerChange(v){
        UserModule.childSetting.playPosbTime = v*60; 
        UserModule.setChildSetting( UserModule.childSetting );
    }

    _onClickBack(){
        this.$emit('onClickBack')
    }

    _onClickMenu(){
        this.$emit('onShowMainMenu')
    }

    _onShowHelp( label: string){
        
        if( label == "level"){
            // SystemModule.popup.showMessageHelp( "자녀의 생년월일을 기준으로 레벨을 추천하며 <br/> 레벨은 월령별 인지 능력에 따라  <span style=`display:inline-block;font-size:1.4rem;font-weight:600;`>활동난이도</span>에<br/> 차이를 두었습니다." );
            SystemModule.popup.showMessageHelp( "<span style='font-size:1.1rem;line-height:10%; ' >레벨은 월령별 인지능력에 따라 활동난이도에 차이를 두었습니다.<br/> 만 2세 이하 자녀는 레벨1을 선택합니다. <br/>먼저 베이비 튜브 영상과 다양한 영어 노래를 들려주시고,<br/> 이후 스토리 북스, 알파벳 스쿨을 병행하면서 자연스럽게 <br/>영어놀이활동을 경험해 보시는 것을 추천합니다.</span>" );
        }else if( label == "playmode"){
            SystemModule.popup.showMessageHelp( "자녀의 성향에 맞는 진행 모드를 선택해 주세요.<br/>스토리북스를 자유롭게 선택 활동하는<br/><span style='font-size:1.4rem;font-weight:600; color:#97c83b; '>탐험가 모드</span>와 정해진 순서대로 하는<br/><span style='font-size:1.4rem;font-weight:600;  color:#97c83b;' >과학자 모드</span>가 있습니다." );
        }else if( label == "time"){
            SystemModule.popup.showMessageHelp( '자녀와 약속한 시간을 수정할 수 있습니다.<br/>시간이 다되면 활동을 할 수 없습니다.<br/>시간 완료시 뜨는 화면의 <strong style="font-size:1.4rem; color:#97c83b;">"Restart"</strong> 버튼을 누른 후<br /> 수식을 입력하시면 다시 활동 가능합니다.' );
        }
    }
}
</script>
 