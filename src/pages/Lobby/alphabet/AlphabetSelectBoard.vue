<template>
    <div class="AlphabetSelectBoard">
        <div class="container">
            <img src="img/alphabet/12_alphabet_bg.png" />
            <AlDisplayButton 
                ref="dispButton"
                v-for="(item,idx) in displayDataList" 
                :idx="idx" 
                :info="item" 
                :key="idx"
                @onSelectItem="_onSelectItem"
                ></AlDisplayButton>

            <div id="nextBTN" @click="goRight(mBoardStep)" > 
                <img src="img/alphabet/12_alphabet_arrow_2.png" alt="오른쪽 화살표">
            </div>
            <div id="prevBTN" @click="goLeft(mBoardStep)"  >
                <img src="img/alphabet/12_alphabet_arrow_1.png" alt="왼쪽 화살표">
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.AlphabetSelectBoard {
    overflow: hidden;
    overflow-x: scroll;
    position: absolute;
    top:-4.5rem;
    left:0;
    width: inherit;
    height: 720px;
    box-sizing: border-box;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
        
    .container{
        overflow: hidden;
        position:relative;
        width: calc(1280px *3);
        height: inherit;
        >img{
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
        }
    }
    #nextBTN , #prevBTN{
        display:block;

        position: absolute;
        top:56%;
        left:1200px;
        margin-top:-2.5rem;

        width: 5rem;
        height:5rem;
        z-index: 2;
        cursor:pointer;
        opacity:1;
    }
    #prevBTN{
        display:none;
        left:30px;
    }
    &::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}
}

</style>

<script lang="ts">

import { Component, Prop, Vue ,Watch } from "vue-property-decorator";
import gsap from "gsap";
import {displayData, AlphabetIconDisplayData} from "./displayData"
import AlDisplayButton from "./AlDisplayButton.vue"
import { AlphabetModule } from '@/store/Alphabet';
import { SystemModule } from '@/store/System';
import { UserModule } from "@/store/UserStore";

@Component({
    components:{
        AlDisplayButton
    }
})
export default class AlphabetSelectBoard1 extends Vue {
    private mBoardStep =1;
    private mWheelFlag=true;
@Watch('mBoardStep')
changeStep(cur , old){
    console.log(`${old}=>${cur}`);
    (document.getElementById('prevBTN') as HTMLDivElement).style.opacity="0";
    (document.getElementById('nextBTN') as HTMLDivElement).style.opacity="0";
    gsap.to(document.getElementById('nextBTN'),{alpha:1, duration:0.5}).delay(0.5)
    gsap.to(document.getElementById('prevBTN'),{alpha:1, duration:0.5}).delay(0.5)
    if(cur==1 ){ 
        if(this.$el.scrollLeft!=0)gsap.to(this.$el,{scrollLeft:0,duration:0.5});
        (document.getElementById('prevBTN') as HTMLDivElement).style.display="none";
        (document.getElementById('nextBTN') as HTMLDivElement).style.display="block";
        (document.getElementById('nextBTN') as HTMLDivElement).style.left="1200px"; 
    }
    if(cur==2 ){ 
        if(this.$el.scrollLeft!=1280)gsap.to(this.$el,{scrollLeft:1280,duration:0.5});
        (document.getElementById('prevBTN') as HTMLDivElement).style.display="block";
        (document.getElementById('nextBTN') as HTMLDivElement).style.display="block";
        (document.getElementById('prevBTN') as HTMLDivElement).style.left="1310px";
        (document.getElementById('nextBTN') as HTMLDivElement).style.left="2480px"; 
    }
    if(cur==3 ){ 
        if(this.$el.scrollLeft!=2560)gsap.to(this.$el,{scrollLeft:2560,duration:0.5});
        (document.getElementById('prevBTN') as HTMLDivElement).style.display="block";
        (document.getElementById('nextBTN') as HTMLDivElement).style.display="none"; 
        (document.getElementById('prevBTN') as HTMLDivElement).style.left="2590px";
    }
}
    get displayDataList(): Array<AlphabetIconDisplayData>{
        const displayData1 = [];
        for(let i=25;i>-1;i--){
            displayData1.push(displayData[i])
        }
        return displayData1;
    } 

