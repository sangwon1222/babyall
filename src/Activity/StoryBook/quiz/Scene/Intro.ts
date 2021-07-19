import { App , SceneBase } from '../../../Core';
import gsap from 'gsap';

export class Intro extends SceneBase{
    constructor(){
        super();
    }
    onStart(){
        gsap.delayedCall(2,()=>{
            this.game.goScene("activity")
        })
    }
}