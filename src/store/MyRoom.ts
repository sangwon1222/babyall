import Vue from "vue";
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import Axios from 'axios';
import Util from "../Util"
import { MyRoom } from './Define';
import DefaultData from './DefaultData';
import { API } from '@/store/Define';
import Swal from 'sweetalert2';



@Module({ 
    namespaced:true,
    name:"myroom",
    dynamic: true, 
    store, 
})
class MyRoom extends VuexModule {
    
    private mBadgeData: MyRoom.BadgeData = null;
    get badgeData(): MyRoom.BadgeData{ return this.mBadgeData }
    @Mutation private SET_BADGEDATA( data: MyRoom.BadgeData ) {
        this.mBadgeData = data;
    }
    
    @Action async requestBadgeData() {
        try{
            const response = await Axios.get( `${Util.Config.restAPIProd}${API.myRoom.badge.req}`);
            if( response.data.ok == true ){
                console.log(response.data)
                this.SET_BADGEDATA( response.data.infolist );
                // this.SET_BADGEDATA( DefaultData.badgeData );
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'requestBadgeData error',
                    text: response.data.err,
                });
            }
        }catch(e){
            console.warn( e );
            this.SET_BADGEDATA( DefaultData.badgeData );
        }
    }

    //---------------------------------------------

    private mMakingBookScreenShotURL: Array<string> = []
    get makingBookData(): Array<string>{ return this.mMakingBookScreenShotURL }
    @Mutation private SET_MBOOKDATA( data: Array<string> ) {
        this.mMakingBookScreenShotURL = data;
    }
    @Action async getMakingBookList( ){
        try{
            const response = await Axios.get( `${Util.Config.restAPIProd}${API.myRoom.makingbook.req}` );
            if( response.data.ok == true ){
                this.SET_MBOOKDATA( response.data );
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'getMakingBookList error',
                    text: response.data.err,
                });
            }
        }catch(e){
            console.warn( e )
        }
    }

    //---------------------------------------------

    private mMyPetScreenShotURL: Array<string> = []
    get myPetData(): Array<string>{ return this.mMyPetScreenShotURL }
    @Mutation private SET_MYPETDATA( data: Array<string> ) {
        this.mMyPetScreenShotURL = data;
    }
    @Action async getMyPetList( ){
        try{
            const response = await Axios.get( `${Util.Config.restAPIProd}${API.myRoom.myPet.req}`);
            if( response.data.ok == true ){
                this.SET_MYPETDATA( response.data );
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'getMyPetList error',
                    text: response.data.err,
                });
            }
        }catch(e){
            console.warn( e );
        }
    }

    
}
  
export const MyRoomModule = getModule(MyRoom);

