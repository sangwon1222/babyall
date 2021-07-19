<!-- 부모 설정화면 -->
<template>
<div class="Badge"  @click.stop="_showDetail">
    <img class="bookimg" :src="_getBookCoverImagePath()"/>
    <div class="starGroup">
        <div class="imgCase"><img :src=" this._isShowStar(1)?'img/myroom/badge_1.png':'img/myroom/badge_1_dimmed.png'" width='93'/> </div>
        <div class="imgCase"><img :src="this._isShowStar(2)?'img/myroom/badge_2.png':'img/myroom/badge_2_dimmed.png'" width='93'/> </div>
        <div class="imgCase"><img :src="this._isShowStar(3)?'img/myroom/badge_3.png':'img/myroom/badge_3_dimmed.png'" width='93'/> </div>
    </div>
</div>
</template>

<style lang="scss" scoped>
.Badge{
    
    margin: 0.5rem;
    margin-bottom: 1rem;
    position: relative;
    cursor: pointer;
}

.bookimg{
    width: 13rem;
    height: 9.5rem;
    border-radius: 20px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
}

.starGroup{
    width:100%;
    height:4rem;
    position:absolute;
    bottom:5px;
    display:flex;
    flex-direction: row;
    justify-content: center;
    >.imgCase{
        width:calc(100%/4);
        >img{
            width:100%;
        }
    }
    // align-items: center;
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
export default class Badge extends Vue {
    @Prop({default:1001}) private bookid: number;
    @Prop({
        default:()=>{
            return null;
        }
    }) private starInfo: MyRoom.BadgeInfo;
    
    mounted(){
        //
        // console.log( this.starInfo );
    }

    // 해당 인덱스의 훈장을 보여야 하나?
    _isShowStar( idx: number ){
        if( this.starInfo == null ) return false;
        if( idx == 1){
            return this.starInfo.rcvdBadgeLv1Date != null;
        }else if( idx == 2){
            return this.starInfo.rcvdBadgeLv2Date != null;
        }else if( idx == 3){
            return this.starInfo.rcvdBadgeLv3Date != null;
        } 
    }
    _getBookCoverImagePath(){
        return `${Util.Config.packageURL}/bookcover/${this.bookid}_cover.png`
    }

    _showDetail(){
        this.$emit("onShowDetail", this.bookid, this.starInfo );
    }
}
</script>
