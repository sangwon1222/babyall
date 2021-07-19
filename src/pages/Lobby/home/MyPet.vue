<template>
<div>
    <div class="myPet" >
        <img 
            :src=" this.isFirst?'img/home/btn_box_mypet_first.png':'img/home/btn_box_mypet.png' " 
            @click="_click()"/>
        <img class="state"
            v-show="!isFirst"
            :src="stateImage"
            @click="_click()"
            />
    </div>
</div>
</template>

<style lang="scss" scoped>
.myPet {
    overflow: hidden;
	position: relative;

	display: flex;
	justify-content: center;
	width:13.5rem;
	height:13.5rem;
	padding:0.5rem;
	cursor: pointer;

	>img{ width:100%; }
    .state{
        position:absolute;
        top:5rem;
        left:4rem;
        width:3.5rem;
        transform-origin:right bottom;
        animation: motion 2s infinite;
    }
    @keyframes motion {
        0%{transform: rotate(-20deg); transform-origin:right bottom}
        50%{  transform: rotate(5deg);   transform-origin:right bottom}
        100%{  transform: rotate(-20deg);   transform-origin:right bottom}
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UserModule } from '@/store/UserStore';
import gsap from 'gsap'

@Component({
    components:{
    }
})
export default class MyPet extends Vue {
    get isFirst(): boolean{
        if( UserModule.homeData == null ) return true;
        if( UserModule.homeData.mypetInfo.recievedPet == undefined ) return true;
        return UserModule.homeData.mypetInfo.recievedPet == false;
    }
    get stateImage(): string{
        if( UserModule.homeData && UserModule.homeData.userInfo.acornCnt < 5){
            return "img/home/bubble_acorn.png";
        }
        const table = [
            "img/home/bubble_love.png",
            "img/home/bubble_thirst.png",
            "img/home/bubble_q.png",
        ]
        const rand = Math.floor( Math.random() * 3);
        return table[rand];
    }
    mounted(){
        // this.$nextTick( ()=>{
        //     gsap.fromTo(".state",{rotate:-20},{rotate:5}).yoyo(true).repeat(-1);
        // });
    }
    _click(){
        this.$emit('onClick')
    }
}
</script>

