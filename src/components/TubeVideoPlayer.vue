<template>
    <div class="TubeVideo">
        <div class="video" @click="_showControl">
            <!-- <canvas ref="videoCanvas"></canvas> -->
            
            <video  v-show="true"
                crossOrigin = ""
                autoplay playsinline
                ref="video" 
                @ended="_onVideoPlayEnd" 
                > </video>

            <div v-show="mShowControl" ref="control" class="control" @click.stop="_closeControl">
                <img class="play" :src=" this.mIsPlaying?'img/babytube/control_pause.png':'img/babytube/control_play.png'"  @click.stop="_onPlayPauseClicked"/>
                 

                <!-- <div class="time"><span>{{mCurrentT}}</span> <div class="divide"></div> <span class="totalT">{{mTotalT}}</span></div>
                <div class="guage">
                    <div class="bg"></div> 
                    <div ref="guageBar" class="bar" :style=" `width:calc( (100% - 20px) * ${mProgress} );`"></div>
                    <div class="cursor" :style=" `left: ${mCursorPos}px;`" ></div>
                    <div class="listener" ref="evtListener"></div>
                </div>  -->
                <div class="closebtn" v-show="mIsFullScreen" @click="closePlayer">
                    <img src="img/babytube/close.png" />
                </div>

                  <div ref="bottombar" class="bottombar" @click.stop="" >
                    <div class="guage">
                        <div class="bg"></div>
                        <div class="time"><span>{{mCurrentT}}</span> <span class="totalT">{{mTotalT}}</span></div>
                        <div class="cursor" :style=" `left: ${mCursorPos}px;`" ></div>
                        <div class="listener" ref="evtListener"></div>
                        <div ref="guageBar" class="bar" :style=" `width:calc( (100% - 10rem) * ${mProgress} );`"></div>
                    </div>
                    
                    <div class="repeatCount" refs="repeatCount" @click="_repeatMode">
                        <img v-if="!mLoopModeFlag" :src="`img/babytube/repeat_${mLoopMode}.png`" />
                        <img v-if="mLoopModeFlag" src="img/babytube/repeat_none.png" @click="_changeLoopMode('none')"/>
                        <img v-if="mLoopModeFlag" src="img/babytube/repeat_one.png" @click="_changeLoopMode('one')"/>
                        <img v-if="mLoopModeFlag" src="img/babytube/repeat_all.png" @click="_changeLoopMode('all')"/>
                    </div>
                    
                </div>
            </div>
            
            
            
        </div>

        <!-- <div ref="bottombar" v-show="mIsFullScreen" class="bottombar">
            <span>{{videoInfo.subject}}</span>
            <img :src="_getLoopImage()" @click="_changeLoopMode"/>
            <img src="img/babytube/video_full.png" @click="onFullscreen"/>
        </div> -->
        
    </div>
</template>

