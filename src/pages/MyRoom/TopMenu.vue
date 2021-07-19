
<template>
<div class="TopMenuMyRoom">
    <div class="row">
        <img class="menuBTN" src="img/parent/btn_pre.png" @click.stop="_clickBack()"/>
        <div class="tabGroup">
            <img 
                :src="this.mCurrentFocus=='badge'?`img/myroom/btn_badge.png`:`img/myroom/btn_badge_inactive.png`" 
                @click.stop="_clickTabMenu('badge')"/>
            <img 
                :src="this.mCurrentFocus=='makebook'?`img/myroom/btn_make_book.png`:`img/myroom/btn_make_book_inactive.png`" 
                @click.stop="_clickTabMenu('makebook')"/>
            <img 
                :src="this.mCurrentFocus=='album'?`img/myroom/btn_album.png`:`img/myroom/btn_album_inactive.png`" 
                @click.stop="_clickTabMenu('album')"/>
        </div>
    </div>
</div>

</template>

<style lang="scss" scoped>
.TopMenuMyRoom {
    background-color: #FFF;
    box-shadow: 0rem 0rem 1rem rgba(0,0,0,0.2);
    // border: 1px dashed #fc0;
    width: 100%;
    height: 90px;
    
    position: absolute;
    top: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .tabGroup{
        flex:1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor:pointer;  
        img{
            margin:0;
            &:nth-of-type(2){ margin:0 2rem; }
        }        
    }
    .row{
        width:100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        
    }
    .title{
        flex: 1;
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }
    .menuBTN{
        cursor: pointer;
        margin: 15px;
        margin-left: 30px;
    }
}
</style>

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class TopMenu extends Vue {
    
    private mCurrentFocus = "badge"
    mounted(){
        //
    }
    _clickBack(){
        this.$emit('onClickBack')
    }
    _clickTabMenu( label: string ){
        this.mCurrentFocus = label;
        this.$emit('onClickTabMenu', label );
    }
}
</script>
