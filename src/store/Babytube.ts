import Vue from "vue";
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import Axios from 'axios';
import Util from '../Util';
import { UserModule } from './UserStore';
import { SystemModule } from './System';
import { API } from "@/store/Define"
import Config from '@/Util/Config';
import { isIOS } from '@/Util/Platform';

// 동영상 목록 플레이 방식
export enum PlayMode{
    None,
    LoopOne,
    LoopAll
}

// 동영상 목록 아이템 세부정보
export interface BabyTubeItemInfo{
    idx: number;
    bookID?: number;
    subject?: string;
    category?: string;
    titleColor?: string;
    thumb?: string;
    mp4?: string;
    movie?: string;
    movieLength?: string;
    favoriteFlag?: boolean;
    selected?: boolean;
    dtlBookSeqno?: number;
    vidoCtgrCd?: string;
}

@Module({ 
    namespaced:true,
    name:"babytube",
    dynamic: true, 
    store, 
})
class BabyTube extends VuexModule {
    private mThumbPath = Config.packageURL+"/babytube/thumbnail";
    private mMoviePath = Config.packageURL+"/babytube/movie";
    
    //------------------------------------------
    // 현재 리스팅 필터
    private mCurrentFilter = "favorite";
    @Mutation
    private SET_CURRENT_FILTER( filter: string ) {
        this.mCurrentFilter = filter;
    }

    //------------------------------------------
    // 현재 가동 플레이 모드
    private mPlayMode: PlayMode = PlayMode.LoopAll;
    private mSelPlayMode: PlayMode = PlayMode.LoopAll;
    get playMode(): PlayMode{
        return this.mPlayMode;
    }
    
    @Mutation
    private SET_PLAYMODE( mode: PlayMode ) {
        this.mPlayMode = mode;
    }
    
    @Action // 플레이 모드 변경 ( None -> LoopOne -> LoopAll --> None )
    public togglePlayMode(){
        if( this.mPlayMode == PlayMode.LoopAll ){
            this.SET_PLAYMODE( PlayMode.None );
        }else{
            this.SET_PLAYMODE( PlayMode.None);
        }
    }

    @Action // 플레이 모드 변경 ( None -> LoopOne -> LoopAll --> None )
    public selectPlayMode(mode: string){
        if(mode=="none"){ this.SET_PLAYMODE( PlayMode.None ) }
        if(mode=="all"){ this.SET_PLAYMODE( PlayMode.LoopAll ) }
        if(mode=="one"){ this.SET_PLAYMODE( PlayMode.LoopOne ) }
        console.log(`Loop ${mode}`)
    }

    //------------------------------------------
    // 현재 필터의 동영상 출력 목록
    private mTubeItemList: Array<BabyTubeItemInfo> = [];
    get tubeItemList(): Array<BabyTubeItemInfo> {
        return this.mTubeItemList;
    }
    @Mutation
    private SET_ITEMLIST( list: Array<BabyTubeItemInfo> ) {
        this.mTubeItemList = list;
    }
    
    //------------------------------------------
    // 현재 관람중인 동영상 항목 세부정보
    private mCurrentItemData: BabyTubeItemInfo|null = null;
    get currentItemData(): BabyTubeItemInfo | null {
        return this.mCurrentItemData;
    }    
    @Mutation
    private SET_CURRENT_ITEM( item: BabyTubeItemInfo ) {
        if(this.mCurrentItemData !== null ) {
            this.mCurrentItemData.selected = false;
        }
        this.mCurrentItemData = item;
        if( item ) item.selected = true;
    }
    
    //------------------------------------------

