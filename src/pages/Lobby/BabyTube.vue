<template>
<div class="BabyTube">
    <div class="container">
        <div class="menulist">
            <div
                class="menu-button"
                v-for="menuitem in mMenu"
                :key="menuitem.label"
                @click="_onSelectFilter(menuitem.filter)"
                >
            <img :src=" `img/babytube/${menuitem.icon}.png`" />
            <!-- <img class="img-button" :src="'img/bookcover/book_'+info.id+'.png'" /> -->
            <!-- <div v-if="info.progress==0" class="not-finished"> -->
            <!-- <img width="100%" src="img/lock.png" /> -->
            <!-- </div> -->
            </div>
        </div>
        
        <div style="width:1280px; height:20px; background:#efefef;" />

        <div class="steplist">
            <div class="title">
                <span>STEP1</span>
                <img src="img/babytube/playall.png" @click="_showTube({filter:'step1'})"/>
            </div>
            <div class="book-list" ref="bookList" @pointerover="_onOffSwiper(false)" @pointerleave="_onOffSwiper(true)">
                <BookListStep1 @_showTube="_showTube"/>
                <!-- <div
                class="bookThumb"
                v-for="i in 20"
                :key="i"
                >
                    <img :src="getBookCoverImagePath(1000+i)" @click="_showTube({filter:'bookID', id:1000+i} )"/>
                </div> -->
            </div>
        </div>

        <div style="width:1280px; height:20px; background:#efefef;" />
        <div class="steplist">
            <div class="title">
                <span style="color:#397fd5;">STEP2</span>
                <img src="img/babytube/playall.png" @click="_showTube( {filter:'step2'} )"/>
            </div>
            <div class="book-list"  @pointerover="_onOffSwiper(false)" @pointerleave="_onOffSwiper(true)">
                <BookListStep2 @_showTube="_showTube"/>
                <!-- <div
                class="bookThumb"
                v-for="i in 16"
                :key="i"
                >
                <img :src="getBookCoverImagePath(2000+i)" @click="_showTube( {filter:'bookID', id:2000+i} )"/>
                </div> -->
            </div>
        </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.BabyTube {
    width:inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 630px;
    // -ms-overflow-style: none; /* IE and Edge */
    // scrollbar-width: none; /* Firefox */
    .container {
        background-color:#FFF;
        position: relative;
        
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        
        height: 58rem;
        overflow-y: scroll;
        
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera*/}

        .menulist {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            padding:40px 0 0;
            width: 100%;
            height:400px;

            .menu-button {
                width:310px;
                cursor: pointer;
                &:last-child{
                    width:620px;
                }
                >img{
                    width:100%;
                }
            }
        }

        .steplist {
            width: 100%;
            .title {
                display:block;
                width:100%;
                height:76px;
                
                background-color: #FFF;
                border-bottom: 1px solid #EEE;
                >span{
                    position: relative;
                    top: 11px;
                    color:#f05574;
                    font-family: 'Noto sans';
                    font-size: 1.7rem;
                    font-weight: bold;
                    padding-left: 1.5rem;
                }
                >img{ 
                    position: relative;
                    top: 11px;
                    right: 30px;
                    float: right;
                }
            }

            .book-list {
                overflow-x: auto;
                display: flex; 
                flex-direction: row; 

                padding:10px 40px;
                width: 1200px;

                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */
                &::-webkit-scrollbar {display: none; /* Chrome, Safari, Opera*/}
            }
            
            /* .bookThumb {
                display: block;
                position:relative;
                min-width: 280px;
                height: 242px;
                box-sizing: border-box;
                
                >img{
                    position:absolute;
                    transform:translate(-50%,-50%);
                    top:50%;
                    left:50%;
                    width:90%;
                    border-radius: 15px;
                    box-shadow: 10px 10px 15px rgba(0,0,0,0.1);
                }
            } */
        }
    }

  
  
 
}


</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SystemModule } from '@/store/System';
import Swal from "sweetalert2"
import Util from '@/Util'
import { BabyTubeModule } from '@/store/Babytube';
import gsap from 'gsap';
import BookListStep1 from '@/pages/BookListStep1.vue'
import BookListStep2 from '@/pages/BookListStep2.vue'

@Component({ components:{
    BookListStep1,
    BookListStep2,
} })
export default class BabyTubePage extends Vue {
    private mMenu = [
        { icon: "bedtime", filter:"bs", label: "배드타임 스토리" },
        { icon: "daddysong", filter:"daddy", label: "대디즈 송" },
        { icon: "playtime", filter:"ps", label: "플레이 타임 스토리" },
        { icon: "song", filter:"song", label: "베이비올 송" },
        { icon: "singalong", filter:"singalong", label: "베이비 노래방" },
        { icon: "nurseryrhyme",filter:"mew", label: "영어 동요" },
        { icon: "favorites", filter:"favorite", label: "" }
    ]
    mounted(){
        //
    }
    _onOffSwiper(flag){
        this.$emit("_onOffSwiper",flag)
    }
    
    async _onSelectFilter( filterName: string ){
        console.log( "SELECT FILTER: ", filterName);
        if( SystemModule.isDemoMode == true ){
            if( filterName == 'favorite' ){
                Swal.fire({ text: `체험판에서는 사용할수 없습니다.`});
            }else if( filterName == 'mew' ){
                Swal.fire({ text: `체험판에서는 사용할수 없습니다.`});
            }else{
                this.$emit('onShowBabyTube', {filter:filterName})        
            }
        }else{
            if( filterName == 'favorite' ){
                await BabyTubeModule.requestItemList({filter: "favorite"});
                if(BabyTubeModule.tubeItemList.length == 0){
                    SystemModule.popup.showMessageHelp( "좋아하는 영상을 즐겨찾기 해주세요." );
                }else{
                    this.$emit('onShowBabyTube', {filter:filterName})        
                }
            }else{
                this.$emit('onShowBabyTube', {filter:filterName})        

            }
        }
    }

    getBookCoverImagePath(bookid: number){
        return `${Util.Config.packageURL}/bookcover/${bookid}_cover.png`
    }

    _showTube( filterinfo ){
        if( SystemModule.isDemoMode == true ){
            if(filterinfo.id != 2004){
                Swal.fire({ text: `체험판에서는 사용할수 없습니다.`});
            }else{
                this.$emit( 'onShowBabyTube', filterinfo );        
            }
        }else{
            this.$emit( 'onShowBabyTube', filterinfo );
        }
        
    }

}
</script>
