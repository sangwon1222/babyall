<!-- -->
<template>
<div class="BadgeList">
    
</div>
</template>

<style lang="scss" scoped>
.BadgeList{
    padding-top: 100px;
    height: 100%;
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.BadgeList::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Badge from './Badge.vue'
import BadgeDetail from './BadgeDetail.vue'

@Component({
    components:{
        Badge,
        BadgeDetail
    }
})
export default class BadgeList extends Vue {
    
    private mBookIDlist = [
        1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,
        1011,1012,1013,1014,1015,1016,1017,1018,1019,1020,

        2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,
        2011,2012,2013,2014,2015,2016
    ]

    private mBadgeDetailShowFlag = false;
    private mBadgeDetailBookID = 1001;
    mounted(){
        //
    }

    _showDetail( bookid: number){
        this.mBadgeDetailShowFlag = true;
        this.mBadgeDetailBookID = bookid;
        console.log( "_showDetail:", bookid);
    }

    _closeDetail(){
        this.mBadgeDetailShowFlag = false;        
    }

}
</script>
