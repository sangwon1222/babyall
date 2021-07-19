<!-- 부모 설정화면 -->
<template>
<div class="BadgeList">
    <Badge 
        v-for="bookid in bookIDList" :key="bookid" 
        :bookid="bookid" 
        :starInfo =" badgeData[bookid] "
        @onShowDetail="_showDetail"
        />
    <BadgeDetail 
        v-if="mBadgeDetailShowFlag" 
        @onClose="_closeDetail" 
        :bookid="this.mBadgeDetailBookID" 
        :starInfo=" this.mCurrentBadgeInfo "
        />
</div>
</template>

<style lang="scss" scoped>
.BadgeList{
    padding: 7rem 4rem 3rem;
    height: 100% ;
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content:flex-start;
    box-sizing:border-box;
}
.BadgeList::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Badge from './Badge.vue'
import BadgeDetail from './BadgeDetail.vue'
import { MyRoomModule } from "../../store/MyRoom"
import { MyRoom } from '@/store/Define'

@Component({
    components:{
        Badge,
        BadgeDetail
    }
})
export default class BadgeList extends Vue {
    
    private mBadgeDetailShowFlag = false;
    private mBadgeDetailBookID = 1001;
    private mCurrentBadgeInfo: MyRoom.BadgeInfo;

    get bookIDList(){ 
        if( MyRoomModule.badgeData == null) return [];
        return Object.keys(MyRoomModule.badgeData) 
    }
    get badgeData(){ 
        if( MyRoomModule.badgeData == null) return {};
        return MyRoomModule.badgeData 
    }

    async mounted(){
        await MyRoomModule.requestBadgeData();
        console.log( MyRoomModule.badgeData )
    }

    _showDetail( bookid: number, badgeInfo: MyRoom.BadgeInfo ){
        this.mBadgeDetailShowFlag = true;
        this.mBadgeDetailBookID = bookid;
        this.mCurrentBadgeInfo = badgeInfo;
        console.log( "_showDetail:", bookid);
    }

    _closeDetail(){
        this.mBadgeDetailShowFlag = false;        
    }

}
</script>