<style lang="scss" scoped>
$guageHeight: 5px;
.TubeVideo{
    /* overflow: hidden; */
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:calc(100% + 2px);
    transform-origin: 50% 50%;
    z-index: 1000;
    
    display:flex;
    flex-direction: column;
    box-sizing:border-box;
    .video{
        // width:720px;
        // height:406px;
        width:100%;
        height:100%;
        background-color: #000;
        video{
            height:100%;
        }
    }

    /* .bottombar{
        position:absolute;
        z-index:1000;
        right:0;
        bottom:0;

        width:200px;
        height:75px;
        background-color: #333;
        display:flex;
        align-items: center;
        // justify-content: flex-end;
        span{
            flex:1;
            padding:1rem;
            font-family: 'Noto sans';
            font-size: 28px;
            color:#FFF;
        }
        img{
            margin:0.2rem;            
            cursor: pointer;
        }
        img:last-child{
            margin-right:1.0rem;            
        }
    }
    */
    /* .control{
        position:absolute;
        top:0;
        left:0;

        width:100%;
        height: calc(100% + 2px);
        background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.5) 100%);
        display:flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index:2000;
        .play{
            cursor: pointer;
            width:15%;
            transition: width 0.5s;
            &:hover{
                width:18%;
            }
        }
        .time{
            position:absolute;
            bottom: 10px;
            left:10px;
            display: flex;
            flex-direction: row;
            align-items: baseline;
            span{
                color: #FFF;
                font-weight:normal;
                font-family: 'NotoSans';
            }
            .totalT{
                color: #AAA;
            }
            .divide{
                margin-left: 5px;
                margin-right: 5px;
                width: 2px;
                height: 14px;
                background-color: #AAA;
                display: block;
            }
        }
        .guage{
            cursor:pointer;
                
            // border:1px solid #F00;
            width:100%;
            height: 30px;
            position:absolute;
            bottom: 40px;
            display:flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .bg{
                position:absolute;
                width: calc( 100% - 20px);
                height:$guageHeight;
                border-radius: 10px;
                background-color: #FFF;
            }
            .bar{
                cursor:crosshair;
                
                position:absolute;
                left:10px;
                width: calc( (100% - 20px) * 0 );
                height:$guageHeight;
                border-radius: 10px;
                background-color: rgb(199, 10, 10);
            }
            .cursor{
                position:absolute;
                left:10%;
                border-radius: 20px;
                width: 30px;
                height: 30px;
                background-color: rgb(231, 73, 73);
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            .listener{
                // border:1px solid #FFF;
                width:inherit;
                height:inherit;
                // background: rgba(255,255,255,0.3);
                z-index: 1000;
            }
        }
        .closebtn{
            position: absolute;
            top: 20px;
            right: 20px;
            cursor: pointer;
        }
    } */

       .control{
        position:fixed;
        top:-3px;
        left:0;
        width:100%;
        height: calc(100% + 6px);
        background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.5) 100%);
        /* background-color: rgba(0,0,0,0.5); */
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .play{
            cursor: pointer;
            width:15%;
            transition: width 0.5s;
        }
        .play:hover{
            width:18%;
        }
        
    .bottombar{
        position:fixed;
        z-index:1000;
        bottom:0;
        width:100%;
        height:4rem;
        /* background-color: #333; */
        background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0) );
        display:flex;
        flex: flex-wrap;
        justify-content: space-between;
        align-items: center;

        .guage{
            cursor:pointer;
                
            width:100%;
            position:relative;
            display:flex;
            
            .time{
                position:absolute;
                top:-0.8rem;
                right:1rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                span{
                    color: #FFF;
                    font-weight:lighter;
                    font-family: 'NotoSans';
                    font-size:1rem;
                    padding:0.1rem 0.5rem 0.1rem 0;
                }
                .totalT{
                    color: #777;
                }
            }
            .bg{
                position:absolute;
                width: calc( 100% - 10rem);
                height:$guageHeight;
                left:10px;
                border-radius: 10px;
                background-color: #FFF;
            }
            .bar{
                cursor:pointer;
                
                position:absolute;
                left:10px;
                width: calc( (100% - 10rem) * 0 );
                height:$guageHeight;
                border-radius: 10px;
                background-color: rgb(199, 10, 10);
            }
             .cursor{
                position:absolute;
                top:-15px;
                left:10%;
                border-radius: 20px;
                width: 30px;
                height: 30px;
                background-color: rgb(231, 73, 73);
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                z-index: 1001;
            }
            .listener{
                // border:1px solid #FFF;
                position:absolute;
                width: calc( (100% - 10rem) );
                height: 5rem;
                top:-2.5rem;
                left:1rem;
                // background: rgba(255,255,255,0.3);
                z-index: 2000;
            }
        }
        .repeatCount{
            overflow: hidden;
            display:flex;
            flex-direction: column;
            justify-content: flex-start;
            margin: 1.5rem 1rem 0 0; 
            height:1.6rem;
            transform: translateY(-50%);
            transition:0.5s all;
            cursor: pointer;
            >img{
                width:100%;
                height:auto;
            }
        }
    }
        
        .closebtn{
            position: absolute;
            top: 1rem;
            right: 1rem;
            cursor: pointer;
        }
    }
}

.video-fullscreen {
    position:relative;
    // transform: translate( -280px, 279px) rotate(90deg);
    // z-index: 1000;
    // width:100vh;
    // height:100vw;
        
    // transform: rotate(90deg);
    transform: translate( -280px, 190px) rotate(90deg);
    z-index: 100;
    width:1281px;
    height:721px;

    .video{
        position:absolute;
           
    // -webkit-transform:rotate(90deg);
    }
}

