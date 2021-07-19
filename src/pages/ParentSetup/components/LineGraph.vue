<template>
<div >
    <canvas ref="stage" :width="this.width" :height="this.height" class="container"></canvas>
</div>
</template>


<style lang="scss" scoped>
.container {
    // border:1px solid #F00;
    // border-style: solid;
    // border-width: 5px;
    width: inherit;
    height: inherit;
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
export default class LineGraph extends Vue {
    @Prop({ default: 700 }) private width: number;
    @Prop({ default: 300 }) private height: number;
    @Prop({ default: ['라벨1', '라벨2', "라벨3", '라벨4' ] }) private labels: Array<string>;
    @Prop({ default: [] }) private data: Array<DataForm>;
    
    // @Prop({ default: '#FFF' }) private borderColor: string;
    // @Prop({ default: 5 }) private borderWidth: number;
    // @Prop({ default: 15 }) private fontsize: number;
    // @Prop({ default: 100 }) private margin: number;
    
    private mCurrentValue: Array<DataForm> = [];
    private mCTX: CanvasRenderingContext2D;
    
    $refs!: {
        stage: HTMLCanvasElement;
    }

    @Watch('data')
    onChangeData( val: Array<DataForm>, oldVal: Array<DataForm>){
        this.updateValue();
    }

    @Watch('labels')
    onChangeLabelData( val: Array<string>, oldVal: Array<string>){
        this.updateValue();
    }
    
    mounted(){
        this.mCTX = this.$refs.stage.getContext('2d');
        
        // this._drawArc( 100, 100, 80, 10, 45);
        // console.log( this.data );
        this._clear();
        this.updateValue();        
        // this._drawProc();
    }
    
    private _clear(){
        this.mCTX.clearRect(0,0,this.width,this.height);
        this._drawBG();
    }
    private _drawBG(){
        const w = this.width;
        const h = this.height;
        
        this.mCTX.save();
        //draw bg
        const start = [50,30]
        const blockW = (this.width-start[0])/4 - 5;
        const blockH = (this.height-start[1]-40);
        const col1 = '#E8E8E8';
        const col2 = '#F0F0F0';
        const col3 = '#999';
        for( let i=0; i<4; i++){
            this.mCTX.fillStyle = i%2==0?col1:col2;
            this.mCTX.fillRect( start[0]+(blockW*i),start[1], blockW, blockH);
        
        }

        //drawBorder
        this.mCTX.strokeStyle = col3;
        this.mCTX.strokeRect( start[0],start[1], blockW*4, blockH);

        //draw center line
        this.mCTX.beginPath();
        this.mCTX.strokeStyle = col3;
        this.mCTX.moveTo( start[0], start[1]+(blockH/2) );
        this.mCTX.lineTo( start[0]+(blockW*4), start[1]+(blockH/2) );
        this.mCTX.stroke();

        // draw left label
        this.mCTX.font = "20px Arial";
        this.mCTX.fillStyle = '#999';
        this.mCTX.textAlign = "end";      
        this.mCTX.textBaseline = "middle";  
        this.mCTX.fillText( "100", start[0]-5, start[1]);
        this.mCTX.fillText( "50", start[0]-5, start[1] + blockH/2);
        this.mCTX.fillText( "0", start[0]-5, start[1] + blockH);
        
        // draw bottom label
        this.mCTX.font = "bold 22px Arial";
        this.mCTX.fillStyle = '#333';
        this.mCTX.textAlign = "center";      
        this.mCTX.textBaseline = "top";  
        for( let i=0; i<4; i++){
            this.mCTX.fillText( 
                this.labels[i], 
                (start[0]+(blockW*i)) + (blockW/2), 
                start[1] + blockH + 10
            );
        }
        // this.mCTX.beginPath();
        // this.mCTX.moveTo( margin,size/2 );
        // this.mCTX.lineTo( size/2, margin );
        // this.mCTX.lineTo( size-margin, size/2 );
        // this.mCTX.lineTo( size/2, size-margin );
        // this.mCTX.fillStyle = '#E8E8E8';
        // this.mCTX.fill();
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

        const start = [50,30]
        const blockW = (this.width-start[0])/4 - 5;
        const blockH = (this.height-start[1]-40);
        const startY = start[1]+blockH;
        
        // const size = this.size;
        // const margin = this.margin;
        // const step = (this.size - (margin*2)) / 10;
        // const center = size/2
        // const guageLength = center-margin;
        
        const plist = [
            [ start[0]+(blockW/2)+(0*blockW), startY - ( blockH* (data[0]/100) ) ],
            [ start[0]+(blockW/2)+(1*blockW), startY - ( blockH* (data[1]/100) )  ],
            [ start[0]+(blockW/2)+(2*blockW), startY - ( blockH* (data[2]/100) )  ],
            [ start[0]+(blockW/2)+(3*blockW), startY - ( blockH* (data[3]/100) )  ],
        ]
        
        this.mCTX.save();

        // draw Point Line
        this.mCTX.beginPath();
        this.mCTX.moveTo( plist[0][0], plist[0][1] );
        this.mCTX.lineTo( plist[1][0], plist[1][1] );
        this.mCTX.lineTo( plist[2][0], plist[2][1] );
        this.mCTX.lineTo( plist[3][0], plist[3][1] );
        this.mCTX.lineWidth = 5;
        this.mCTX.strokeStyle = color;
        this.mCTX.stroke();

        // draw point circle
        for( let i=0; i<4; i++) {
            this.mCTX.beginPath();
            this.mCTX.arc( plist[i][0], plist[i][1], 8, 0 , 2* Math.PI );
            this.mCTX.fillStyle = color;
            this.mCTX.fill();
            this.mCTX.beginPath();
            this.mCTX.arc( plist[i][0], plist[i][1], 8, 0 , 2* Math.PI );
            this.mCTX.fillStyle = 'rgba(0,0,0,0.3)';
            this.mCTX.fill();
        }     
        
        
        
        this.mCTX.restore();
    }
    
    private _drawProc(){
        this._clear();

        let idx = 0;
        for( const info of this.data ){
            this._drawLine( info.color, this.mCurrentValue[idx].data );
            // this._drawLine( info.color, info.data );
            idx += 1;
        }
    }

    private updateValue(){
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
            .eventCallback("onUpdate",()=>{ this._drawProc() })   
            idx+=1;
        }
        
    }
}
</script>