import gsap from 'gsap'

import {App} from '../../../Core'
import { NineSlicePlane } from 'pixi.js';
import { CardBG } from './CardBG';
import {shuffleArray} from '../../../Core/Util';

export class ChoiceCards extends PIXI.Container{
    
    private mCards: Array<CardBG>;
    private mClickLock: boolean;

    constructor(){
        super()
        this.mCards = [];
        this.mClickLock = false;
    }
    
    addCard( card: CardBG ){
        const idx = this.mCards.length;
        card.buttonMode = true;
        card.onClick=()=>{
            if( this.mClickLock == false ){
                this.onResult( card.isCorrect );
                this.mClickLock = true;
                for( const card of this.mCards ){
                    card.showCover();
                }
            }            
        }
        this.addChild( card )
        this.mCards.push( card );
        shuffleArray( this.mCards );
        let offset = 0;
        for( const card of this.mCards ){
            card.x = offset;
            offset += card.width+20;
        }
        if( this.mCards.length == 1){ this.pivot.x = 0 }
        if( this.mCards.length == 2){ this.pivot.x = this.mCards[0].width/2 }
        if( this.mCards.length == 3){ 
            this.pivot.x = this.mCards[0].width 
            this.x = this.x-20;
        }


        
    }

    async start(){
        for( const card of this.mCards ){
            card.show(1);
            // await card.show(0.5);
        }
        for( const card of this.mCards ){
            card.interactive = true;
        }
    }

    onSelect(idx: number){
        console.log( "onSelect ", idx);
    }
    onResult(isCorrect: boolean){
        //
    }
    waitingAnimation(){
        for(let i=0;i<this.mCards.length;i++){
            gsap.to(this.mCards[i].scale,{x:0.9,y:0.9 ,duration:0.5}).yoyo(true).repeat(1);
        }
        
    }
}