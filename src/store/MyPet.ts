import Vue from "vue";
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import Axios from 'axios';
import Util from '../Util'
import Swal from 'sweetalert2';
import { MyPet as MyPetDef } from "./Define"
import { API } from '@/store/Define'

@Module({ 
    namespaced:true,
    name:"mypet",
    dynamic: true, 
    store, 
})
class MyPet extends VuexModule {
    
    @Action async setMypetScreenShot( payload: MyPetDef.ScreenShotData ){
        try{
            const response = await Axios.post( `${Util.Config.restAPIProd}${API.myPet.screenShot.req}`, payload );
            if( response.data.ok == true ){
                //
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'setMypetScreenShot error',
                    text: response.data.err,
                });
            }
        }catch(e){
            console.warn(e)
        }
    }
    
    @Action async setRecieved(){
        try{
            const response = await Axios.post( `${Util.Config.restAPIProd}${API.myPet.recieved.req}`, {} );
            if( response.data.ok == true ){
                //
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'setRecieved error',
                    text: response.data.err,
                });
            }
        }catch(e){
            console.warn(e)
        }
    }

}
  
export const MyPetModule = getModule(MyPet);

