<!-- 부모 설정화면 -->
<template>
<div class="intro">
    <div class="row" style="margin-top:154px;">
        <img src="img/firstconfig/babyallabc_bi.png" />    
    </div>
    <p class="comment">
        자녀에 관한 모든 리포트 및 가이드는 맘앤대디에 있습니다.
        <!-- 자녀에 관한 모든 리포트 및 가이드는 Mom&Daddy에 있습니다. -->
    </p>
    <div class="row">
        <div class="btn" @click="_next"> 시작 </div>
    </div>
    
</div>
</template>

<style lang="scss" scoped>
.intro{
    position:relative;
    width:100%;
    height: 720px;
    box-sizing: border-box;
    .bi{
        position: absolute;
        bottom: 40px;
        right: 30px;
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
        font-size: 55px;
        .title{
            font-family: 'Noto sans';
            font-size: 60px;
            font-weight: bold;
        }    
    }
    .comment{
        display:block;
        position:absolute;
        top:50%;
        left:50%;
        margin-top:2rem;
        transform: translate(-50%,-50%);
        width:80%;
        text-align: center;
        text-shadow: none;
        font-family: 'Noto sans';
        color: #516243;
        font-size: 30px;
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
        background-color: #d9555a;
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
export default class End extends Vue {
    
    async mounted(){
        //
    }

    _next(){
        this.$emit("onSaveSetting");
    }
    
}
</script>
