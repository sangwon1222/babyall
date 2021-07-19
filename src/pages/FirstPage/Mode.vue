<!-- 부모 설정화면 -->
<template>
<div class="level">
    <div class="head">진행 모드</div>
    <div class="row">
        <div class="subpanel">
            <div class="subpanel-contents"> 
                <label class="checkcontainer">씩씩한 탐험가 ( 자유롭게 )
                    <input type="radio" 
                        :checked="this.value==1?'checked':''" 
                        name="level"
                        @click="_select(1)"
                        />
                    <span class="checkmark"></span>
                </label>                    
            </div>
            <div class="subpanel-contents"> 
                <label class="checkcontainer">꼼꼼한 과학자 ( 순서대로 )
                    <input type="radio"  
                        :checked="this.value==2?'checked':''" 
                        @click="_select(2)"
                        name="level" />
                    <span class="checkmark"></span>
                </label> 
            </div>
            
        </div>
    </div>
    <div class="row">
        <ul class="list">
            <li>자녀의 성향에 맞게 선택해 주세요. 도서선택을 자유롭게 하는 <span>탐험가 모드</span>와 순서대로 하는 <span>과학자 모드</span>가 있습니다.</li>
            <li style="margin-top:0.6rem;">진행 모드는 변경 가능합니다.</li>
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
    flex-direction: row;
    justify-content: center;
    margin-top: 50px;
}
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
.subpanel{
    text-shadow:none;
    color: #000;
    background-color: rgba(255,255,255,0.5);
    padding: 20px;
    width: 1000px;
    display:flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    .subpanel-contents{
        width:50%;
        // border: 1px solid #FF0000;
        border-right: 2px solid #e3e3e3;
        padding: 1rem 2rem;
        box-sizing: border-box;
        .pick{
            color: #44a231;
            font-size: 0.8rem;
            font-family: Arial;
        }
    }
    .subpanel-contents:last-child{
        border: none;
    }
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
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components:{
    }
})
export default class Mode extends Vue {
    private mValue = 2;
    get value(): number{
        return this.mValue;
    }

    async mounted(){
        //
    }


    _select( v: number){
        this.mValue = v;
    }
    
    _next(){
        this.$emit("onSelectMode",this.mValue);
    }
}
</script>
