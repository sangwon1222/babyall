<template>
<div style="width: 100%; padding:15px 0 20px;">
    <div class="graph-container" :style=" `height:${this.height}px; border-color:${this.color}; background-color:${this.bgcolor}`">
        <div class="graph-view" :style=" `height:${this.height}px; border-color:${this.color}; background-color:${this.bgcolor}`" />
        <div class="graph" :style="`width: ${this.mCurrentValue}%; background-color: ${this.color};  border:8px solid${this.color};`">
            <span class="value" v-if="mCurrentValue>=50" :style="`color:${this.labelcolor}`" >{{Math.floor(mCurrentValue)}}%</span>
        </div>
        <span v-if="mCurrentValue<50" :style="`margin-left: 10px; color:#555; z-index:1;` " >{{Math.floor(mCurrentValue)}}%</span>
    </div>
</div>
</template>


<style lang="scss" scoped>

.graph-container {
    // border:1px solid #F00;
    /* overflow: hidden; */
    position:relative;
    width: 100%;
    /* border-style: solid; */
    /* border-width: 4px; */
    
    display:flex;
    flex-direction: row;
    align-items: center;
    .graph-view{
        position:absolute;
        border-style: solid;
        border-width: 4px;
        border-radius: 50px;
        width:100%;
        z-index:0;
        box-sizing: border-box;
    }
    .graph {
        display:flex;
        justify-content: flex-end;
        align-items: center;

        margin-left:4px;
        height:16px;

        border-radius: 100px;
        z-index:1;
    }

    .value{
        margin-right: 10px;
        font-size: 1.2rem;
        color: white;
        z-index:1;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { gsap } from 'gsap'

//http://ccambo.github.io/Dev/Vue/6.How-to-use-vue-property-decorator/ 

@Component({})
export default class Graph extends Vue {
    @Prop({default:0}) private value: number;
    @Prop({default:30}) private height: number;
    @Prop({default:"#FC0"}) private color: string;
    @Prop({default:"#FFF"}) private bgcolor: string;
    @Prop({default:"#FFF"}) private labelcolor: string;

    @Watch('value')
    onViewChanged(val: number, oldVal: number) {
        this.updateValue();
    }
    private mCurrentValue = 0;
    
    mounted(){
        // gsap.delayedCall( 1, ()=>{
        //     this.updateValue();        
        // })
        this.updateValue();
    }

    updateValue(){
        // console.log("updateValue");
        gsap.to( this,{ mCurrentValue: this.value, duration:0.5 })
        
    }
}
</script>