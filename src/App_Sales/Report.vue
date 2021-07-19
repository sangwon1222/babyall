<template>
<div class="report">
    <div class="pageContainer" >
        <div class="movePage" ref="movePage">
            <div class="page" @click="pageMove(1)"><img src="salesKit/report01.png" alt=""  ></div>
            <div class="page" @click="pageMove(2)" ><img src="salesKit/report02.png" alt="" ></div>
            <div class="page" @click="pageMove(0)"><img src="salesKit/report03.png" alt=""  ></div>
        </div>
        <button class="close" @click="showGameList"></button>

        <div class="navigation">
            <span v-for="(v,i) in pagination" :key="i" @click="pageMove(i)" ref="pagination"></span>
        </div>
    </div>

    
</div>
</template>

<style lang="scss" scoped>
    .report{
        overflow: hidden;
        position:relative;
        display:flex;
        align-items: center;
        width:100vw;
        height:100vh;
        top:0;
        left:0;
        box-sizing:border-box;
        background:rgba(0,0,0,0.8);
        .pageContainer{
            overflow: hidden;
            position:relative;
            padding-bottom:30px;
            .movePage{
                width:300vw;
                .page{
                    float:left;
                    width:100vw;
                    margin: 0 auto;
                    box-sizing:border-box;
                    cursor:pointer;
                    >img{
                        width:90%;
                        margin-left:5%;
                    }
                }
            }
            .navigation{
                display:flex;
                position:absolute;
                bottom:-15px;
                left:50%;
                transform:translateX(-50%);
                justify-content: space-around;
                align-items: center;
                width:200px;
                height:50px;
                z-index:1000;
                >span{
                    display:block;
                    width:20px;
                    height:20px;
                    background-color:white;
                    border-radius: 20px;
                    cursor:pointer;
                }
            }
        }
        
        .close{
            position:fixed;
            top:20px;
            right:20px;
            width:60px;
            height:60px;
            border-radius: 60px;
            background:white;
            cursor:pointer;
            z-index:100;
            &:before{
                content:"";
                display:block;
                position:absolute;
                top:50%;
                left:50%;
                width:4px; 
                height:30px;
                background:black;
                transform: translate(-50%,-50%) rotate(45deg);
            }
            &:after{
                content:"";
                display:block;
                position:absolute;
                top:50%;
                left:50%;
                width:4px; 
                height:30px;
                background:black;
                transform: translate(-50%,-50%) rotate(-45deg);
            }
        }

        
        
        
        
    }
</style>

<script lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import gsap from 'gsap';
import Util from '@/Util';

@Component({
    components:{
    }
})
export default class Report extends Vue{
    private mBackUpX =0;
    private pagination = [0,1,2]
    $refs: {
        pagination: HTMLDivElement;
        movePage: HTMLDivElement;
    }
    mounted(){
        console.log(`REPORT!!!`)
        gsap.to(this.$refs.pagination[0],{width:100,duration:0.5});
        window.addEventListener('resize',()=>{
            gsap.to(this.$refs.movePage,{marginLeft:0,duration:0.5});
            gsap.to(this.$refs.pagination[0],{width:100,duration:0.5});
        })
    }
    showGameList(){
        this.$emit("showGameList")
        gsap.to(this.$refs.movePage,{marginLeft:0,duration:0.5});
        gsap.to(this.$refs.pagination,{width:20,duration:0.5});
        gsap.to(this.$refs.pagination[0],{width:100,duration:0.5});
    }
    pageMove(idx: number){
        gsap.to(this.$refs.pagination,{width:20,duration:0.5});
        gsap.to(this.$refs.pagination[idx],{width:100,duration:0.5});

        console.log(idx)
        if(idx == 0){gsap.to(this.$refs.movePage,{marginLeft:0,duration:0.5});}
        if(idx == 1){gsap.to(this.$refs.movePage,{marginLeft:-window.innerWidth,duration:0.5});}
        if(idx == 2){gsap.to(this.$refs.movePage,{marginLeft:-window.innerWidth*2,duration:0.5});}
    }

}

</script>