    getCurrectAlphabet(){
        if( UserModule.homeData == null ) return "a";
        return UserModule.homeData.alphabetInfo
    }
    async mounted() {
        this.$el.scrollLeft =0;
        this.mWheelFlag = true;
        
            gsap.delayedCall(1,()=>{
                if(AlphabetModule.currentFocusSymbolIDX < 9)this.mBoardStep=1;
                if(AlphabetModule.currentFocusSymbolIDX > 8 &&AlphabetModule.currentFocusSymbolIDX <18)this.mBoardStep=2;
                if(AlphabetModule.currentFocusSymbolIDX > 17)this.mBoardStep=3;
            })
        // window.addEventListener("mousewheel",(evt)=>{
        //     if(this.mWheelFlag){
        //         this.mWheelFlag=false;
        //         if(evt['deltaY']>0){
        //             //위에서 아래로 휠
        //             if(this.$el.scrollLeft == 0 ){ 
        //                 gsap.to(this.$el,{scrollLeft: 1280,duration:0.5} ); 
        //                 this.getBoardStep(true)
        //             }
        //             if(this.$el.scrollLeft == 1280 ){ 
        //                 gsap.to(this.$el,{scrollLeft: 2560,duration:0.5} ); 
        //                 this.getBoardStep(true)
        //             }
        //             if(this.$el.scrollLeft == 2560 ){ 
        //                 gsap.to(this.$el,{scrollLeft: 2560,duration:0.5} ); 
        //                 this.getBoardStep(true)
        //             }
        //         }else{
        //             //아래에서 위로 휠
        //             if(this.$el.scrollLeft == 2560 ){ 
        //                 gsap.to(this.$el,{scrollLeft: 2560-1280,duration:0.5} ); 
        //                 this.getBoardStep(false)
        //             }
        //             if(this.$el.scrollLeft == 1280 ){ 
        //                 gsap.to(this.$el,{scrollLeft: 0,duration:0.5} ); 
        //                 this.getBoardStep(false)
        //             }
        //             if(this.$el.scrollLeft == 0 ){ 
        //                 gsap.to(this.$el,{scrollLeft: 0,duration:0.5} ); 
        //                 this.getBoardStep(false)
        //             }
        //         }
        //         gsap.delayedCall(0.5,()=>{
        //             this.mWheelFlag=true;
        //         })
        //     }
        // })
        console.log("mounted");
        if( SystemModule.isDemoMode == false ){
            await AlphabetModule.getFinishResultInfoData();
        }
        // console.log( AlphabetModule.finishResultData );
        this.$nextTick( ()=>{
            const self: HTMLDivElement = (this.$el as HTMLDivElement);
            const buttons = (this.$refs.dispButton as Vue[] );
            console.log( buttons );
            for( const v of buttons ){
                const btn: AlDisplayButton = (v as AlDisplayButton);
                if( btn.index == AlphabetModule.currentFocusSymbolIDX ){
                    const el: HTMLDivElement = (btn.$el as HTMLDivElement);            
                    self.scrollTop = el.offsetTop-700;
                }
            }
        });
    }

    goRight(step: number){
        if(step == 1){  
            this.mBoardStep = 2;
            gsap.to(this.$el,{scrollLeft:1280,duration:0.5});
        }
        if(step == 2){  
            this.mBoardStep = 3;
            gsap.to(this.$el,{scrollLeft:2560,duration:0.5});
        }
        if(step == 3){  
            this.mBoardStep = 3;
            gsap.to(this.$el,{scrollLeft:2560,duration:0.5});
        }
    }
    goLeft(step: number){
        if(step == 3){  
            this.mBoardStep = 2;
            gsap.to(this.$el,{scrollLeft:1280,duration:0.5});
        }
        if(step == 2){  
            this.mBoardStep = 1;
            gsap.to(this.$el,{scrollLeft:0,duration:0.5});
        }
        if(step == 1){  
            this.mBoardStep = 1;
            gsap.to(this.$el,{scrollLeft:0,duration:0.5});
        }
    }

    destroyed() {
        // console.log("destroyed");    
    }
    
    private _onSelectItem( alphabet: string){
        this.$emit( 'onSelectItem', alphabet );
    }
    private getBoardStep(flag){
        if(flag){
            if(this.mBoardStep>=3){
                this.mBoardStep=3; 
                return;
            }
            this.mBoardStep+=1;    
        }else{
            if(this.mBoardStep<=1){
                this.mBoardStep=1; 
                return;
            }
            this.mBoardStep-=1;    
        }
        // this.$emit( 'getBoardStep', flag );
    }
}

</script>
