//import screenfull from 'screenfull'

import Config from "./Config";


//https://github.com/willmcpo/body-scroll-lock
// https://stackoverflow.com/questions/1207008/how-do-i-lock-the-orientation-to-portrait-mode-in-a-iphone-web-application


// 풀스크린 관련
// https://developers.google.com/web/fundamentals/native-hardware/fullscreen?hl=ko
export function isIOS(){
    const toMatch = [
        /Macintosh/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
    ];
    // console.error(navigator.userAgent)
    return toMatch.some((toMatchItem) => {
        // alert( toMatchItem+":"+navigator.userAgent+":"+navigator.userAgent.match(toMatchItem) )
        return navigator.userAgent.match(toMatchItem);
    });
}
export function isMobilePlatform() {
    // const filter = "win16|win32|win64|mac";
    // if (navigator.platform) {
    //     if (0 > filter.indexOf(navigator.platform.toLowerCase())) {
    //         //alert("Mobile");
    //         return true;
    //     } else {
    //         //alert("PC");
    //         return false;
    //     }
    // }
    const toMatch = [
        /Android/i,
        /webOS/i,
        /Macintosh/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

export function checkVersion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        const version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] , 10) ] ;
        return version;
    }
}

export function getPlatform() {
    // console.error(navigator.appVersion);
    const agent = navigator.userAgent.toLowerCase();

    // IE일때
    if( navigator.appName == "Netscape"  &&
        agent.indexOf('trident') != -1     ){

        Config.platform = "IE"
        Config.platformText = `
            Internet Explorer는 아람스마트북의 일부기능을 지원하지 않습니다.<br/>
            <span style="display:block; margin:2rem 0 ; color: red;" > 
                아람북클럽은 크롬 브라우저에 최적화 되어 있습니다.
            </span>
        `
        return false;
    }

    // Android 일때
    if (navigator.appVersion.indexOf('Android') != -1) {
      // 안드로이드일 때는 4.0 이하 버전 실행 X
      const ua = navigator.appVersion;
      const androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)); 
    //   alert( androidversion )
      if (androidversion <= 4.0){
            Config.platform = `Android`
            Config.platformText = `
                아람 스마트북은 Android 5.0 이상에서 이용 가능합니다.<br/>
                <span style="display:block; margin:2rem 0 ; "> 
                Android 업데이트 후 사용 바랍니다.
                </span>
            `
            return false;
      }
    }
    //   if ( ua.match(/iPad/i) || ua.match(/iPhone/i) )

    // IOS 일때
    if( isIOS() ){
        const ua = navigator.appVersion;
        const version = parseFloat(ua.slice(ua.indexOf("Version")+8)); 

        if(version <= 12){

            Config.platform = `IOS`
            Config.platformText = `
                iOS 및 iPad OS 12 이하에서는 아람스마트북의 <br/>
                일부기능이 작동하지 않을 수 있습니다.
                <span style="display:block; margin:2rem 0; color:red; "> 
                iPhone 6s 이상 모델에서 이용 권장드립니다.
                </span>
            `
            return false;
        }
        else if( version == 13  ) {
            Config.platform = `IOS`
            Config.platformText = `
                일부 기능이 정상적으로 작동하지 않을 수 있습니다. <br/>
                iOS 및 iPad OS 버전을 최신화 해주세요.
                <span style="display:block; margin:2rem 0; color:red; "> 
                14.3 이상에 최적화 되어 있습니다.
                </span>
            `
            return false;
        }
        else{
            return true;
        }

     }
    // if (navigator.appVersion.indexOf('iPad') != -1) {
    //     console.error(navigator.appVersion.indexOf('iPad'))
    //   // iPad 일 때는 12_0_0 이하 버전 실행 X
    //   return false;
    // }
    // if (navigator.appVersion.indexOf('iPhone') != -1) {
    //     console.error(navigator.appVersion.indexOf('iPhone'))
    //   // iPad 일 때는 12_0_0 이하 버전 실행 X
    //   return false;
    // }
    else {
        return true;
    }
}

// https://developer.mozilla.org/ko/docs/Web/API/Screen/lockOrientation
export function scrollLock(direction, cb) {
    //https://www.w3.org/TR/screen-orientation/
    //모바일인경우는 수행하지 않는다.(모바일은 지원하지 않는다.)
    if (!isMobilePlatform()) return;

    if (screen.orientation.lock) {
        screen.orientation
            .lock(direction)
            .then(() => {
                if (cb) cb();
                // _LOCK_BUTTON.style.display = 'none';
                // _UNLOCK_BUTTON.style.display = 'block';
            })
            .catch(function (error) {
                console.error(error);
            });
    }
}

export function isFullscreen() {
    return false;
    //return document.fullscreen || document.webkitCurrentFullScreenElement;
    //return document.fullscreen;
}

export function setFullScreenMode(flag, cb) {
    //모바일 아닌 경우는 수행하지 않는다.
    if (!isMobilePlatform()) {
        console.warn(" This Device is not mobile");
        return;
    }

    if (flag == true) {
        const options = {
            //"hide" : full dimensions of the screen of the output device
            //"show" : dimensions of the screen of the output device clamped to allow the user agent to show page navigation controls
            //"auto" : user-agent defined, but matching one of the above
            navigationUI: ("hide" as FullscreenNavigationUI)
        };

        if (isFullscreen() == true) return;

        // let cb = ()=>{
        //     scrollLock( ScreenDirection.portrait )
        // }
        //alert( window["webkitEnterFullscreen"] );

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen(options).then(() => {
                /* 스크롤락관련 처리 201103
                scrollLock("portrait-primary", () => {
                    if (cb) cb();
                });
                */
            });
            
        } else if (document.documentElement["webkitRequestFullscreen"])
            document.documentElement["webkitRequestFullscreen"](options).then(cb);
        else if (document.documentElement["mozRequestFullScreen"])
            document.documentElement["mozRequestFullScreen"](options).then(cb);
        else if (document.documentElement["msRequestFullscreen"])
            document.documentElement["msRequestFullscreen"](options).then(cb);
    } else {
        if (!isFullscreen()) return;
        const exitFullscreen =
            document["exitFullscreen"] ||
            document["mozCancelFullScreen"] ||
            document["webkitExitFullscreen"] ||
            document["msExitFullscreen"];
        exitFullscreen.call(document).then(() => {
            if (cb) cb();
        });
    }
}

