<!-- 부모 설정화면 -->
<template>
<div class="intro">
    <p class="head"><strong class="title">베이비올 영어</strong>에 오신걸 환영합니다.</p>
    <p class="comment">
        자녀 수준 맞춤 활동을 할 수 있도록<br/>
        자녀의 정보를 설정해 주세요.
    </p>
    <div class="row">
        <div class="btn" @click="_next"> 다음 </div>
    </div>
    <img class="bi" src="img/firstconfig/babyall_bi.png" />
    
</div>
</template>

<style lang="scss" scoped>
.intro{
    position: relative;
    width:1280px;
    height:720px;
    box-sizing:border-box;
    padding:5rem 0;
    .bi{
        position: absolute;
        bottom: 90px;
        right: 82px;
        width:8rem;
    }
    .row{
        // border: 1px solid #F00;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .head{
        text-align: center;
        font-family: 'Noto sans';
        color: #00736d;
        text-shadow: none;
        font-size: 1.8rem;
        
        margin-top:5rem;
        .title{
            font-family: 'Noto sans';
            font-size: 2.2rem;
            margin-top:0;
            font-weight: bold;
            letter-spacing: -0.1rem;
            display:inline-block;
        }    
    }
    .comment{
        text-align: center;
        text-shadow: none;
        font-family: 'Noto sans';
        color: #516243;
        font-size: 1.4rem;
        margin-top:5rem;
    }
    .btn{
        cursor: pointer;
        position:absolute;
        bottom:90px;
        left:50%;
        transform: translateX(-50%);
        padding: 20px;
        
        width:300px;
        height:80px;

        text-align: center;
        font-family: 'Noto sans';
        font-size: 24px;
        text-shadow: none;
        line-height:40px;

        border-radius: 50px;
        background-color: #93c340;
        box-sizing: border-box;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components:{
    }
})
export default class Intro extends Vue {
    
    async mounted(){
        //
    }

    _next(){
        this.$emit("onChangeView","Level");
    }
    
}
</script>
