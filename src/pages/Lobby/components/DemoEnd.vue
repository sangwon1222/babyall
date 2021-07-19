<template>
    <div class="dimmed">
        <div class="popup-body" @click.stop="">
            <img class="logo" src="img/parent/pop_logo.png">
            <div class="container">
                체험판 기간이 끝났습니다.
            </div>
            <img class="submitBTN" src="img/submit.png" @click="_submit">
            
        </div>    
  </div>
</template>

<style lang="scss" scoped>
.dimmed {
    width: 100%;    
    height: 100%;
    position: absolute;
    top:0;
    left:0;
    background-color: rgba(0,0,0,0.8);
    z-index: 100;
    
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.popup-body{
    padding-top: 30px;
    display:flex;
    flex-direction: column;
    align-items: center;
    position:relative;
    width: 650px;
    height: 400px;
    border-radius: 20px;
    background-color: #39d1cd;
    .container{
        margin-top: 20px;
        background-color: #FFF;
        width: 600px;
        height: 200px;
        border-radius: 20px;
        
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        font-size: 30px;
        font-weight: bold;
    }
    .submitBTN{
        margin-top: 20px;
        cursor: pointer;
    }
}
</style>

<script  lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import { UserModule } from '@/store/UserStore';
import { SystemModule } from '@/store/System';

import Swal from 'sweetalert2'
 
@Component({})
export default class DemoEnd extends Vue {
    mounted(){
        // console.log( UserModule.userInfo );
    }

    _submit(){
        // parent.close();
        history.back();
    }
    
}
</script>
