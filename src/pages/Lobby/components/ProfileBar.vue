<template>
    <div class="ProfileBar">
        <img src="img/lobby/profile_bar.png" style="position:absolute; top:0; left:0; width:100%;" alt="">
        <div class="header">
            <img class="logo" src="img/lobby/logo.png" @click="goHome" />
            <!-- <div v-if="!isDemoMode" class="demoModeLabel"> Demo 모드 </div> -->
            <div class="userThumb" @click="_showActiveTime">
                <!-- <div class="imgholder"> -->
                    <img :src="this.thumbURL" />
                <!-- </div> -->
                <span>{{ this.name }}</span>
                <div class="book-count">{{ this.finishBookCount }}</div>
            </div>
            <div class="coin">
                <img src="img/lobby/acorn.png" />
                <span>{{ this.acornCount }}</span>
            </div>
        </div>

        <div class="TabPageNavi">
            <div
            class="button"
            @click="onSelectTab(item)"
            v-for="item in menu"
            :key="item.label"
            ref = "button"
            >
                <img :src="_getItemImage(item)" />
            </div>
            <!-- <div class="parent-lock">
                <img src="img/lobby/parent.png" @click="_showParentSetup" />
            </div> -->
        </div>
  </div>
</template>

<style lang="scss" scoped>
.ProfileBar {
    /* display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between; */
    position: fixed;
    top: 0;

    width: 100%;
    height: 5rem;
    box-sizing:border-box;
    /* background: url("../../../../public/img/lobby/profile_bar.png") no-repeat 100%;
    background-position:center center; */
    z-index: 2;

    .header{
        float:left;
        position:relative;
        width: 50%;
        height: inherit;
        .logo{
            position: absolute;
            top: 1rem;
            left: 1.92rem;
            cursor:pointer;
        }
        .userThumb {
            position: absolute;
            top: 0.6rem;
            left: 9.895rem;
            border:3px solid #c7ecff;
            border-radius: 2rem ;
            width:11.06rem;
            height:3.265rem;
            cursor:pointer;
                img {
                    position:absolute;
                    top:0.31rem;
                    left:0.31rem;
                    width:2.7rem;
                    height:2.7rem;
                    border-radius: 2.7rem;
                }
            
            /* } */
            span {
                // border:1px solid #F00;
                position: absolute;
                top:50%;
                left:4rem;
                transform: translateY(-50%);
                width:5rem;
                color: #000;
                font-family: 'Noto sans';
                font-size: 1.1rem;
                font-weight: normal;
                text-align: center;
            }
            .book-count{
                position: absolute;
                display:flex;
                justify-content: center;
                align-items: center;
                top:0;
                left:-1.6rem;
                width:2rem;
                height:2rem;
                font-size:1rem;
                border-radius: 2rem;
                box-sizing: border-box;
                color:#FFF;
                background-color: #ff62b0;
            }
        }
        .coin {
            position: absolute;
            top: 0.6rem;
            left: 23.065rem;
            width:6.6rem;
            height:3.265rem;
            
            border:3px solid #c7ecff;
            border-radius: 65px ;
            
            img {
                position:absolute;
                top:0.31rem;
                left:0.31rem;
                width:2.7rem;
                height:2.7rem;
                border-radius: 2.7rem;
            }

            span {
                // border:1px solid #F00;
                position: absolute;
                left:3rem;
                top:50%;
                transform: translateY(-50%);;
                width:3rem;
                color: #000;
                font-family: 'Noto sans';
                font-size: 1.1rem;
                font-weight: normal;
                text-align: center;
            }
        }
    }
    
    .TabPageNavi {
        float:left;
        position:relative;
        padding:0 0 0 2.8rem;
        width: 50%;
        height: inherit;
        box-sizing: border-box;

        /* .parent-lock {
            margin-top:0.6rem;
            height:65px;
            cursor:pointer;
            img {
            border-radius: 60px;
            }
        } */
        .button {
            float:left;
            cursor: pointer;
            margin-left:1rem;
            &:first-child{
                margin-left:0;
            }
            /* &:hover { background-color: #ccc; } */
        }
        
    }
}






</style>

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import { UserModule } from '@/store/UserStore';
import { SystemModule } from '@/store/System';

import Swal from 'sweetalert2'
 
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

@Component({})
export default class ProfileBar extends Vue {
    @Prop({default: [{}]}) private menu!: Array<any>;

     _getItemImage( item ){
        //item.selected == true ? require(`../../../assets/img/homenavi/${item.img}_select.png`):require(`../../../assets/img/homenavi/${item.img}_nor.png`)
        return item.selected == true ? `img/lobby/${item.img}_select.png`:`img/lobby/${item.img}_nor.png`;
    }
    onSelectTab( item ) {
        for( const item_ of this.menu ){
            if( item_ !== item ){
                item_.selected = false;
            }
        }
        item.selected = true;
        if(item.pageIDX=="MomAndDaddy"){
            this._showParentSetup();
        }else{
            this.$emit("onSelectTab", item.pageIDX);
        }
    }

    get isDemoMode(): boolean { return SystemModule.isDemoMode }
    get thumbURL(): string { 
        return UserModule.profileURL;
    }
    get name(): string { 
        if( UserModule.homeData == null ) return "---";
        if( UserModule.homeData.userInfo.childNm.length>4){
            return UserModule.homeData.userInfo.childNm.slice(0,4)+".."
        }
        return UserModule.homeData.userInfo.childNm;        
    }
    get acornCount(): string { 
        if( UserModule.homeData == null ) return "0";
        return numberWithCommas( UserModule.homeData.userInfo.acornCnt );
    }
    get finishBookCount(): number{
        if( UserModule.homeData == null ) return 0;
        return UserModule.homeData.userInfo.cpltBookCnt;
    }
    
    mounted(){
        this.onSelectTab( this.menu[0] );
    }

    _showParentSetup(){
        if( SystemModule.isDemoMode == true ){
            Swal.fire({
                // icon: 'error',
                // title: 'GameBase getResource',
                text: `체험판에서는 사용할수 없습니다.`,
            });
            return;
        } 
        this.$emit('onClickParentSetup')
    }

    _showActiveTime(){
        this.$emit('onShowActiveTime')
    }
    goHome(){
        this.$emit('goHome',"Home")
    }
}
</script>
