<template>
    <div class="AlDisplayButton" :style="`top:${mPosY}px; left:${mPosX}px;`" @click="_onSelect">
        <img class="button" :src="buttonImage" />
        <img v-if="isShowLeftLine" class="guideL" :src="lineImage" />
        <img v-if="isShowRightLine" class="guideR" :src="lineImage" />
        <img v-show="_isFocused()" ref="cursor" class="cursor" src="img/alphabet/12_alphabet_marker.png" />
    </div>
</template>

<style lang="scss" scoped>

.AlDisplayButton {
    // border: 1px solid #FFF;
    position: absolute;
    width:96px;
    height: 110px;
    cursor:pointer;
    /* border:1px #000 solid; */
    img {
        position:absolute;
        top:0px;
        left:0px;
    }
    .button{
        top:0px;
        left:0px;
    }
    .guideL {
        /* top:120px;
        left:-115px;
        //세로형 */
        top:-80px;
        left:-60px;
        /* border:1px blue solid; */
    }
    .guideR {
        /* top:110px;
        left:140px; 
        // 세로형*/
        top:120px;
        left:-50px;
        /* border:1px red solid; */
    }
    .cursor{
        position:absolute;
        top:-40px;
        left:20px;
        animation : motion infinite 2s;
    }
    @keyframes motion {
        0%{top:-40px}
        50%{top:-60px}
        100%{top:-40px}
    }
    
}
</style>

<script lang="ts">

import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import gsap from "gsap";

import {AlphabetIconDisplayData, LineDirection} from "./displayData"
import {AlphabetModule} from "@/store/Alphabet"

@Component({
    components:{}
})
export default class AlDisplayButton extends Vue {
    @Prop({required: true}) public idx!: number;
    @Prop({required: true}) private info!: AlphabetIconDisplayData;
    
    private mPosX = 0;
    private mPosY = 0;
    
    get index(){ return this.idx }
    get buttonImage(): string{
        if( this._isFocused() ){
            return this.info.select;
            
        }else{
            if( this._isCleared() ){
                return this.info.normal;
            }else{
                return this.info.disable;
            }
        }
    }

    get lineImage(): string{
        // if( this.info.lineDir == LineDirection.left ){
        //     if( this._isCleared() ) return 'img/alphabet/12_alphabet_guide2.png';
        //     else return 'img/alphabet/12_alphabet_guide2_dis.png';
        // }else{
        //     if( this._isCleared() ) return 'img/alphabet/12_alphabet_guide1.png';
        //     else return 'img/alphabet/12_alphabet_guide1_dis.png';
        // }
        if( this.info.lineDir == LineDirection.left ){
            if( this._isCleared() ) {
                return 'img/alphabet/12_alphabet_guide2.png';
            }else {
                return 'img/alphabet/12_alphabet_guide1.png';
            }
        }else{
            if( this._isCleared() ) {
                return 'img/alphabet/12_alphabet_guide2.png';
            }else  {
                return 'img/alphabet/12_alphabet_guide1.png';
            }
        }
    }
    get isShowLeftLine(): boolean{
        return this.info.lineDir == LineDirection.left;
    }
    
    get isShowRightLine(): boolean{
        return this.info.lineDir == LineDirection.right;
    }
    
    get currFocusIDX(){
        return AlphabetModule.currentFocusSymbolIDX;
    }
    @Watch("currFocusIDX")
    onChangeFocusIDX( curr: number, old: number ){
        if( this._isFocused() ){
            const self: HTMLDivElement = (this.$el as HTMLDivElement);
            const parent: HTMLDivElement = (self.offsetParent as HTMLDivElement);
            
        }
        console.log( "onChangeFocusIDX", old, curr);
    }
    mounted() {
        // console.log("mounted", this.info.alphabet, this.idx);
        this.mPosX = this.info.x;
        this.mPosY = this.info.y;

        // 부모의 스크롤을 현재 커서로 맞춰놓는다.
        //this.$nextTick( ()=>{
            const self: HTMLDivElement = (this.$el as HTMLDivElement);
            const parent: HTMLDivElement = (self.offsetParent as HTMLDivElement);

            
            if( this._isFocused() == true ){
                // self.style.zIndex = "100";
                // console.log( self.offsetParent, self.offsetParent.scrollTop, self.offsetTop );
                // parent.scrollTop = self.offsetTop-600;
            }
        //})
        // const self: HTMLDivElement = (this.$el as HTMLDivElement);
        // if( self !== undefined){
        //     gsap.to( (self.offsetParent as HTMLDivElement), {
        //         scrollTop:self.offsetTop,
        //         duration:0.5
        //         });
        // }
    }
    destroyed() {
        // console.log("destroyed");    
    }
    
    private _isFocused(): boolean{
        return AlphabetModule.currentFocusSymbolIDX == this.idx;
    }
    private _isCleared(): boolean{
        if( AlphabetModule.finishResultData == null ) return false;
        return AlphabetModule.finishResultData[ this.info.alphabet.toUpperCase()].isLocked == false;
    }

    private _onSelect(){
        if( this._isCleared() || this._isFocused() ){
            // console.log("SELECT!!!", this.info.alphabet);
            // AlphabetModule.testForceComplete( this.idx );
            this.$emit("onSelectItem", this.info.alphabet);
            // console.log(this.$root);
        }
    }
}

// touch 처리
// https://enterkey.tistory.com/364
</script>
