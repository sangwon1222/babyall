import Vue from "vue";
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import Axios from 'axios';
import Util from '../Util';
import { SystemModule } from './System';
import { UserModule } from './UserStore';
import { Alphabet as AL, API } from "./Define"
import Swal from 'sweetalert2';
import DefaultData from "./DefaultData"


@Module({ 
    namespaced:true,
    name:"alphabet",
    dynamic: true, 
    store, 
})
class Alphabet extends VuexModule {
    
    private mFinishResultData: AL.FinishResultInfoData = null;
    get finishResultData(): AL.FinishResultInfoData{ return this.mFinishResultData }
    // 학습 포커스되어야할 symbol(n번째)을 알아낸다.
    get currentFocusSymbolIDX(): number{
        // 로드된데이터가 없다면. A를 포커스로 한다.
        if( this.mFinishResultData == null ){
            return 0;
        }
        const keys = Object.keys( this.mFinishResultData );
        const keysReversed = Object.keys( this.mFinishResultData ).reverse();
        for( const k of keysReversed ){
            if( this.mFinishResultData[k].isLocked == false){
                return keys.indexOf( k );
            }
        }
    }
    @Mutation private SET_FINISH_RESULTDATA( data: AL.FinishResultInfoData ) {
        this.mFinishResultData = data;
    }
    @Action async getFinishResultInfoData() {
        try{
            const response = await Axios.get( `${ Util.Config.restAPIProd }${API.alphabet.finishList.req}` );
            if( response.data.ok == true ){
                console.log( response.data );
                this.SET_FINISH_RESULTDATA( response.data.infolist );
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Alphabet getFinishResultInfoData error',
                    text: response.data.err,
                });
            }
        }catch(e){
            this.SET_FINISH_RESULTDATA( DefaultData.alphabetSaveData );
            console.warn(e);
        }
    }

    //---------------------------------------------------
    
    @Action async setActivityEnd( payload: { activity: string; endinfo: AL.EndActivityInfo } ) {
        if( UserModule.homeData != null ){
            try{
                const response = await Axios.post( `${Util.Config.restAPIProd}${API.alphabet.endActivity.req}/${payload.activity}`, payload.endinfo);
                console.log( response )
                if( response.data.ok == true ){                
                    const info: AL.EndActivityResponse = response.data.infolist;
                    //this.SET_FINISH_RESULTDATA( response.data.data );
                    if( payload.activity == "quiz") this.getFinishResultInfoData();
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'setActivityEnd error',
                        text: response.data.err,
                    });
                }
            }catch(e){
                console.warn(e);
            }
        }
    
    }
    
    //---------------------------------------------
    
    
    
}
  
export const AlphabetModule = getModule(Alphabet);

