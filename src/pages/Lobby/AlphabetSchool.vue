<template>
  <div class="AlphabetSchool">
    <h1>알파벳스쿨 메인</h1>
    <!-- <AlphabetSelectBoardSwiper @onSelectItem="_onSelectItem" /> -->

    <AlphabetSelectBoard 
        @onSelectItem="_onSelectItem"
        ref="AlphabetSelectBoard" 
        style="z-index:1"
    />

    <!-- <div class="nextBTN" @click="_goRight" > 
        <img src="img/alphabet/12_alphabet_arrow_2.png" alt="오른쪽 화살표">
    </div>
    <div class="prevBTN" @click="_goLeft"  >
        <img src="img/alphabet/12_alphabet_arrow_1.png" alt="왼쪽 화살표">
    </div> -->
    <!-- <AlphabetSelectBoard2 @onSelectItem="_onSelectItem" v-show="boardStep" ref="step2" />
    <AlphabetSelectBoard3 @onSelectItem="_onSelectItem" v-show="boardStep" ref="step3" /> -->
    
  </div>
</template>

<style lang="scss" scoped>
.AlphabetSchool {
    overflow: hidden;
    position:relative;
    width: inherit;
    height: 630px;
    h1 {
        display: none;
        width: inherit;
        color: #fff;
        text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        text-align: center;
    }
    /* .nextBTN , .prevBTN{
        display:block;

        position: absolute;
        top:52%;
        left:1200px;
        margin-top:-2.5rem;

        width: 5rem;
        height:5rem;
        z-index: 2;
        cursor:pointer;
        opacity:1;
    }
    .prevBTN{
        left:30px;
    } */
}
</style>

<script lang="ts">

import { Component, Prop, Vue,Watch } from "vue-property-decorator";
import AlphabetSelectBoard from "./alphabet/AlphabetSelectBoard.vue";
import { AlphabetModule } from '@/store/Alphabet';
import gsap from 'gsap';

@Component({
    components:{
        AlphabetSelectBoard,
    }
})
export default class AlphabetSchool extends Vue {
    // private boardStep =1;
    // private mClickFlag = true;
    $refs: {
        AlphabetSelectBoard: AlphabetSelectBoard;
    }
mounted(){
    // this.boardStep=1;
    // this.disButton();
    // window.addEventListener("mousewheel",(evt)=>{ this.disButton(); });
}

    // private _goRight(){
    //     if(this.mClickFlag){
    //         if(this.boardStep==3)return;
    //         this.mClickFlag = false;
    //         this.$refs.AlphabetSelectBoard.goRight(this.boardStep);
    //         this.boardStep +=1;
    //         this.disButton();
    //         gsap.delayedCall(0.5,()=>{  this.mClickFlag = true; })
    //     }
    // }
    // private _goLeft(){
    //     if(this.mClickFlag){
    //         if(this.boardStep==1)return;
    //         this.mClickFlag = false;
    //         this.$refs.AlphabetSelectBoard.goLeft(this.boardStep);
    //         this.boardStep -=1;
    //         this.disButton();
    //         gsap.delayedCall(0.5,()=>{  this.mClickFlag = true; })
    //     }
    // }

    // private disButton(){
    //     if(document.getElementsByClassName('prevBTN').length==0 && document.getElementsByClassName('nextBTN').length==0){return;}
    //     if (this.boardStep==1 ){
    //         gsap.to(document.getElementsByClassName('prevBTN')[0] , {alpha:0, duration:0.5} )
    //     }
    //     else { gsap.to(document.getElementsByClassName('prevBTN')[0] , {alpha:1, duration:0.5} ) }

    //     if (this.boardStep==3 ){  
    //         gsap.to(document.getElementsByClassName('nextBTN')[0] , {alpha:0, duration:0.5} )
    //     }else { gsap.to(document.getElementsByClassName('nextBTN')[0] , {alpha:1, duration:0.5} ) }

    // }

    private _onSelectItem(alphabet: string){
        this.$emit( "onShowAlphabetSchool", alphabet );
    }

    // private _getBoardStep (flag: boolean){
    //     if(flag){
    //         if(this.boardStep>=3){
    //             this.boardStep=3; 
    //             return;
    //         }
    //         this.boardStep+=1;    
    //     }else{
    //         if(this.boardStep<=1){
    //             this.boardStep=1; 
    //             return;
    //         }
    //         this.boardStep-=1;    
    //     }
    // }
}
</script>
