import * as PIXI from 'pixi.js';
import { ResourceLoadTable } from './Define';
import Config from '@/Util/Config';
import Util from '@/Util';

export class ViewerResource extends PIXI.Loader{
    private mResourceViewer: Partial<Record<string, PIXI.LoaderResource>>;

    constructor(){
        super()
        console.error(`Viewer Resource Start`)
        this.mResourceViewer = {};
    }
    //뷰어 리소스를 로드한다. prefix : alphabet/block, common, mypet, storybooks/catch ...
    public async loadViewerResource( prefix: string, infoList: ResourceLoadTable ){
    return new Promise<void>( (resolve )=>{
        this.destroy();
        this.reset();

        if( infoList.image !== undefined ){

            for( const path of infoList.image ){
                //이미 로드되어있으면 skip
                const key = `${prefix}/${path}`;
                const linkPath = `${prefix}/image/${path}`;
                if( this.mResourceViewer[key] === undefined ){
                    if( Util.Config.devMode ){
                        this.add( key, `${Config.packageURL}/dev_viewer/${linkPath}`)
                    }else{
                        this.add( key, `${Config.packageURL}/viewer/${linkPath}`)
                    } 
                }
            }
        }

    if( infoList.sound !== undefined ){
        for( const path of infoList.sound ){
            //이미 로드되어있으면 skip
            const key = `${prefix}/${path}`;
            const linkPath = `${prefix}/sound/${path}`;
            if( this.mResourceViewer[key] === undefined ){
                if( Util.Config.devMode ){
                    this.add( key, `${Config.packageURL}/dev_viewer/${linkPath}`)            
                }else{
                    this.add( key, `${Config.packageURL}/viewer/${linkPath}`)            
                }
            }
        }
    }

    if( infoList.spine !== undefined ){
        for( const path of infoList.spine ){
            //이미 로드되어있으면 skip
            const key = `${prefix}/${path}`;
            const linkPath = `${prefix}/spine/${path}`;
            if( this.mResourceViewer[key] === undefined ){
                if( Util.Config.devMode){
                    this.add( key, `${Config.packageURL}/dev_viewer/${linkPath}`)            
                }else{
                    this.add( key, `${Config.packageURL}/viewer/${linkPath}`)            
                }
            }
        }
    }

    if( infoList.json !== undefined ){
        for( const path of infoList.json ){
        //이미 로드되어있으면 skip
        const key = `${prefix}/${path}`;
        const linkPath = `${prefix}/json/${path}`;
            if( this.mResourceViewer[key] === undefined ){
                if( Util.Config.devMode){
                    this.add( key, `${Config.packageURL}/dev_viewer/${linkPath}`)            
                }else{
                    this.add( key, `${Config.packageURL}/viewer/${linkPath}`)            
                }
            }
        }
    }

    if( infoList.movie !== undefined ){
        for( const path of infoList.movie ){
            //이미 로드되어있으면 skip
            const key = `${prefix}/${path}`;
            const linkPath = `movie/${path}`;
            if( this.mResourceViewer[key] === undefined ){
                this.add( key, `${Config.packageURL}/${linkPath}`)            
            }
        }
    }

        this.load( (loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>> ) =>{
            for( const [key, value] of Object.entries(resources) ){
                if(this.mResourceViewer[ key ]===undefined){  
                    this.mResourceViewer[ key ] = value;     
                }
            }
                this.reset();
                this.destroy();
                PIXI.utils.clearTextureCache();
                resolve();
        });  
    })
    }

    getViewerResource( path: string ): PIXI.LoaderResource{
        if(this.mResourceViewer[path] === undefined){
            // Swal.fire({
            //     icon: 'error',
            //     title: 'GameBase getResource',
            //     text: `뷰어리소스 ${path}가 로드되어있지 않습니다.`,
            // });
            console.error(`뷰어리소스 ${path}가 로드되어있지 않습니다.`)
            return null;
        }else{
            return this.mResourceViewer[path];
        }
    }
}