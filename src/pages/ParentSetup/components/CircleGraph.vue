<template>
<div>
    <canvas ref="stage" :width="this.size" :height="this.size" class="container"></canvas>
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

function deg2rad(deg: number): number{
    return (Math.PI/180) * deg;
}

function rad2deg( rad: number): number{
    return (rad/Math.PI) * 180;
}

export interface DataForm{
    start: number;
    end: number;
    color: string;
    label?: string;
}

@Component({})
export default class CircleGraph extends Vue {
    @Prop({ default: ()=>[] }) private data: Array<DataForm>;
    @Prop({ default: '#FFF' }) private borderColor: string;
    @Prop({ default: 5 }) private borderWidth: number;
    @Prop({ default: 15 }) private fontsize: number;
    @Prop({ default: 300 }) private size: number;
    
    private mCurrentValue: Array<DataForm> = [];
    private mCTX: CanvasRenderingContext2D;
    
    $refs!: {
        stage: HTMLCanvasElement;
    }

    @Watch("data")
    onChangeData( val: Array<DataForm>, oldVal: Array<DataForm>) {
        this._updateValue();
    }
    mounted(){
        // console.log( this.$refs.stage.width );
        this.mCTX = this.$refs.stage.getContext('2d');
        
        // this._drawArc( 100, 100, 80, 10, 45);
        // console.log( this.data );
        this._updateValue();        
        
        // this._drawProc();
    }

    private _drawBG(){
        this.mCTX.beginPath();
        this.mCTX.arc( this.size/2, this.size/2, this.size/2, 0 , 2 * Math.PI);
        this.mCTX.fillStyle = this.borderColor;
        this.mCTX.fill();
        this.mCTX.beginPath();
        this.mCTX.arc( this.size/2, this.size/2, (this.size/2)-this.borderWidth, 0 , 2 * Math.PI);
        this.mCTX.fillStyle = '#FFF';
        this.mCTX.fill();
    }
    


    private _drawSlice( color: string, startAngle: number, endAngle: number, label?: string ){

        const startRad = deg2rad( startAngle )-Math.PI/2;
        const endRad = deg2rad( endAngle )-Math.PI/2;
        const fontRad = deg2rad( startAngle + ((endAngle-startAngle)/2) )-Math.PI/2;

        this.mCTX.beginPath();
        this.mCTX.moveTo( this.size/2,this.size/2);
        this.mCTX.arc( this.size/2, this.size/2, (this.size/2)-this.borderWidth, startRad , endRad );
        
        this.mCTX.fillStyle = color;
        this.mCTX.fill();

        this.mCTX.fillStyle = "#FFF";
        this.mCTX.font = `bold ${this.fontsize}px Arial`;
        
        const percent = Math.floor((endRad-startRad)/(2*Math.PI) * 100);
        let txt = `${percent}%`;
        if( label ){
            txt = label;
        }
        const measure = this.mCTX.measureText(txt);
        const x = Math.cos( fontRad ) * (((this.size/2)-this.borderWidth)/2 + 10);
        const y = Math.sin( fontRad ) * (((this.size/2)-this.borderWidth)/2 + 10);

        if( percent>0){
            this.mCTX.save();
            this.mCTX.shadowOffsetX = 1;
            this.mCTX.shadowOffsetY = 1;
            this.mCTX.shadowBlur = 3;      
            this.mCTX.shadowColor = "rgba(0,0,0,0.8)";
            this.mCTX.fillText( 
                txt, 
                x+(this.size/2) - (measure.width/2), 
                y+(this.size/2) + (this.fontsize/2-2)
            );
            this.mCTX.restore();
        }
        
    }
    
    private _drawProc(){
        this.mCTX.clearRect(0,0,this.size,this.size);
        this._drawBG();

        let idx = 0;
        for( const info of this.data ){
            // console.log( info );
            this._drawSlice( info.color, info.start, this.mCurrentValue[idx].start, this.mCurrentValue[idx].label  );
            idx += 1;
        }
    }

    private _updateValue(){
        this.mCurrentValue = [];
        
        let idx = 0; 
        for( const info of this.data ){
            this.mCurrentValue.push( {
                start:info.start, 
                end:info.end,
                color:info.color,
                label: info.label===undefined? null: info.label
            });
            gsap.to( this.mCurrentValue[idx],{delay:idx*0.5 , start:this.mCurrentValue[idx].end, duration: 0.5 } )
            .eventCallback("onUpdate",()=>{
                this._drawProc();        
            })    
            idx+=1;
        }
        
    }
}
</script>