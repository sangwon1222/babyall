import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import PopUp from '@/components/PopUp.vue';
import { UserModule } from './UserStore';
import Axios from 'axios';
import gsap from 'gsap';



@Module({ 
    namespaced:true,
    name:"system",
    dynamic: true, 
    store, 
})

class System extends VuexModule {
    // jwtToken
    private mJWTToken = "";
    get token(): string{ return this.mJWTToken }
    @Mutation
    private SET_JWTTOKEN( token: string ){
        this.mJWTToken = token;
    }

    //중복로그인 검사
    private mLoginErrCheck = false;
    get loginError(): boolean{ return this.mLoginErrCheck }
    @Mutation
    public setLoginError( flag: boolean ){
        this.mLoginErrCheck = flag;
    }

    // 체험판모드 인가?
    // private mIsDemo = true;
    get isDemoMode(): boolean{
        return this.token === "" ;
    }
    
    // 체험판 진행가능한가?
    private mDemoEnable = true;
    get isDemoEnable(){ return this.mDemoEnable }
    @Mutation
    private SET_DEMO_ENABLE( flag: boolean ){
        this.mDemoEnable = flag;
    }

    // @Mutation
    // private SET_DEMOMODE( flag: boolean ){
    //     this.mIsDemo = flag;
    // }

    //---------------------------------------------------
    // 현재 네비게이션 되는 페이지 컨포넌트 이름
    private mCurrentPage = "ConnectPage";
    get currentPage(): string{
        return this.mCurrentPage;
    }

    @Mutation private SET_CURRENT_PAGE( pagename: string ){
        this.mCurrentPage = pagename;
        // console.log(`%c ${this.mCurrentPage}` ,"background:black; color:white;")
    }

    @Action public setCurrentPage( pagename: string ){
        this.SET_CURRENT_PAGE( pagename );
    }
    //---------------------------------------------------
    
    // @Action public setDemoMode( flag: boolean ){
    //     this.SET_DEMOMODE( flag );
    // }

    @Action async init(){
        // url parse : window.location.search
        // console.log( `%ctoken:${localStorage.getItem('token')}`,'color:#F00; font-weight:bold;')
        
        if( localStorage.getItem('token') != null ){
            this.SET_JWTTOKEN(localStorage.getItem('token'));
        }

        // console.log("%cToken:"+localStorage.getItem('token'), "color:#F00");   
        
        if( this.token != "" ){
            Axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            this.startTimer();
        }
        if( this.isDemoMode == false ){
            await UserModule.getHowToData();
        }else{
            // 체험판 시간이 종료되었다면. 진행할수 없다.
            if( localStorage.getItem('trlvrsnDays') == null ){
                this.SET_DEMO_ENABLE( false );
            }else{
                if( localStorage.getItem('trlvrsnDays') != 'true' ){
                    this.SET_DEMO_ENABLE( false );
                }
            }
        }
    }

    //-----------------------------------
    private mPopup: PopUp = null;
    get popup(): PopUp{ return this.mPopup }
    @Mutation setPopup( popup: PopUp ){
        this.mPopup = popup
    }

    //-----------------------------------
    // timer : app시작부터 초단위로 증가.
    private mElapsedSec = 0;
    private mIsTimerActive = true;
    private mTimerIntervalID = -1;
    get elapsedSec(){ return this.mElapsedSec }
    @Mutation stopTimer(){
        if( this.mTimerIntervalID != -1 ){
            clearInterval( this.mTimerIntervalID );
            this.mTimerIntervalID = -1;
        }
    }
    @Mutation resetTimer(){
        this.mElapsedSec = 0;
        // this.mIsTimerActive = false;
        
    }
    @Mutation pauseTimer( flag: boolean){
        this.mIsTimerActive = flag;
    }
    
    @Mutation startTimer(){
        console.log( '%cstartTimer',"color:#F00; font-size: 15px; font-weight:bold");
        this.mIsTimerActive = true;
        if( this.mTimerIntervalID == -1 ){
            this.mTimerIntervalID = setInterval( ()=>{
                if( this.mIsTimerActive == true ){
                    this.mElapsedSec += 1;
                }
                // console.log("time was gone...", this.mElapsedSec )
            }, 1000)    
        }
    }
}
  
export const SystemModule = getModule(System);

// axios response(받을때) intercept 세팅
Axios.interceptors.response.use(
    (response)=>{
        // Do something with response data
        if( response.data.ok == true && response.data.errCode != undefined ){
            if( response.data.errCode == -100){
                SystemModule.setLoginError( true );
            }
        }
        return response;
    }, 
    (error)=>{
        // Do something with response error
        return Promise.reject(error);
    }
);

// axios request(보낼때) intercept 세팅
// Axios.interceptors.request.use(
//     (config)=>{
//         // Do something before request is sent
//         console.log(config);
//         return config;
//     }, 
//     function (error) {
//         // Do something with request error
//         return Promise.reject(error);
//     }
// );