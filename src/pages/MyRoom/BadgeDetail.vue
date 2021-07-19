<!-- 부모 설정화면 -->
<template>
<div class="BadgeDetail" @click.stop="_close">
    <div class="info">
        <img class="bookimg" :src="_getBookCoverImagePath()"/>
        <div class="starGroup">
            <img v-if="this._isShowStar(1)" src="img/myroom/badge_1.png"/>
            <img v-if="this._isShowStar(2)" src="img/myroom/badge_2.png"/>
            <img v-if="this._isShowStar(3)" src="img/myroom/badge_3.png"/>
        </div>
    </div>

    <div class="starinfo">
        <div class="row"><img src="img/myroom/badge_1.png" width="64"/><span style="font-weight:bold; color:#000;">Lv1</span><span>{{_getRecordLabel(1)}}</span></div>
        <div class="row"><img src="img/myroom/badge_2.png" width="64"/><span style="font-weight:bold; color:#000;">Lv2</span><span>{{_getRecordLabel(2)}}</span></div>
        <div class="row"><img src="img/myroom/badge_3.png" width="64"/><span style="font-weight:bold; color:#000;">Lv3</span><span>{{_getRecordLabel(3)}}</span></div>
    </div> 

</div>
</template>

<style lang="scss" scoped>
.BadgeDetail{
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    width:100%;
    height: calc(100% + 2px);
    background-color: rgba(0,0,0,0.8);
    cursor: pointer;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border: 2px black solid;
    box-sizing: border-box;
    .info{
        width: 100%;
        max-width:600px;
        position:relative;
    }
}
.bookimg{
    width: 100%;
}
.starGroup{
    width:100%;
    position:absolute;
    bottom:25px;
    display:flex;
    flex-direction: row;
    justify-content: center;
    // align-items: center;
}
.starinfo{
    margin-top: -6px;
    padding: 10px;
    padding-left: 40px;
    padding-right: 40px;

    width:100%;
    max-width:600px;

    box-sizing: border-box;
    background-color: #f0f0f0;
    // border-bottom-left-radius: 30px;
    // border-bottom-right-radius: 30px;
}
.row{
    display: flex;
    flex-direction: row;
    align-items: center;
    span{
        margin-left: 20px;
        font-size: 1.5rem;
        color: #888;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Util from '@/Util'
import { MyRoom } from '@/store/Define'

@Component({
    components:{
    }
})
export default class BadgeList extends Vue {
    @Prop({default:1001}) private bookid: number;
    @Prop({default:1}) private star: number;
    @Prop({
        default:()=>{
            return{
                rcvdBadgeLv1Date:null,
                rcvdBadgeLv2Date:null,
                rcvdBadgeLv3Date:null,
            }
        }
    }) private starInfo: MyRoom.BadgeInfo;
    
    mounted(){
        //
    }

    _isShowStar( idx: number ){
        if( idx == 1){
            return this.starInfo.rcvdBadgeLv1Date != null;
        }else if( idx == 2){
            return this.starInfo.rcvdBadgeLv2Date != null;
        }else if( idx == 3){
            return this.starInfo.rcvdBadgeLv3Date != null;
        } 
    }
    _getRecordLabel( idx: number ){
        if( idx == 1 ) return this.starInfo.rcvdBadgeLv1Date==null?"":this.starInfo.rcvdBadgeLv1Date;
        else if( idx == 2 ) return this.starInfo.rcvdBadgeLv2Date==null?"":this.starInfo.rcvdBadgeLv2Date;
        else if( idx == 3 ) return this.starInfo.rcvdBadgeLv3Date==null?"":this.starInfo.rcvdBadgeLv3Date;
        return "";
    }
    _getBookCoverImagePath(){
        return `${Util.Config.packageURL}/bookcover/${this.bookid}_cover.png`
    }

    _close(){
        this.$emit("onClose");
    }
}
</script>
