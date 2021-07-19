<template>
<div class="activityplayer">
    <canvas ref="stage" />
</div>
</template>

<style lang="scss" scoped>
.activityplayer {
    z-index: 10000;
    width:inherit;
    height:inherit;
    canvas{
        width:100%;
        height:100%;
    }
}
</style>

<script lang="ts">

//https://blog.addpipe.com/10-advanced-features-in-html5-video-player/

//http://www.imestudy.co.kr:8080/package/product/babytube/movie/1_02%20Song%20Play720P.mp4

import { Component, Prop, Vue } from "vue-property-decorator";
import { App } from "../Activity/Core/App"
import Util from "@/Util"

import AlphabetCatchGame from '../Activity/Alphabet/catch';
import AlphabetMatchGame from '../Activity/Alphabet/match';
import AlphabetTouchGame from '../Activity/Alphabet/touch';
import AlphabetBlockGame from '../Activity/Alphabet/block';
import AlphabetQuizGame from '../Activity/Alphabet/quiz';

import MyPet from '../Activity/MyPet';

import StoryMovieGame from '../Activity/StoryBook/movie';
import StoryCatchGame from '../Activity/StoryBook/catch';
import StoryQuizGame from '../Activity/StoryBook/quiz';
import StoryTouchGame from '../Activity/StoryBook/touch';
import StoryFinderGame from '../Activity/StoryBook/finder';
import StoryMatchGame from '../Activity/StoryBook/match';
import StoryMakingBookGame from '../Activity/StoryBook/makingBook';
import pixiSound from "pixi-sound";

let gApp: App = null;

@Component({})
export default class ActivityPlayer extends Vue {
    @Prop() private isMobileMode!: boolean;
    @Prop() private level!: number;
    
    // alphabet, mypet, storybook
    @Prop() private category!: "alphabet"|"mypet"|"storybooks";
    @Prop() private alphabet!: string;

    @Prop() private bookID!: string;
    
    @Prop({default:'catch'}) private activityAL: string;
    @Prop({default:'movie'}) private activitySB: string;

    constructor(){
        super();
    }

    created(){
        window.addEventListener('touchstart',function(){
pixiSound.resumeAll()
        })
    }

    mounted(){
        // this._goFullScreen();
        console.log( "category:", this.category);
        console.log( "activityAL:", this.activityAL);
        console.log( "activitySB:", this.activitySB);

        gApp = new App( this.$refs.stage as HTMLCanvasElement, this.category, this.isMobileMode );
        
        if( this.category == 'alphabet' ){
            if( this.activityAL == "") { this.activityAL = "catch"; }
            // 알파벳 가동시
            gApp.onCloseApp = ()=>{ this.$emit('onClose')};
            gApp.registGame( new AlphabetCatchGame() );
            gApp.registGame( new AlphabetMatchGame() );
            gApp.registGame( new AlphabetTouchGame() );
            gApp.registGame( new AlphabetBlockGame() );
            gApp.registGame( new AlphabetQuizGame() );
            
            console.log(" start APP", {symbol:this.alphabet, level: this.level});
            gApp.startApp( {category:this.category, symbol:this.alphabet, level: this.level}, this.activityAL );
        }else if( this.category == 'mypet' ){
            // 마이펫 가동시
            gApp.onCloseApp = ()=>{ this.$emit('onClose')};
            gApp.registGame( new MyPet() );
            gApp.startApp( {category:this.category} );
            
        }else if( this.category == 'storybooks' ){            
            if( this.activitySB == "") this.activitySB = "movie";
            gApp.onCloseApp = () =>{ this.$emit('onClose')};
            
            gApp.registGame( new StoryMovieGame() )
            gApp.registGame( new StoryCatchGame() )
            gApp.registGame( new StoryTouchGame() )
            gApp.registGame( new StoryMatchGame() )
            gApp.registGame( new StoryFinderGame() )
            gApp.registGame( new StoryQuizGame() )
            gApp.registGame( new StoryMakingBookGame() )
            gApp.startApp( { category:this.category, bookID:this.bookID , level: this.level }, this.activitySB );
        }
    }

    async _goFullScreen(){
        if(window['video'])window['video'].pause();
        if( Util.Config.excuteMode==="salesKit" ){
            try{
                await document.documentElement.requestFullscreen( {navigationUI: ("hide" as FullscreenNavigationUI)} )
                // screen.orientation.lock( "landscape-primary" )
            }catch( e ){
                alert(e)
            }
        }
    }

    destroy(){
        console.error(`destroy ApP`)
        window.PIXI = null;
    }


}

</script>
