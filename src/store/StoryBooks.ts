import Vue from "vue";
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'

import Swal from 'sweetalert2';
import Axios from 'axios';

import store from '@/store'
import Util from "../Util"
import { API } from '@/store/Define';
import { Storybooks as SB } from "./Define"
import DefaultData from './DefaultData'
import { UserModule } from './UserStore';

@Module({ 
    namespaced:true,
    name:"storybooks",
    dynamic: true, 
    store, 
})
class StoryBooks extends VuexModule {
    
    private mFinishResultData: SB.FinishResultInfoData = null;
    get finishResultData(): SB.FinishResultInfoData{ return this.mFinishResultData }
    @Mutation private SET_FINISH_RESULTDATA( data: SB.FinishResultInfoData ) {
        this.mFinishResultData = data;
    }
    
    @Action async getFinishActivityCount( bookID: number){
        // try{
        //     const response = await Axios.get( `${Util.Config.restAPIProd}${API.storybooks.finishList.req}` );
        //     if( response.data.ok == true ){
        //         // console.log( response.data.infolist );
        //         this.SET_FINISH_RESULTDATA( response.data.infolist );
        //     }else{
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'getFinishResultInfoData error',
        //             text: response.data.err,
        //         });
        //     }
        // }catch(e){
        //     // this.SET_FINISH_RESULTDATA( null );
        //     this.SET_FINISH_RESULTDATA( DefaultData.storybookFinishInfo );
        //     console.warn( e ) 
        // }
    }
    @Action async getFinishResultInfoData() {
        try{
            const response = await Axios.get( `${Util.Config.restAPIProd}${API.storybooks.finishList.req}` );
            if( response.data.ok == true ){
                // console.log( response.data.infolist );
                this.SET_FINISH_RESULTDATA( response.data.infolist );
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'getFinishResultInfoData error',
                    text: response.data.err,
                });
            }
        }catch(e){
            // this.SET_FINISH_RESULTDATA( null );
            this.SET_FINISH_RESULTDATA( DefaultData.storybookFinishInfo );
            console.warn( e ) 
        }
    }
    
    //---------------------------------------------
    
    @Action async setActivityEnd( payload: { activity: string; endinfo: SB.EndActivityInfo }) {
        if( UserModule.homeData != null ){
            try{
                const response = await Axios.post( `${Util.Config.restAPIProd}${API.storybooks.endActivity.req}/${payload.activity}`, payload.endinfo);
                if( response.data.ok == true ){
                    const info: SB.EndActivityResponse = response.data.data;
                    //this.SET_FINISH_RESULTDATA( response.data.data );
                    if( payload.activity == "makingbook") this.getFinishResultInfoData();
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'setActivityEnd error',
                        text: response.data.err,
                    });
                }
            }catch( e ){
                console.warn( e );
            }
        }
    }
    
    //---------------------------------------------
    
    @Action async setMakingBookScreenShot( payload: SB.ScreenShotData ){
        try{
            const response = await Axios.post( `${Util.Config.restAPIProd}${API.storybooks.makingBookScreenShot.req}`, payload );
            if( response.data.ok == true ){
                //
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'setMypetScreenShot error',
                    text: response.data.err,
                });
            }
        }catch( e ){
            console.warn( e )
        }
    }
}
  
export const StoryBooksModule = getModule(StoryBooks);

