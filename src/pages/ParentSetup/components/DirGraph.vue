<template>
<div >
    <canvas ref="stage" :width="this.size" :height="this.size" class="container"></canvas>
</div>
</template>


<style lang="scss" scoped>
.container {
    // border:1px solid #F00;
    // border-style: solid;
    // border-width: 5px;
    width: 500px;
    height: 500px;
    margin-left:20px;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
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

export interface DataForm{
    color: string;
    data: Array<number>;
}

@Component({})
export default class DirGraph extends Vue {
    @Prop({ default: [] }) private data: Array<DataForm>;
    @Prop({ default: '#FFF' }) private borderColor: string;
    @Prop({ default: 5 }) private borderWidth: number;
    @Prop({ default: 15 }) private fontsize: number;
    @Prop({ default: 300 }) private size: number;
    @Prop({ default: 100 }) private margin: number;
    @Prop({ default: ['라벨1', '라벨2', "라벨3", '라벨4' ] }) private labels: Array<string>;
    
    private mCurrentValue: Array<DataForm> = [];
    private mCTX: CanvasRenderingContext2D;
    
    $refs!: {
        stage: HTMLCanvasElement;
    }

    @Watch("data")
    onChangeData( val: Array<DataForm>, oldVal: Array<DataForm> ){
        this._updateValue();
    }
    mounted(){
        this.mCTX = this.$refs.stage.getContext('2d');
        
        // this._drawArc( 100, 100, 80, 10, 45);
        // console.log( this.data );
        this._clear();
        this._updateValue();        
        // this._drawProc();
    }
    
    private _clear(){
        this.mCTX.clearRect(0,0,this.size,this.size);
        this._drawBG();
    }

    private _drawBG(){
        const size = this.size;
        const margin = this.margin;
        const step = (this.size - (margin*2)) / 10;
        // console.warn("margin:", margin);
        this.mCTX.save();
        //draw bg
        this.mCTX.beginPath();
        this.mCTX.moveTo( margin,size/2 );
        this.mCTX.lineTo( size/2, margin );
        this.mCTX.lineTo( size-margin, size/2 );
        this.mCTX.lineTo( size/2, size-margin );
        this.mCTX.fillStyle = '#E8E8E8';
        this.mCTX.fill();
    
        //draw grid line
        this.mCTX.beginPath();        
        for( let i= 0; i<5; i++){
            const p1 = [ margin + (step*i), size/2];    
            const p2 = [ size/2, margin + (step*i) ];    
            const p3 = [ size-(margin + (step*i)), size/2];    
            const p4 = [ size/2, size-(margin + (step*i)) ];    
            this.mCTX.moveTo( p1[0], p1[1] );
            this.mCTX.lineTo( p2[0], p2[1] );
            this.mCTX.lineTo( p3[0], p3[1] );
            this.mCTX.lineTo( p4[0], p4[1] );
            this.mCTX.lineTo( p1[0], p1[1] );
            this.mCTX.strokeStyle = '#CCC';
            this.mCTX.stroke();
        }
            
        // draw axis line
        this.mCTX.beginPath();
        this.mCTX.moveTo( margin,size/2 );
        this.mCTX.lineTo( size-margin, size/2 );

        this.mCTX.moveTo( size/2, margin );
        this.mCTX.lineTo( size/2, size-margin );
        this.mCTX.strokeStyle = '#BBB';
        this.mCTX.stroke();

        // draw axis label
        this.mCTX.font = "20px Arial";
        this.mCTX.fillStyle = '#BBB';
        this.mCTX.textAlign = "end";      
        this.mCTX.textBaseline = "middle";  
        for( let i=0; i< 6; i++){
            this.mCTX.fillText( (i*20).toString(), size/2-10, size/2  - (step*i) );
        }

        //draw label
        const gap = 26;
        const poslist=[
            ["end","middle", margin-gap, size/2 ],
            ["center","bottom", size/2, margin-gap],
            ["start","middle", size - margin + gap, size/2],
            ["center","top", size/2, size - margin + gap],
        ]
        for( let i=0; i<4; i++){
            this.mCTX.font = "bold 24px Arial";
            this.mCTX.fillStyle = '#888';
            this.mCTX.textAlign = (poslist[i][0] as CanvasTextAlign);      
            this.mCTX.textBaseline =(poslist[i][1] as CanvasTextBaseline);  
            if( typeof this.labels[i] == 'object' ){
                let y = 0;
                for( const word of this.labels[i]){
                    this.mCTX.fillText( word, (poslist[i][2] as number), (poslist[i][3] as number )+y );
                    y+= 28;
                }
            }else{
                this.mCTX.fillText( this.labels[i], (poslist[i][2] as number), (poslist[i][3] as number ) );
            }
            
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

    private _drawLine( color: string, data: Array<number> ){

        const size = this.size;
        const margin = this.margin;
        const step = (this.size - (margin*2)) / 10;
        const center = size/2
        const guageLength = center-margin;
        
        const plist = [
            [ center - ( guageLength * (data[0]/100) ), center ],
            [ center, center - ( guageLength * (data[1]/100) )],
            [ center + ( guageLength * (data[2]/100) ), center ],
            [ center, center + ( guageLength * (data[3]/100) ) ]
        ]
        
        this.mCTX.save();
        // draw point circle
        for( let i=0; i<4; i++) {
            this.mCTX.beginPath();
            this.mCTX.arc( plist[i][0], plist[i][1], 8, 0 , 2* Math.PI );
            this.mCTX.fillStyle = color;
            this.mCTX.fill();
        }     
        
        // draw Point Line
        this.mCTX.beginPath();
        this.mCTX.moveTo( plist[0][0], plist[0][1] );
        this.mCTX.lineTo( plist[1][0], plist[1][1] );
        this.mCTX.lineTo( plist[2][0], plist[2][1] );
        this.mCTX.lineTo( plist[3][0], plist[3][1] );
        this.mCTX.lineTo( plist[0][0], plist[0][1] );
        this.mCTX.lineWidth = 5;
        this.mCTX.strokeStyle = color;
        this.mCTX.stroke();
        
        this.mCTX.restore();
    }
    
    private _drawProc(){
        this._clear();

        let idx = 0;
        for( const info of this.data ){
            this._drawLine( info.color, this.mCurrentValue[idx].data );
            idx += 1;
        }
    }

    private _updateValue(){
        this.mCurrentValue = [];

        let idx = 0; 
        for( const info of this.data ){
            this.mCurrentValue.push( {
                color:info.color,
                data:[0,0,0,0]
            });
            gsap.to( this.mCurrentValue[idx].data,{
                delay:idx*0.5 ,

                0:info.data[0],
                1:info.data[1],
                2:info.data[2],
                3:info.data[3], 
                
                duration: 0.5 } )
            .eventCallback("onUpdate",()=>{
                this._drawProc();        
            })   
            idx+=1;
        }
        
    }
}
</script>