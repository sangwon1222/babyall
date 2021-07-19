<template>
    <div class="dimmed">
        <div class="popup-body" @click.stop="">
            <img class="logo" src="img/parent/pop_logo.png">
            <div class="container">
                <div class="title">레벨 선택</div>
                <div class="subpanel">
                    <div class="subpanel-contents"> 
                        <label class="checkcontainer">레벨 1 <span class="pick">(0~24개월 권장)</span>
                            <input type="radio" 
                                :checked="this.value==1?'checked':''" 
                                name="level"
                                @click="_select(1)"
                                />
                            <span class="checkmark"></span>
                        </label>                    
                    </div>
                    <div class="subpanel-contents"> 
                        <label class="checkcontainer">레벨 2 <span class="pick">(24~48개월 권장)</span>
                            <input type="radio"  
                                :checked="this.value==2?'checked':''" 
                                @click="_select(2)"
                                name="level" />
                            <span class="checkmark"></span>
                        </label> 
                    </div>
                    <div class="subpanel-contents"> 
                        <label class="checkcontainer">레벨 3 <span class="pick">(48개월 이상 권장)</span>
                            <input type="radio" 
                                :checked="this.value==3?'checked':''" 
                                @click="_select(3)"
                                name="level" />
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>                
            </div>
            <div class="comment">
                <ul>
                    <li> 월령별 인지능력에 따라 레벨별 활동 난이도에 차이가 있습니다. </li>
                    <li> 권장 레벨은 참고 사항으로 자녀에게 맞는 레벨로 활동하도록 해주세요. </li>
                    <li> 레벨은 체험판을 시작할 때마다 다시 선택 가능합니다. </li>
                </ul>
            </div>
            <img class="submitBTN" src="img/submit.png" @click="_submit">
            
        </div>    
  </div>
</template>

<style lang="scss" scoped>
.dimmed {
    width: 102%;    
    height: 102%;
    position: absolute;
    top:-2px;
    left:-2px;
    background-color: rgba(0,0,0,0.8);
    /* z-index: 2; */
    z-index: 100;
    
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border: 2px #000 solid;
    box-sizing: border-box;
}
.popup-body{
    display:flex;
    flex-direction: column;
    align-items: center;
    position:relative;

    padding: 2rem;
    width: 1000px;
    height: 600px;

    border-radius: 20px;
    background-color: #39d1cd;
    box-sizing: border-box;
    .container{
        margin-top: 20px;
        background-color: #FFF;
        width: 800px;
        // height: 200px;
        border-radius: 20px;
        
        display:flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
        padding-bottom: 20px;
        .title{
            margin-top: 30px;
            font-size: 2rem;
            font-weight: 600;        
        }
    }
    .comment{
        margin-top:10px;
        width: 80%;
        li{
            font-size: 18px;
            padding-bottom: 10px;
        }
    }
    .submitBTN{
        margin-top: 20px;
        cursor: pointer;
    }

    .subpanel{
        display:flex;
        align-items: center;
        justify-content: space-between;
        text-shadow:none;
        color: #000;
        background-color: #FFFFFF;
        padding: 20px 0; 
        width: 100%;
        border-radius: 10px;

        box-sizing: border-box;
        .subpanel-contents{
            width:100%;
            // border: 1px solid #FF0000;
            border-left: 2px solid #e3e3e3;
            padding: 14px 6px;
            margin: 10px 0;
            .pick{
                color: #333;
                font-size: 15px;
                font-family: Arial;
            }
            &:first-child{
                border: none;
            }
        }
    }
}

.checkcontainer{
    // display: block;
    position: relative;
    padding-left: 40px;
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

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import { UserModule } from '@/store/UserStore';
import { SystemModule } from '@/store/System';

import Swal from 'sweetalert2'
 
@Component({})
export default class DemoLevelChoice extends Vue {
    private mValue = 2;
    get value(): number{
        return this.mValue;
    }

    mounted(){
        // console.log( UserModule.userInfo );
    }
    
    _select( v: number){
        this.mValue = v;
    }
    
    _submit(){
        //
        UserModule.SetDemoLevel( this.mValue );
    }
    
}
</script>
