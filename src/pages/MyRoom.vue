<!-- 부모 설정화면 -->
<template>
<div class="MyRoom">
    <TopMenu 
        @onClickBack="_clickBack"
        @onClickTabMenu="_clickTabMenu"
        />
    <component :is="this.mCurrentView" style="flex:1" />
</div>
</template>

<style lang="scss" scoped>
.MyRoom {
    width: inherit;
    height: inherit;
    background:#FFF;
    // background: linear-gradient(#e66465, #e6649a);
    // background-image: url("/img/bg1.png");
    display: flex;
    align-items: center;    
}

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Swal from 'sweetalert2'

import { SystemModule } from '../store/System';
import { UserModule } from '../store/UserStore';

import TopMenu from "./MyRoom/TopMenu.vue";
import BadgeList from "./MyRoom/BadgeList.vue";
import MakingBookList from "./MyRoom/MakingBookList.vue";
import PetAlbumList from "./MyRoom/PetAlbumList.vue";

@Component({
    components:{
        TopMenu,
        BadgeList,
        MakingBookList,
        PetAlbumList,
    }
})
export default class MyRoom extends Vue {
    private mIsShowMainMenu = false;
    private mCurrentView = "BadgeList"
    
    mounted(){
        //
    }

    private _clickBack(){
        SystemModule.setCurrentPage("Lobby");
    }

    private _clickTabMenu( label: string){
        console.log( label );
        if( label == "badge"){ this.mCurrentView = "BadgeList" }
        else if( label == "makebook"){ this.mCurrentView = "MakingBookList" }
        else if( label == "album"){ this.mCurrentView = "PetAlbumList"}
    }
}
</script>