.video-fullscreen-pc {
    position: absolute;
    top: auto !important;
    left: auto !important;
    width: auto !important;
    height: auto !important;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import gsap from "gsap";
import { MediaPlayer, MediaPlayerClass } from 'dashjs';
import { isMobilePlatform } from '@/Util/Platform';
import AppVue from '@/App.vue';
import { isIOS } from '@/Util/Platform';

let sParent = null;
@Component({
    components:{
    }
})
export default class VideoView extends Vue {
    @Prop({required: true}) private videoInfo!: {movie: string; subject: string };
    
    private mIsFullScreen = true;
    private mShowControl = false;
    private mIsPlaying = false;
    private mTotalT = "--:--";
    private mCurrentT = "--:--";

    private mProgress = 0;
    private mCursorPos = 0;
    private mCursorDowned = false;

    private mContext: any;
    private mDashPlayer: MediaPlayerClass;
    private mTouchEndX=0;

    private mLoopModeFlag = false;
    private mLoopMode = "all" || "one" || "none";
    
    $refs: {
        videoCanvas: HTMLCanvasElement;
        video: HTMLVideoElement;
        guageBar: HTMLDivElement;
        evtListener: HTMLDivElement;
        control: HTMLDivElement;
        bottombar: HTMLDivElement;
    }

    @Watch('videoInfo')
    onChangeVideoURL( curr, old ){
        // console.log( "---->",curr, old );
        if(window['video']){window['video'].pause(); window['video']=null;}
        if(this.mDashPlayer){ this.mDashPlayer.reset(); }
        if( isIOS() ){
            this.$refs.video.src = this.videoInfo.movie.toString().slice(0,65) + `.mp4`;
            this.$refs.video.oncanplay=()=>{
                this.$refs.video.autoplay = true;
                this.$refs.video.play();
            }
        }else{
            const url = this.videoInfo.movie;
            this.mDashPlayer = MediaPlayer().create();
            this.mDashPlayer.initialize();
            this.mDashPlayer.attachView( this.$refs.video );
            this.mDashPlayer.setAutoPlay( true );
            this.mDashPlayer.attachSource( url );
            this.mDashPlayer.on("canPlay",()=>{   
                this.$refs.video.autoplay = true;
                this.$refs.video.play(); 
            })
        }
        window['video']= this.$refs.video;
        // console.log( ">>>>",url );
    }
    
    constructor(){
        super();
    }
    
    mounted(){
        if(window['video']){window['video'].pause(); window['video']=null;}
        this.mLoopMode = "all";
        gsap.fromTo(this.$el,{top:-1280},{top:0,duration:0.5})
        sParent = this.$el.parentElement;

        console.log( this.videoInfo.movie.toString().slice(0,65) + `.mp4` );
        console.warn( this.videoInfo.subject );

        this.$nextTick( ()=>{
            if( isIOS() ){
            this.$refs.video.src = this.videoInfo.movie.toString().slice(0,65) + `.mp4`;
            this.$refs.video.oncanplay=()=>{
                this.$refs.video.autoplay = true;
                this.$refs.video.play();
                this.$refs.videoCanvas.width =  this.$refs.video.videoWidth;
                this.$refs.videoCanvas.height = this.$refs.video.videoHeight;
            }
            }else{
                const url = this.videoInfo.movie;
                this.mDashPlayer = MediaPlayer().create();
                this.mDashPlayer.initialize();
                this.mDashPlayer.attachView( this.$refs.video );
                this.mDashPlayer.setAutoPlay( true );
                this.mDashPlayer.attachSource( url );
                this.mDashPlayer.on("canPlay",()=>{   this.$refs.video.play(); })
            }
            
            // 비디오에 콘트롤 관련 이벤트를 바인딩.
            const video = this.$refs.video;
            window['video']= this.$refs.video;
            
            video.onloadeddata=()=>{
                const date = new Date( video.duration * 1000 );
                const m = "0"+date.getMinutes()
                const s = "0"+date.getSeconds()
                this.mTotalT = m.substr(-2) + ":" +s.substr(-2);
            }
            video.ontimeupdate=()=>{
                const date = new Date( video.currentTime * 1000 );
                const m = "0"+date.getMinutes()
                const s = "0"+date.getSeconds()
                this.mCurrentT = m.substr(-2) + ":" +s.substr(-2);
                this.mProgress = video.currentTime/video.duration;
                if( this.mCursorDowned == false ){
                    const bar = this.$refs.guageBar;
                    // console.log( bar.clientWidth, this.mCursorPos )
                    if(bar) this.mCursorPos = bar.clientWidth;
                }
                // console.log( "PROGRESS", this.mProgress);
            }
            video.onplay = ()=>{
                this.mIsPlaying = true;
            } 
            video.onpause = ()=>{
                this.mIsPlaying = false;
            } 

            video.oncanplay = ()=>{
                video.play();
                console.log("PLAYYY!", video.videoWidth)
            }
            const eventer: HTMLDivElement = this.$refs.evtListener
            if( eventer ){
                
                eventer.onpointerdown = (evt)=>{
                    evt.stopPropagation();
                    this._onGuageDowned( evt.offsetX );
                }
                eventer.onpointermove = (evt)=>{
                    evt.stopPropagation();
                    this._onGuageMoved( evt.offsetX );
                }
                eventer.onpointerup = (evt)=>{
                    evt.stopPropagation();
                    this._onGuageUp( evt.offsetX );
                }
                 eventer.onpointerout = (evt)=>{
                    evt.stopPropagation();
                    this._onGuageUp( this.mTouchEndX );
                }
                eventer.onclick = (evt)=>{
                    evt.stopPropagation();
                    this._onGuageUp( evt.offsetX );
                }

                
                // eventer.ontouchmove = (evt: TouchEvent)=>{
                //     evt.stopPropagation();
                //     const bound = (evt.target as HTMLDivElement).getBoundingClientRect();
                //     const r = (evt.target as HTMLDivElement).getBoundingClientRect();
                //     let mx = evt.touches[0].clientX - bound.x;
                //     if(mx <0) mx = 0;
  
                //     const ratio = (!this.mIsFullScreen?720:(window.innerWidth-20))/bound.width
                //     mx = ratio * mx;
                //     this._onGuageMoved( mx );
                // }
                // eventer.ontouchend = (evt: TouchEvent)=>{
                //     evt.stopPropagation();
                //     this._onGuageUp( this.mTouchEndX  );
                // }
                
                // eventer.onmousedown = (evt)=>{
                //     evt.stopPropagation();
                //     this._onGuageDowned( evt.offsetX );
                // }
                // eventer.onmousemove = (evt)=>{
                //     evt.stopPropagation();
                //     this._onGuageMoved( evt.offsetX );
                // }
                // eventer.onmouseup = (evt)=>{
                //     evt.stopPropagation();
                //     this._onGuageUp( evt.offsetX );
                // }
                // eventer.onclick = (evt)=>{
                //     evt.stopPropagation();
                //     this._onGuageUp( evt.offsetX );
                // }
                
                // eventer.ontouchstart = (evt: TouchEvent)=>{
                //     evt.stopPropagation();
                //     this._onGuageDowned( evt.touches[0].pageX  );
                // }
                // eventer.ontouchmove = (evt: TouchEvent)=>{
                //     evt.stopPropagation();
                //     const r = (evt.target as HTMLDivElement).getBoundingClientRect();
                //     this._onGuageMoved( evt.touches[0].pageX - r.left  );
                // }
                // eventer.ontouchend = (evt: TouchEvent)=>{
                //     evt.stopPropagation();
                //     this._onGuageUp( evt.touches[0].pageX  );
                // }
                // eventer.ontouchcancel = (evt: TouchEvent)=>{
                //     evt.stopPropagation();
                //     this._onGuageUp( evt.touches[0].pageX  );
                // }
            }
        })
    }
    private _repeatMode(){
        if(this.mLoopModeFlag){
            gsap.to( document.getElementsByClassName('repeatCount') ,{height:100/3,duration:0.1})
        }else{
            gsap.to( document.getElementsByClassName('repeatCount') ,{height:100,duration:0.1})
        }
        this.mLoopModeFlag=!this.mLoopModeFlag
    }
    private _changeLoopMode(mode: string){
        this.mLoopMode= mode;
        // BabyTubeModule.selectPlayMode(mode);
    }

    private _onVideoPlayEnd(){
        if(this.mLoopMode=="all"){
            this.$emit("onVideoPlayEnd")
        }else{

            this.$nextTick(()=>{
                if(this.mLoopMode=="one") { 
                    this.mIsPlaying=true;
                    gsap.delayedCall(1,()=>{

                        this.$refs.video.play();
                    })
                 }
                if(this.mLoopMode=="none") {
                    // this.mIsPlaying = true;
                    // this._onPlayPauseClicked();
                }
            })
        }
    }

    private _showControl(){
        console.log(`show`)
        this.mShowControl = true;
        this.$nextTick( ()=>{
            const control = this.$refs.control;
            control.style.opacity = "0";
            gsap.to(control, {css:{opacity:1}, duration:0.5} )
        })
    }

    private _closeControl(){
        const control = this.$refs.control;
        gsap.to(control, {css:{opacity:0}, duration:0.5, onComplete:()=>{
            this.mShowControl = false;            
        }} )
    }

    private _onPlayPauseClicked(){
        console.log("play toggled");
        
        if( this.mIsPlaying ){
            this.$refs.video.pause();
        }else{
            this.$refs.video.play();
        }

        this.mIsPlaying = !this.mIsPlaying;
    }

    private _onGuageDowned( x: number ){
        this.mCursorDowned = true;
    }
    private _onGuageMoved( x: number ){
        if( this.mCursorDowned  ){
            
            this.mCursorPos = x + 10;
            if( this.mCursorPos < 0 ) this.mCursorPos = 0;
            if( this.mCursorPos > this.$refs.evtListener.clientWidth ) this.mCursorPos = this.$refs.evtListener.clientWidth-20;

            this.mTouchEndX = this.mCursorPos;
        }
    }
    private _onGuageUp( x: number ){
        if(this.mCursorDowned===false){return;}
        this.mCursorDowned = false ;
  
        this.mCursorPos = x+10;
        if( this.mCursorPos < 0 ) this.mCursorPos = 0;
        if( this.mCursorPos > this.$refs.evtListener.clientWidth ) this.mCursorPos = this.$refs.evtListener.clientWidth-10;

        const video: HTMLVideoElement = this.$refs.video as HTMLVideoElement;
        let percent = 0;
        // if(this.mIsFullScreen) 
        percent = this.mCursorPos/ this.$refs.evtListener.clientWidth;
        // else percent = this.mCursorPos/(700-20);
        this.$refs.video.currentTime = this.$refs.video.duration * percent;
    }
    // onFullscreen(){
        
    //     const bottomBar = this.$refs.bottombar;
    //     const div = this.$root.$children[0].$refs.videoCase as HTMLDivElement;
    //     if( this.mIsFullScreen ){
    //         this.mIsFullScreen = false;
    //         // this.$el.classList.remove( "video-fullscreen"); 
    //         /* 스크롤락관련 처리 201103
    //         if( !isMobilePlatform() ){
    //             this.$el.classList.remove( "video-fullscreen-pc"); 
    //             div.removeChild( this.$el );
    //             sParent.appendChild( this.$el );

    //             const app = this.$root.$children[0] as AppVue;
    //             app.isShowTubePlayer = false;
                
    //         }else{
    //             this.$el.classList.remove( "video-fullscreen"); 
    //         }
    //         */
    //         this.$el.classList.remove( "video-fullscreen-pc"); 
    //         div.removeChild( this.$el );
    //         sParent.appendChild( this.$el );

    //         const app = this.$root.$children[0] as AppVue;
    //         app.isShowTubePlayer = false;
        
    //     }else{
    //         this.mIsFullScreen = true;
    //         /* 스크롤락관련 처리 201103
    //         if( !isMobilePlatform() ){
    //             this.$el.classList.add( "video-fullscreen-pc"); 
    //             sParent.removeChild( this.$el );
    //             div.appendChild( this.$el );
                
    //             const app = this.$root.$children[0] as AppVue;
    //             app.isShowTubePlayer = true;
    //         }else{
    //             this.$el.classList.add( "video-fullscreen"); 
    //         }
    //         */
    //         this.$el.classList.add( "video-fullscreen-pc"); 
    //         sParent.removeChild( this.$el );
    //         div.appendChild( this.$el );
    //         console.error(this.$refs.video)
            
    //         const app = this.$root.$children[0] as AppVue;
    //         app.isShowTubePlayer = true;
            
    //     }
    //     // console.log( this.$el.classList );
    //     // console.error(this.mIsFullScreen)
    // }
    play(){
        const video: HTMLVideoElement = this.$refs.video;
        video.currentTime = 0;
    }

    closePlayer(){
        if(window['video']){ window['video'].pause(); window['video']=null; }
        gsap.to(this.$el, {top:-1280, duration:0.5})
        .eventCallback('onComplete',()=>{
            this.$emit(`closePlayer`)
        })
        
    }
}
</script>

