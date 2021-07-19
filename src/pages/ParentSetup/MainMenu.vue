
<template>
    <div class="MainMenu">
        <div class="menubody">
            <div class="row title">
                <img src="img/parent/menu_bi.png" />
                <span>BabyAll ENGLISH</span>
                <img 
                    class="closeBTN" 
                    src="img/parent/btn_closemenu.png" 
                    @click.stop="_onCloseMenu()"
                />
            </div>

            <div class="row submenu" v-for="(info,idx) in subMenuList" :key="idx" @click.stop="_onSelectSubMenu(info.command)">
                <img class="submenuIcon" :src="`img/parent/${info.img}`" />
                <span> {{info.label}} </span>
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.MainMenu {
    background-color:rgba(0,0,0, 0.5);
    width: 100%;
    height: 100%;
    
    position: absolute;
    top: 0;
    z-index: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    .title{
        display: flex;
        flex-direction: row;

        border-bottom: 1px solid #e9e9e9;
        .closeBTN{
            cursor: pointer;
        }
        img{
            margin: 10px;
        }
        span{
            font-size: 1.5rem;
            color: #93b351;
            flex: 1;
        }
    }
    .submenu{
        padding:10px;
        background-color: #FFF;
    }
    .submenu:hover{
        cursor: pointer;
        background-color: #e1f3ff;
    }
    .submenuIcon{
        padding-left: 30px;
        padding-right: 20px;
        margin-top: 10px;
        margin-bottom: 10px;
        
    }
    .row{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .menubody{
        position: absolute;
        right:-600px;
        top:10px;
        width:495px; 
        background-color: #FFF;
        box-shadow: 0 0 20px rgba(0,0,0,0.4);

        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        padding-top:20px;
        padding-bottom:20px;

        display: flex;
        flex-direction: column;
    }
}
</style>

<script  lang="ts">
import {gsap} from 'gsap'
import { Component, Prop, Vue } from "vue-property-decorator";
import { UserModule } from '@/store/UserStore';
import Util from '@/Util';

const subMenu=[
    {label:'활동 리포트', command:"report", img:'btn_menu_report.png' },
    {label:'자녀 설정', command:"setup", img:'btn_menu_kids.png' },
    {label:'활용 영상', command:"movie", img:'btn_menu_play.png' },
    {label:'베이비올 종료', command:"exitBabyAll", img:'btn_menu_off.png' },
]
if( Util.Config.devMode ){
    subMenu.push( {label:'전체 정보 초기화', command:"reset", img:'btn_menu_off.png' } );
}
@Component({})
export default class MainMenu extends Vue {

    get subMenuList(){ return subMenu }

    mounted(){
        this.openMenu();
    }
    
    openMenu(){
        gsap.to('.menubody',{right: 0, duration:0.5} );
    }
    
    closeMenu(){
        gsap.to('.menubody',{right: -600, duration:0.5} )
        .eventCallback("onComplete",()=>{
            this.$emit("onCloseMainMenu");
        })
    }
    private _onCloseMenu(){
        this.closeMenu();        
    }

    _onSelectSubMenu( command: string){
        this.closeMenu();
        if( command == "reset"){
            UserModule.resetData();
        }else{
            this.$emit('onSelectMainMenu', command)
        }
    }
}
</script>
