import * as PIXI from "pixi.js";
import { ResourceLoadTable } from "./Define";
import Config from "@/Util/Config";
import Util from "@/Util";

// 리소스 컨테이너 구조
/*
alphabet
 L catch
   L resources....   
mypet
  L default
   L resources...
storybooks
 L catch
   L resources....   
common
 L default
  L resources...
*/

// const gResourceRoot = Config.packageURL;

export class ResourceManager {
  //--------------------------------------
  // singleton
  private static sHandle: ResourceManager;
  static get Handle(): ResourceManager {
    // console.log( 'ResourceManager.sHandle',ResourceManager.sHandle);
    if (!ResourceManager.sHandle) {
      ResourceManager.sHandle = null;
      ResourceManager.sHandle = new ResourceManager();
    }
    return ResourceManager.sHandle;
  }
  //--------------------------------------

  private mResourceViewer: Partial<Record<string, PIXI.LoaderResource>>;
  private mResourceProduct: Partial<Record<string, PIXI.LoaderResource>>;

  constructor() {
    // this.mResourceCommon = {};
    this.mResourceViewer = {};
    this.mResourceProduct = {};
    //--------------------------------------
  }

  //뷰어 리소스를 로드한다. prefix : alphabet/block, common, mypet, storybooks/catch ...
  public async loadViewerResource(prefix: string, infoList: ResourceLoadTable) {
    // await this.resetTexture(prefix,infoList);
    return new Promise<void>((resolve) => {
      // this.mViewer = new PIXI.Loader();

      const viewer = new PIXI.Loader();
      // const loader = PIXI.Loader.shared;
      if (infoList.image !== undefined) {
        for (const path of infoList.image) {
          //이미 로드되어있으면 skip
          const key = `${prefix}/${path}`;
          const linkPath = `${prefix}/image/${path}`;

          if (this.mResourceViewer[key] === undefined) {
            if (Util.Config.devMode) {
              viewer.add(key, `${Config.packageURL}/dev_viewer/${linkPath}`);
            } else {
              viewer.add(key, `${Config.packageURL}/viewer/${linkPath}`);
            }
          }
        }
      }

      if (infoList.sound !== undefined) {
        for (const path of infoList.sound) {
          //이미 로드되어있으면 skip
          const key = `${prefix}/${path}`;
          const linkPath = `${prefix}/sound/${path}`;

          if (this.mResourceViewer[key] === undefined) {
            if (Util.Config.devMode) {
              viewer.add(key, `${Config.packageURL}/dev_viewer/${linkPath}`);
            } else {
              viewer.add(key, `${Config.packageURL}/viewer/${linkPath}`);
            }
          }
        }
      }

      if (infoList.spine !== undefined) {
        for (const path of infoList.spine) {
          //이미 로드되어있으면 skip
          const key = `${prefix}/${path}`;
          const linkPath = `${prefix}/spine/${path}`;
          if (this.mResourceViewer[key] === undefined) {
            if (Util.Config.devMode) {
              viewer.add(key, `${Config.packageURL}/dev_viewer/${linkPath}`);
            } else {
              viewer.add(key, `${Config.packageURL}/viewer/${linkPath}`);
            }
          }
        }
      }

      if (infoList.json !== undefined) {
        for (const path of infoList.json) {
          //이미 로드되어있으면 skip
          const key = `${prefix}/${path}`;
          const linkPath = `${prefix}/json/${path}`;
          if (this.mResourceViewer[key] === undefined) {
            if (Util.Config.devMode) {
              viewer.add(key, `${Config.packageURL}/dev_viewer/${linkPath}`);
            } else {
              viewer.add(key, `${Config.packageURL}/viewer/${linkPath}`);
            }
          }
        }
      }

      if (infoList.movie !== undefined) {
        for (const path of infoList.movie) {
          //이미 로드되어있으면 skip
          const key = `${prefix}/${path}`;
          const linkPath = `movie/${path}`;
          if (this.mResourceViewer[key] === undefined) {
            viewer.add(key, `${Config.packageURL}/${linkPath}`);
          }
        }
      }

      viewer.load(
        (
          loader: PIXI.Loader,
          resources: Partial<Record<string, PIXI.LoaderResource>>
        ) => {
          for (const [key, value] of Object.entries(resources)) {
            if (this.mResourceViewer[key] === undefined) {
              this.mResourceViewer[key] = value;
            }
          }
          resolve();
        }
      );
    });
  }

