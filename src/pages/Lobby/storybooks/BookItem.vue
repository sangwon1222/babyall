<template>
<div class="BookItem">
    <img class="img-button" :src="this.BookCoverImagePath"  @click="_onClick"/>
    
    <div v-if="info.isLocked" class="not-finished">
        <img class="lockimg" src="img/storybooks/lock.png"/>
    </div>
    
    <div class="star-group">
        <img
            class="star"
            v-for="idx in 3"
            :key="idx"
            :src="idx < starCount+1 ? 'img/storybooks/star.png' : 'img/storybooks/star_disable.png'"
        />
    </div>
</div>
</template>

<style lang="scss" scoped>
.BookItem {
    position: relative;
    margin: 0.5rem;
    width: 250px;
    cursor: pointer;

    .lockimg{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .img-button {
        width: 100%;
        height: 95%;
        background-color: #000;
        border-radius: 20px;
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
        // transition: all 0.2s;
    }
    .star-group {
        position: absolute;
        left: 50%;
        bottom: 20px;
        height: 40px;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        padding:5px 10px 0;
        border-radius: 20px;
        .star{
            padding: 3px;
        }
    }
    .not-finished {
        width: 100%;
        height: 95%;
        border-radius: 20px;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.4);
    }
}
</style>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Util from '@/Util'
import { Storybooks } from '@/store/Define'
import { StoryBooksModule } from '@/store/StoryBooks';

@Component({
    components:{
    }
})
export default class BookItem extends Vue{
    @Prop( { default: 1001 } ) private bookID: number;
   
    get info(): Storybooks.FinishResultInfo{
        // console.log( StoryBooksModule.finishResultData );
        if( StoryBooksModule.finishResultData == null){
            return {
                bookID: this.bookID,
                cpltAcvtCnt: this.bookID != 2004?0:7,
                currentAcvt: "movie",
                isLocked: this.bookID != 2004
            }
        }else{
            if( StoryBooksModule.finishResultData[this.bookID] === undefined ){
                return {
                    bookID: this.bookID,
                    cpltAcvtCnt:0,
                    currentAcvt: "catch",
                    isLocked: this.bookID != 2004
                }   
            }
            return StoryBooksModule.finishResultData[this.bookID];
        }        
    }

    get BookCoverImagePath(){
        return `${Util.Config.packageURL}/bookcover/${this.info.bookID}_cover.png`
    }
    get starCount() {
        if (this.info.cpltAcvtCnt >= 0 && this.info.cpltAcvtCnt < 2) {
            return 0;
        }
        if (this.info.cpltAcvtCnt >= 2 && this.info.cpltAcvtCnt < 5) {
            return 1;
        }
        if (this.info.cpltAcvtCnt >= 5 && this.info.cpltAcvtCnt < 7) {
            return 2;
        }
        if (this.info.cpltAcvtCnt >= 7) {
            return 3;
        }
        return 0;
    }

    _onClick(){
        this.$emit("onSelectItem", this.info.bookID );            
    }
}
</script>
