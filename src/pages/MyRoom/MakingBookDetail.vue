<!-- 부모 설정화면 -->
<template>
<div class="MakingBookDetail" @click.stop="_close">
    <div class="MakingBookCase">
        <div class="info">
            <img class="bookimg" :src="this.imagePath"/>
            
        </div>

        <div class="starinfo">
            <div class="row">
                <span>{{this.date}}</span>
            </div>
        </div> 
    </div>

</div>
</template>

<style lang="scss" scoped>
.MakingBookDetail{
    position: fixed;
    top:50%;
    left:50%;
    width:100%;
    height: calc(100% + 2px);
    border: 2px black solid;
    box-sizing: border-box;
    transform: translate(-50%,-50%);
    background-color: rgba(0,0,0,0.8);
    z-index: 100000000;
    .MakingBookCase{
        position: absolute;
        top:50%;
        left:50%;
        width:100%;
        max-width:800px;
        height:100%;
        transform: translate(-50%,-50%);
        cursor: pointer;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .info{
            width: 100%;
            position:relative;
        }
    }
    .bookimg{
        width: 100%;
    }
    .starinfo{
        background-color: #f0f0f0;
        width:calc( 100% - 80px );
        margin-top: -6px;
        padding: 10px;
        padding-left: 40px;
        padding-right: 40px;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
    }
    .row{
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 80px;
        span{
            margin-left: 20px;
            font-size: 1.5rem;
            color: #888;
        }
    }
}
</style>

<script lang="ts">
import Config from '@/Util/Config';
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components:{
    }
})
export default class MakingBookDetail extends Vue {
    @Prop({default:`${Config.packageURL}/bookcover/1001_cover.png`}) private imagePath: string;
    @Prop({default:``}) private date: string;

    _close(){
        this.$emit("onClose");
    }
}
</script>