  //프로덕트 리소스를 로드한다. prefix : alphabet/block, storybooks/catch ...
  public async loadProductResource(
    prefix: string,
    infoList: ResourceLoadTable
  ) {
    return new Promise<void>((resolve) => {
      // const product = new PIXI.Loader();
      // product.reset();
      PIXI.Loader.shared.reset();

      const split = prefix.split("/");
      const gamename = split[0].toLowerCase();
      const activityname =
        split.length == 1 ? split[0].toLowerCase() : split[1].toLowerCase();

      if (infoList.image !== undefined) {
        for (const path of infoList.image) {
          //이미 로드되어있으면 skip
          const key = `${gamename}/${activityname}/${path}`;
          const linkPath = `${gamename}/image/${activityname}/${path}`;
          if (this.mResourceProduct[key] === undefined) {
            if (Util.Config.devMode) {
              PIXI.Loader.shared.add(
                key,
                `${Config.packageURL}/dev_product/${linkPath}`
              );
            } else {
              PIXI.Loader.shared.add(
                key,
                `${Config.packageURL}/product/${linkPath}`
              );
            }
          }
        }
      }
      if (infoList.sound !== undefined) {
        for (const path of infoList.sound) {
          //이미 로드되어있으면 skip
          const key = `${gamename}/${activityname}/${path}`;
          const linkPath = `${gamename}/sound/${path}`;
          if (this.mResourceProduct[key] === undefined) {
            if (Util.Config.devMode) {
              PIXI.Loader.shared.add(
                key,
                `${Config.packageURL}/dev_product/${linkPath}`
              );
            } else {
              PIXI.Loader.shared.add(
                key,
                `${Config.packageURL}/product/${linkPath}`
              );
            }
          }
        }
      }

      if (infoList.spine !== undefined) {
        for (const path of infoList.spine) {
          //이미 로드되어있으면 skip
          const key = `${gamename}/${activityname}/${path}`;
          const linkPath = `${gamename}/spine/${activityname}/${path}`;
          if (this.mResourceProduct[key] === undefined) {
            if (Util.Config.devMode) {
              PIXI.Loader.shared.add(
                key,
                `${Config.packageURL}/dev_product/${linkPath}`
              );
            } else {
              PIXI.Loader.shared.add(
                key,
                `${Config.packageURL}/product/${linkPath}`
              );
            }
          }
        }
      }

      if (infoList.json !== undefined) {
        for (const path of infoList.json) {
          //이미 로드되어있으면 skip
          const key = `${gamename}/${activityname}/${path}`;
          const linkPath = `${gamename}/json/${activityname}/${path}`;
          if (this.mResourceProduct[key] === undefined) {
            if (Util.Config.devMode) {
              PIXI.Loader.shared.add(
                key,
                `${Config.packageURL}/dev_product/${linkPath}`
              );
            } else {
              PIXI.Loader.shared.add(
                key,
                `${Config.packageURL}/product/${linkPath}`
              );
            }
          }
        }
      }

      if (infoList.movie !== undefined) {
        for (const path of infoList.movie) {
          //이미 로드되어있으면 skip
          const key = `${gamename}/${activityname}/${path}`;
          const linkPath = `${gamename}/movie/${path}`;
          if (this.mResourceProduct[key] === undefined) {
            PIXI.Loader.shared.add(key, `${Config.packageURL}/${linkPath}`);
          }
        }
      }

      console.log(PIXI.Loader.shared);

      PIXI.Loader.shared.load(
        (
          loader: PIXI.Loader,
          resources: Partial<Record<string, PIXI.LoaderResource>>
        ) => {
          for (const [key, value] of Object.entries(resources)) {
            this.mResourceProduct[key] = value;
            value.crossOrigin = "*";
            if (value.extension == "png") {
              // texture 제거
              PIXI.Texture.removeFromCache(value.texture);
              PIXI.BaseTexture.removeFromCache(value.texture.baseTexture);
            }
            if (value.extension == "mp3") {
              // 사운드 제거
            }
          }
          console.log(
            `%c Complete Product`,
            "color:green; font-weight: bold; font-size:1.1rem; letter-space:-0.01rem;"
          );
          PIXI.Loader.shared.destroy();
          resolve();
        }
      );

      PIXI.Loader.shared.onError.add(() => {
        console.error(`load error`);
        resolve();
      });

      // loader.onLoad.add(() => {
      //     loader.load( (loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>> ) =>{
      //         for( const [key, value] of Object.entries(resources) ){
      //             if(this.mResourceProduct[ key ]===undefined){
      //                 this.mResourceProduct[ key ] = value;
      //             }
      //             console.log(key)
      //         }
      //         resolve();
      //     });
      // })
    });
  }

  getViewerResource(path: string): PIXI.LoaderResource {
    if (this.mResourceViewer[path] === undefined) {
      // Swal.fire({
      //     icon: 'error',
      //     title: 'GameBase getResource',
      //     text: `뷰어리소스 ${path}가 로드되어있지 않습니다.`,
      // });
      console.error(`뷰어리소스 ${path}가 로드되어있지 않습니다.`);
      return null;
    } else {
      return this.mResourceViewer[path];
    }
  }

  getProductResource(path: string): PIXI.LoaderResource {
    if (this.mResourceProduct[path] === undefined) {
      // Swal.fire({
      //     icon: 'error',
      //     title: 'GameBase getProductResource',
      //     text: `프로덕트 리소스 ${path}가 로드되어있지 않습니다.`,
      // });
      console.error(`프로덕트 리소스 ${path}가 로드되어있지 않습니다.`);
      return null;
    } else {
      return this.mResourceProduct[path];
    }
  }

  destroy() {
    this.mResourceViewer = null;
    this.mResourceProduct = null;
    PIXI.utils.clearTextureCache();
    ResourceManager.sHandle = null;
  }
}
