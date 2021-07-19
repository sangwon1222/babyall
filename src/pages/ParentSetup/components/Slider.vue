<template>
<div class="sliderCase" >
    <div class="slide-container">
        <div class="range" 
            :style="`background:${this.bgColor}`"></div>
        <div ref="timerMask" class="range" 
            :style="`background:${this.guageColor}`" ></div>
        <input class="slider" type="range" 
            :min="this.min" 
            :max="this.max" 
            :step="this.step"
            :style="`--cursor-color:${cursorColor}`"
            :value="this.mValue"
            @input="_onValueChanging"
            @change="_onValueChanged"
            />
        <span class="label" style="left:10px">{{start}}</span>
        <span class="label" style="right:10px">{{end}}</span>
    </div>
</div>
</template>


<style lang="scss" scoped>
.sliderCase{
    overflow: hidden; 
    width:100%;
    height:0;
    animation: motion 1s forwards;
    @keyframes motion {
        from{ height:0;}
        to{ height:150px;}
    }
}
.slide-container {
    
    position: relative;
    margin:40px auto;
    width: 90%;
    height: 70px;
    
    .label{
        color:#888;
        position: absolute;
        top:0;
    }

    .range{
        position: absolute;
        left:0px;
        top:50px;
        width: 96%;
        height: 12px;
        border-radius: 6px;
    }

    .slider {
        // border:1px solid #F0F;
        
        position: absolute;
        left:-4px;
        top:45px;
        width: 100%;
        
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        outline: none;        
    }
    
    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        position: relative;
        top:-6px;
        left: 0;
        width: 32px; /* Set a specific slider handle width */
        height: 32px; /* Slider handle height */
        background: var(--cursor-color); /* Green background */
        cursor: pointer; /* Cursor on hover */
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.4);
        // opacity:0.5;
        
    }

    .slider::-moz-range-thumb {
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4CAF50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Slider extends Vue {
    @Prop({default:'start'}) private start!: string;
    @Prop({default:'end'}) private end!: string;
    @Prop({default:'#FFF'}) private bgColor!: string;
    @Prop({default:'#FC0'}) private guageColor!: string;
    @Prop({default:'#000'}) private cursorColor!: string;
    
    @Prop({default:0}) private min: number;
    @Prop({default:100}) private max: number;
    @Prop({default:1}) private step: number;

    @Prop({default:0}) private init: number;

    private mValue = 0;
    
    $refs!: {
        timerMask: HTMLDivElement;
    }

    mounted(){
        this.mValue = this.init;
        this._updateValue();
    }

    private _updateValue(){
        const max = this.max-this.min;
        const percent =  (this.mValue / max) ;

        this.$refs.timerMask.style.width = `calc( (100% - 32px) * ${percent})`;
    }

    private _onValueChanged( evt ){
        // console.log(evt.target.value);
        this.mValue = parseInt(evt.target.value);
        this._updateValue();
        this.$emit("onValueChanged", this.mValue );
    }
    private _onValueChanging( evt ){
        // console.log(evt.target.value);
        this.mValue = parseInt(evt.target.value);
        this._updateValue();
        this.$emit("onValueChanging", this.mValue );
    }
    // #ff9f15
}
</script>