<!-- 부모 설정화면 -->
<template>
<div class="level">
    <div class="head">추천 레벨</div>
    <div class="row" style="margin-top:3rem;">
        <div class="subpanel">
            <div class="subpanel-contents"> 
                <label class="checkcontainer">레벨 1 <span class="pick" v-if="fixValue==1" >추천</span>
                    <input type="radio" 
                        :checked="this.value==1?'checked':''" 
                        name="level"
                        @click="_select(1)"
                        />
                    <span class="checkmark"></span>
                </label>                    
            </div>
            <div class="subpanel-contents"> 
                <label class="checkcontainer">레벨 2 <span class="pick"  v-if="fixValue==2">추천</span>
                    <input type="radio"  
                        :checked="this.value==2?'checked':''" 
                        @click="_select(2)"
                        name="level" />
                    <span class="checkmark"></span>
                </label> 
            </div>
            <div class="subpanel-contents"> 
                <label class="checkcontainer">레벨 3 <span class="pick"  v-if="fixValue==3">추천</span>
                    <input type="radio" 
                        :checked="this.value==3?'checked':''" 
                        @click="_select(3)"
                        name="level" />
                    <span class="checkmark"></span>
                </label>
            </div>
        </div>
    </div>
    <div class="row">
        <ul class="list">
            <li >자녀의 생년월일을 기준으로 레벨을 추천하며 레벨은 월령별 인지 능력에 따라 활동 난이도에 차이가 있습니다.</li>
            <!-- <li style="margin-top:0.6rem;">학습레벨은 변경 가능합니다.</li> -->
            <li style="margin-top:0.6rem;">
                만 2세 이하 자녀는 레벨1을 선택합니다. 먼저 베이비 튜브 영상과 다양한 영어 노래를 들려주시고, 이후 스토리 북스, 알파벳 스쿨을 병행하면서 자연스럽게 영어놀이활동을 경험해 보시는 것을 추천합니다. 
            </li>
            
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
    width:100%;
    height:100%;
    background-color: #f0f0f0;
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

.row{
    // border: 1px solid #F00;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    margin-top: 50px;    
    opacity:0;
    animation: forwards 1s pick;
}
@keyframes pick { from{opacity:0;} to{opacity:1;} }
.list{
    color: #000;
    text-shadow: none;
    width:910px;
    padding-left:40px;
    li{
        font-family: 'Noto sans';
        font-size: 1rem;
        font-weight: bold;
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
.subpanel{
    display:flex;
    flex-wrap:wrap;
    align-items: center;
    justify-content: space-between;
    
    width: 920px;

    border-radius: 30px;
    text-shadow:none;
    color: #000;
    background-color: rgba(255,255,255,0.6);
    .subpanel-contents{
        position: relative;
        width:300px;
        height:100px;
        // border: 1px solid #FF0000;
        border-right: 2px solid #e3e3e3;
        padding: 2rem;
        box-sizing:border-box;
        .pick{
            color: #44a231;
            font-size: 0.8rem;
            font-family: Arial;
        }
    }
    .subpanel-contents:last-child{
        border-right: none;
        /* padding-bottom: 0px; */
    }
}

//Customize the label (the container)
.checkcontainer{
    // display: block;
    position:absolute;
    transform: translateY(-50%);
    top:50%;
    padding-left: 3rem;
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
    > input{
        position: absolute;
        width: 0; 
        height: 0;
        opacity: 0;
        cursor: pointer;
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
import { UserModule } from "@/store/UserStore";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components:{
    }
})
export default class Level extends Vue {
    private fixValue= 2;
    private mValue = 2;
    get value(): number{
        return this.mValue;
    }

       async mounted(){
        await UserModule.getBirthData();
        // const user = "201401";
        const user = UserModule.birthData.birthday;
        const year = new Date().getFullYear();
        const month = new Date().getMonth()+1 + (  ( year - parseInt( user.slice(0,4) ) ) * 12  ) ;

        console.log(`%c ${user.slice(0,4)}  ${user.slice(4,6)}       user`,"color:red;")
        console.log(`%c ${year}  ${new Date().getMonth()+1}       current`,"color:blue;")
        console.log(`%c ${month - parseInt(user.slice(4,6))}개월`,"color:green; font-weight: bold;")
        
        if(  month - parseInt(user.slice(4,6)) < 24 )  {this.mValue = 1;}
        if(  month - parseInt(user.slice(4,6)) >= 24 && month - parseInt(user.slice(4,6)) < 48  ) 
                {this.mValue = 2;}
        if(  month - parseInt(user.slice(4,6)) >= 48 )  {this.mValue = 3;}

        this.fixValue = this.mValue;
    }


    _select( v: number){
        this.mValue = v;
    }
    
    _next(){
        this.$emit("onSelectLevel", this.mValue);
    }
}
</script>
