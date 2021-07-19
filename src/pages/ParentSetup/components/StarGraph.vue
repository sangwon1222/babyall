<template>
<div >
    <canvas ref="stage" :width="this.width" :height="this.height" class="container"></canvas>
</div>
</template>


<style lang="scss" scoped>
.container {
    // border:1px solid #F00;
    background-color: #FFF;
    // border-style: solid;
    // border-width: 5px;
    width: inherit;
    height: inherit;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { gsap } from 'gsap'

// function isInViewport(elem) {
//     const bounding = elem.getBoundingClientRect();
//     return (
//         bounding.top >= 0 &&
//         bounding.left >= 0 &&
//         bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//         bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
//     );
// }

let star1 = null;
let star2 = null;

@Component({})
export default class StarGraph extends Vue {
    @Prop({ default: 700 }) private width: number;
    @Prop({ default: 300 }) private height: number;
    @Prop({ default: ['라벨1', '라벨2'] }) private labels!: Array<string>;
    @Prop({ default: [ "#ff8085", "#c9c9c9" ] }) private colors!: Array<string>;
    @Prop({ default: [ 80, 20 ] }) private data!: Array<number>;
    
    private mCurrentValue: Array<number> = [];
    private mCTX: CanvasRenderingContext2D;
    
    $refs!: {
        stage: HTMLCanvasElement;
    }

    mounted(){
        this.mCTX = this.$refs.stage.getContext('2d');
        
        if( star1 == null ){
            star1 = new Image();
            star1.src = "img/parent/gr_star1.png"
        }
        if( star2 == null ){
            star2 = new Image();
            star2.src = "img/parent/gr_star2.png"
        }
        
        // this._drawArc( 100, 100, 80, 10, 45);
        // console.log( this.data );
        this._clear();
        this.updateValue();        
        this._drawlabel();
        // this._drawProc();
    }
    
    private _clear(){
        this.mCTX.clearRect(0,0,this.width,this.height);
        this._drawBG();
    }
    private _drawBG(){
        const w = this.width;
        const h = this.height;
        const start = [0, h-50]
        const blockh = start[1] - 40;
        const sect1x = (w/4)+40;
        const sect2x = w - (w/4);
        
        
        this.mCTX.save();
        //draw bg
        const col1 = '#E8E8E8';
        const col2 = '#F0F0F0';
        const col3 = '#999';
        
        //draw gridLine
        this.mCTX.strokeStyle = col1;
        // this.mCTX.lineWidth = 5;
        // this.mCTX.beginPath();
        // this.mCTX.moveTo(  start[0],start[1] );
        // this.mCTX.lineTo(  w,start[1] );
        // this.mCTX.stroke();
        
        this.mCTX.beginPath();
        for( let i=1; i<6; i++){
            this.mCTX.lineWidth = 2;
            this.mCTX.moveTo(  start[0], start[1] + (i*-(blockh/5)) );
            this.mCTX.lineTo(  w, start[1] + (i*-(blockh/5)) );            
        }
        this.mCTX.stroke();

        // draw limit text
        this.mCTX.font = "20px Arial";
        this.mCTX.fillStyle = '#BBB';
        this.mCTX.textAlign = "end";      
        this.mCTX.textBaseline = "top";  

        const txt = [ "0", "2", "4", "6", "8", "10"];
        for( let i=1; i<6; i++){            
            this.mCTX.fillText( txt[i], start[0]+40, start[1] + (i*-(blockh/5)) + 5 );
        }
        
        this.mCTX.restore();
        
    }
    
    isInViewport() {
        const bounding = this.$el.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    private _drawlabel(){
        const w = this.width;
        const h = this.height;
        const start = [0, h-50]
        const blockh = start[1] - 40;
        const sect1x = (w/4)+40;
        const sect2x = w - (w/4);
        const col1 = '#E8E8E8';
        
        this.mCTX.save();

        //draw gridLine
        this.mCTX.strokeStyle = col1;
        this.mCTX.lineWidth = 5;
        this.mCTX.beginPath();
        this.mCTX.moveTo(  start[0],start[1] );
        this.mCTX.lineTo(  w,start[1] );
        this.mCTX.stroke();
        // draw Label
        this.mCTX.font = "bold 25px Arial";
        this.mCTX.fillStyle = '#888';
        this.mCTX.textAlign = 'center';      
        this.mCTX.textBaseline = 'top';  
        this.mCTX.fillText( this.labels[0], sect1x, start[1]+10 );
        this.mCTX.fillText( this.labels[1], sect2x, start[1]+10 );
        
        this.mCTX.restore();
        
    }
    private _drawLine(){

        const w = this.width;
        const h = this.height;
        const start = [0, h-50]
        const blockh = start[1] - 40;
        const sect1x = (w/4)+40;
        const sect2x = w - (w/4);
        const grW = ""

        const gr1y = start[1] - ((this.mCurrentValue[0]/100) * blockh);
        const gr2y = start[1] - ((this.mCurrentValue[1]/100) * blockh);
        const gr1percent = ((this.mCurrentValue[0]/100) * blockh);
        const gr2percent = ((this.mCurrentValue[1]/100) * blockh);
        
        this.mCTX.save();

        // draw graph
        this.mCTX.fillStyle = this.colors[0];
        this.mCTX.fillRect( sect1x-(73/2), gr1y, 73, gr1percent );
        this.mCTX.fillStyle = this.colors[1];
        this.mCTX.fillRect( sect2x-(73/2), gr2y, 73, gr2percent );
        
        // draw imageMark
        if( star1 ) this.mCTX.drawImage( star1, sect1x-(73/2), gr1y-30 );
        if( star2 ) this.mCTX.drawImage( star2, sect2x-(73/2), gr2y-30 );
        
        // draw value
        this.mCTX.font = "30px Arial";
        this.mCTX.textAlign = 'center';      
        this.mCTX.textBaseline = 'middle';  
        if( (this.mCurrentValue[0]/10)< 1 ){
            this.mCTX.fillStyle = '#333';
            this.mCTX.fillText( (this.mCurrentValue[0]/10).toFixed(1), sect1x, gr1y-40 );        
        }else{
            this.mCTX.fillStyle = '#FFF';
            this.mCTX.fillText( (this.mCurrentValue[0]/10).toFixed(1), sect1x, gr1y+10 );        
        }
        
        if( (this.mCurrentValue[1]/10)< 1 ){
            this.mCTX.fillStyle = '#333';
            this.mCTX.fillText( (this.mCurrentValue[1]/10).toFixed(1), sect2x, gr2y-40 );        
        }else{
            this.mCTX.fillStyle = '#FFF';
            this.mCTX.fillText( (this.mCurrentValue[1]/10).toFixed(1), sect2x, gr2y+10 );        
        }
                
        this.mCTX.globalCompositeOperation = "destination-out";       
        
        this.mCTX.fillStyle = '#F00';
        this.mCTX.fillRect( start[0], start[1], w, h - blockh );
        
        this.mCTX.globalCompositeOperation = "source-over";       
        
        this.mCTX.restore();
    }
    
    private _drawProc(){
        this._clear();
        this._drawLine();
        this._drawlabel();
    }

    private updateValue(){
        this.mCurrentValue = [0,0];
        gsap.to( this.mCurrentValue,{
            0:this.data[0],
            1:this.data[1],
            duration: 0.5 } )
        .eventCallback("onUpdate",()=>{ this._drawProc() })   
        
    }
}
</script>