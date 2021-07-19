
<template>
    <div class="TopMenu">
        <div class="row">
            <div class="btnCase"><img class="menuBTN" src="img/parent/btn_home.png" @click.stop="_onClickBack()"/></div>
            <div class="title">{{title}}</div>
            <div class="btnCase"><img class="menuBTN" src="img/parent/btn_menu.png" @click.stop="_onClickMenu()"/></div>

            <div class="subRow" v-if="this.title=='활동 리포트'">
                <img 
                    class="subMenuBTN"
                    :src="this.mSubMenu=='ReportSummary'?'img/parent/report_sub1_focus.png':'img/parent/report_sub1_nor.png'" 
                    @click="_onClickSubMenu('ReportSummary')"/>
                <img 
                    class="subMenuBTN"
                    :src="this.mSubMenu=='ReportSB'?'img/parent/report_sub2_focus.png':'img/parent/report_sub2_nor.png'" 
                    @click="_onClickSubMenu('ReportSB')"/>
                <img 
                    class="subMenuBTN"
                    :src="this.mSubMenu=='ReportAL'?'img/parent/report_sub3_focus.png':'img/parent/report_sub3_nor.png'" 
                    @click="_onClickSubMenu('ReportAL')"/>
            </div>
        </div>
        
    </div>
</template>

<style lang="scss" scoped>
.TopMenu {
    background-color: #FFF;
    box-shadow: 0rem 0rem 1rem rgba(0,0,0,0.2);
    // border: 1px dashed #fc0;
    width: inherit;
    height: 90px;
    
    position: absolute;
    top: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .row{
        position:relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        
        height:90px;
        .subRow{
            position:absolute;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            justify-content: center;
            right:8rem;
        }
    }
    .title{
        flex: 1;
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        padding-left: 2rem;

        height:90px;
        font-size: 1.4rem;
        font-weight: bold;
        letter-spacing: -0.05rem;
    }
    .btnCase{
        width:3rem;
        cursor: pointer;
        margin: 0.8rem 1rem;
        z-index:1;
        .menuBTN{
            height:100%;
        }
    }
    
    .subMenuBTN{
        cursor: pointer;
    }
}
</style>

<script  lang="ts">

import { Component, Prop, Vue,Watch } from "vue-property-decorator";

@Component({})
export default class TopMenu extends Vue {
    @Prop( {default:""} ) private title: string;
    @Prop( {default:""} ) private currentMenu: string;
    private mSubMenu= "ReportSummary";
    
    mounted(){
        //
    }
    @Watch('currentMenu')
        onChildChanged(val: string, oldVal: string) {
            this.mSubMenu = this.currentMenu;
        }
    @Watch('title')
        ontitleChanged(val: string, oldVal: string) {
            if(this.title=="활동 리포트"){ this.$el.getElementsByClassName('title')[0].setAttribute('style','justify-content: flex-start; padding-left:2rem')}
            else{this.$el.getElementsByClassName('title')[0].setAttribute('style','justify-content: center;  padding-left:0 ')}
        }

    _onClickBack(){
        this.$emit('onClickBack')
    }

    _onClickMenu(){
        this.$emit('onShowMainMenu')
    }
    _onClickSubMenu( menu: string){
        this.mSubMenu = menu;
        this.$emit('onShowSubMenu', this.mSubMenu)
    }
}
</script>
