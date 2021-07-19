import { App } from '@/Activity/Core';

export class Hammer extends PIXI.Container {
    static debugMode = false;
    private mSpine: PIXI.spine.Spine;

    constructor() {
        super();
        this.mSpine = new PIXI.spine.Spine( App.Handle.currentGame.getResource("common_hammer.json").spineData);
        this.mSpine.position.set( 150/2, 120 );
        
        console.log( this.mSpine.skeleton.data.animations );
        //this.mSpine.state.setAnimation(0,"hammer_success",true);
        //this.mSpine.state.setAnimation(0,"hammer_fail",false);
        this.addChild( this.mSpine );
        
        if( Hammer.debugMode ){
            // 중심 표시
            const debugCenter = new PIXI.Graphics();
            debugCenter.lineStyle(2, 0xFF0000, 1);
            debugCenter.moveTo( 0, -10 );
            debugCenter.lineTo( 0, 10);
            debugCenter.moveTo( -10, 0 );
            debugCenter.lineTo( 10, 0);
            this.addChild(debugCenter);
        }
    }

    success(){
        this.mSpine.state.setAnimation(0,"hammer_success",false);        
    }
    fail(){
        this.mSpine.state.setAnimation(0,"hammer_fail",false);        
    }
}
