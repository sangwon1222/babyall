<template>
<div class="StoryBook">
    
    <div class="step-group" @pointerover="_onOffSwiper(false)" @pointerleave="_onOffSwiper(true)">
        <img class="step_bg" src="img/storybooks/step_bar.png"  @click="_selectStep()" >
        <img class="step1_btn" src="img/storybooks/btn_step1.png" v-show="currentStep == 'step1'" />
        <img class="step2_btn" src="img/storybooks/btn_step2.png" v-show="currentStep == 'step2'" />
    </div>

    <div v-show="currentStep == 'step1'" class="book-container">
        <BookItem
            v-for="bookID in mBookList.step1"
            :key="bookID"
            :bookID="bookID"
            @onSelectItem="_onSelectItem"
        ></BookItem>
    </div>

    <div v-show="currentStep == 'step2'" class="book-container">
        <BookItem
            v-for="bookID in mBookList.step2"
            :key="bookID"
            :bookID="bookID"
            @onSelectItem="_onSelectItem"
        ></BookItem>
    </div>

</div>
</template>

<style lang="scss" scoped>
.StoryBook {
    width: inherit;
    height: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 630px;
    .step-group {
        position: relative;
        margin-top: 50px;
        .step_bg{
            cursor: pointer;
            position: relative;
            justify-self: center;
        }
        .step1_btn{
            position: absolute;
            left:0px;
        }
        .step2_btn{
            position: absolute;
            right:0px;
        }
    }

    .book-container {
        background-color:#FFF;
        position: relative;
        margin-top: 20px;
        
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        
        padding:0 40px;
        width: 1200px;
        height: 960px;
        // overflow: hidden;
        overflow-y: scroll;
        
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    
    }
    .book-container::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}

}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BookItem from "./storybooks/BookItem.vue"
import Util from '@/Util'
import { Storybooks } from "@/store/Define"
import { StoryBooksModule } from '@/store/StoryBooks';
import { SystemModule } from '@/store/System';

@Component({
    components:{
        BookItem
    }
})
export default class StoryBook extends Vue{
    private mCurrentStep = "step1";
    
    private mBookList = Util.Config.bookList ;

    get currentStep(){ 
        if(  this.mCurrentStep == undefined )  this.mCurrentStep = "step1"
        return this.mCurrentStep 
    }

    mounted(){
        this.mCurrentStep = "step1";
        if( SystemModule.isDemoMode  == false) StoryBooksModule.getFinishResultInfoData();
    }

    _onOffSwiper(flag){
        this.$emit("_onOffSwiper",flag)
    }

    _selectStep() {
        if( this.mCurrentStep == 'step1' ) {
            this.mCurrentStep = 'step2'
        }else{
            this.mCurrentStep = 'step1'
        }
    }

    _onSelectItem( bookID: string ){
        if( SystemModule.isDemoMode == true ){
            this.$emit("onShowStoryBook", bookID, "movie" );
        }else{
            this.$emit("onShowStoryBook", bookID, StoryBooksModule.finishResultData[bookID].currentAcvt );
        }
    }
}
</script>