    // 현재 출력할 동영상 목록을 요청한다.
    @Action
    public async requestItemList( payloads: { filter: string; bookID?: number } ) {
        this.SET_CURRENT_FILTER( payloads.filter );
        
        let response = null;
        try{
            if( payloads.filter == "bookID" ){
                response = await Axios.post( `${Util.Config.restAPIProd}${API.babytube.contentsList.req}`, 
                { 
                    filter:payloads.filter,
                    bookID:payloads.bookID,
                });
            }else{
                response = await Axios.post( `${Util.Config.restAPIProd}${API.babytube.contentsList.req}`,
                {
                    filter: payloads.filter
                });
            }
            if( response.data.ok == true ){
                const temp = [];
                for( const info of response.data.infolist ){
                    const lengthString = info.movieLength.split(":");
                    info.movieLength = `${lengthString[0]}:${lengthString[1]}`
                    // console.log( "moviepath:",info.movie, info.favoriteFlag )
                    if( Util.Config.excuteMode == "saleskit"){
                        temp.push( {
                            idx: info.idx,
                            bookID: info.bookID,
                            subject: info.subject,
                            category: info.category,
                            titleColor: info.titleColor,
                            thumb: `${this.mThumbPath}/${info.thumb}.png`,
                            mp4: `${this.mMoviePath}/${info.movie}.mp4`,
                            movie: isIOS()?`${this.mMoviePath}/${info.movie}.mp4`:`${this.mMoviePath}/${info.movie}/${info.movie}.mpd`,
                            movieLength: info.movieLength,
                            favoriteFlag: info.favoriteFlag,
                            dtlBookSeqno: info.dtlBookSeqno,
                            vidoCtgrCd: info.vidoCtgrCd,
                            selected: false
                        })
                    }else{
                        if( SystemModule.isDemoMode ){
                            if( info.bookID == 2004){
                                temp.push( {
                                    idx: info.idx,
                                    bookID: info.bookID,
                                    subject: info.subject,
                                    category: info.category,
                                    titleColor: info.titleColor,
                                    thumb: `${this.mThumbPath}/${info.thumb}.png`,
                                    mp4: `${this.mMoviePath}/${info.movie}.mp4`,
                                    movie: isIOS()?`${this.mMoviePath}/${info.movie}.mp4`:`${this.mMoviePath}/${info.movie}/${info.movie}.mpd`,
                                    movieLength: info.movieLength,
                                    favoriteFlag: info.favoriteFlag,
                                    dtlBookSeqno: info.dtlBookSeqno,
                                    vidoCtgrCd: info.vidoCtgrCd,
                                    selected: false
                                })
                            }
                        }else{
                            temp.push( {
                                idx: info.idx,
                                bookID: info.bookID,
                                subject: info.subject,
                                category: info.category,
                                titleColor: info.titleColor,
                                thumb: `${this.mThumbPath}/${info.thumb}.png`,
                                mp4: `${this.mMoviePath}/${info.movie}.mp4`,
                                movie: isIOS()?`${this.mMoviePath}/${info.movie}.mp4`:`${this.mMoviePath}/${info.movie}/${info.movie}.mpd`,
                                movieLength: info.movieLength,
                                favoriteFlag: info.favoriteFlag,
                                dtlBookSeqno: info.dtlBookSeqno,
                                vidoCtgrCd: info.vidoCtgrCd,
                                selected: false
                            })
                        }
                    }
                }
                this.SET_ITEMLIST( temp );
                if( temp.length>0) this.selectItem( temp[0] );
            }
        }catch(e){
            console.warn(e);
        }
    }

    //해당 동영상을 즐겨찾기 처리( toggle )
    @Action
    public async toggleFavorite( payloads: { itemData?: BabyTubeItemInfo } ){
        try{
            console.log( payloads.itemData );
            // let uid = "";
            console.log( SystemModule.isDemoMode ); 
            if( !SystemModule.isDemoMode ){
                // uid = UserModule.userInfoJWT.childId;
                if( payloads.itemData ){
                    payloads.itemData.favoriteFlag = !payloads.itemData.favoriteFlag;
                    const response = await Axios.post( `${Util.Config.restAPIProd}${API.babytube.favorites.req}`,
                    {
                        // uid: uid,
                        dtlBookSeqno: payloads.itemData.dtlBookSeqno,
                        vidoCtgrCd: payloads.itemData.vidoCtgrCd,
                        value:payloads.itemData.favoriteFlag
                    })
                    console.warn( payloads.itemData.dtlBookSeqno, payloads.itemData.vidoCtgrCd, payloads.itemData.favoriteFlag );
                }
                // 현재 필터가 favorite면 로컬 아이템 목록에서 꺼진거를 지운다.
                if( this.mCurrentFilter == "favorite"){
                    if( payloads.itemData ){
                        const idx = this.mTubeItemList.indexOf( payloads.itemData );
                        if( idx != -1 ){
                            this.mTubeItemList.splice( idx, 1);
                        }
                    }
                }
            }
        }catch(e){
            console.warn(e)
        }
    }

    //해당 동영상 학습완료 처리
    @Action
    public async finish( payloads: { itemData?: BabyTubeItemInfo } ){
        // try{
            if( !SystemModule.isDemoMode ){
                console.log( payloads.itemData );
                // let uid = "";
                    if( payloads.itemData ){
                        const response = await Axios.post( `${Util.Config.restAPIProd}${API.babytube.finish.req}`,
                        {
                            // uid: uid,
                            dtlBookSeqno: payloads.itemData.dtlBookSeqno,
                            vidoCtgrCd: payloads.itemData.vidoCtgrCd,
                        })
                        console.warn( payloads.itemData.dtlBookSeqno, payloads.itemData.vidoCtgrCd, payloads.itemData.favoriteFlag );
                    }
            }
            
        // }catch(e){
        //     console.warn(e)
        // }
    }

    //해당 동영상을 셀렉트상태로 바꿈.( 이전 셀렉트는 선택해제 )
    @Action
    public selectItem( itemData: BabyTubeItemInfo ){
        if( itemData ) this.SET_CURRENT_ITEM( itemData );
    }

    //다음 동영상을 select해라~
    @Action
    public selectNext(){
        if( this.mCurrentItemData ){
            const idx = this.mTubeItemList.indexOf( this.mCurrentItemData );
            if ( idx != -1 ){
                if( this.mPlayMode == PlayMode.None){return false;}
                if( idx == this.mTubeItemList.length-1 ){
                    if( this.mPlayMode == PlayMode.LoopAll){
                        this.SET_CURRENT_ITEM( this.mTubeItemList[ 0 ] );
                        return true;
                    }
                    return false;
                }else{
                    if( this.mPlayMode == PlayMode.LoopOne){
                        this.SET_CURRENT_ITEM( this.mTubeItemList[ idx ] );
                        return true;
                    }else{
                        this.SET_CURRENT_ITEM( this.mTubeItemList[ idx + 1 ] );
                        return true;
                    }
                }                
            }            
        }
        return false;
    }

    
}
  
export const BabyTubeModule = getModule(BabyTube);

