import {App} from '../../../Core'
import { gsap, TweenMax,Power2,Bounce } from 'gsap'
import { Stage } from './Stage';
import { Block } from './Block';

export class DragBlock extends Block{
    
    private mDragMoveAniTween: gsap.core.Tween;
    private mDragLock: boolean;
    private mCanDragStart= true;

    constructor(){
        super( -1, -1);

        this.mOffset = new PIXI.Point(0,0);
        this.mDragMoveAniTween = null;
        this.mDragLock = false;
        this.mCanDragStart = true;
    }


    onDragStart( block: Block){
        if( !this.mCanDragStart) return;
        this.mCanDragStart = false;

        const stage = Stage.Handle;
        const clickSound = App.Handle.currentGame.getResource(`am_sfx_1.mp3`).sound;
        clickSound.play();
        // 드래그할수 없게 잠겨있으면 처리 skip.( 아직 매치처리등을 하고 있는중)
        if( this.mDragLock == true ){ return }
        
        // 해당 블록의 위에 블록이 있으면, 움직일수 없다.
        if( !block.canMove() ){ return }
        
        // 해당블록을 끄고, 블록테이블도 0으로 수정
        const blockcode = block.blockCode;
        block.blockCode = 0;
        
        // 드래그블록의 정보를 선택한 블록과 일치시킴.
        this.blockCode = blockcode;
        this.mOffset.x = block.offset.x;
        this.mOffset.y = block.offset.y;
        this.position.x = block.position.x;
        this.position.y = block.position.y;
        
        this.scale.set(1);
        TweenMax.to( this.scale, 0.5, {x:1.2, y:1.2 } );
    }

    onDragging( globalPos: PIXI.Point ){
        const localPos = this.parent.toLocal( globalPos );
        
        // offset위치를 알아낸다.
        if( this.visible == true ){
            const offset = Stage.Handle.getOffsetPos( localPos );
            
            //해당 옵셋에 블록이 있으면 그곳으로 움직일수 없음.
            const block = Stage.Handle.getBlock( offset );
            if( block.blockCode == 0 ){
                if( this.mOffset.x != offset.x || this.mOffset.y != offset.y ){
                    this.mOffset.x = offset.x;
                    this.mOffset.y = offset.y;
                    const targetpos = Stage.Handle.getBlockPosition( this.mOffset );
                    if( this.mDragMoveAniTween ) this.mDragMoveAniTween.kill();
                    this.mDragMoveAniTween = gsap.to( this.position, {x:targetpos.x, y:targetpos.y, duration:0.3, ease:Power2.easeOut} );
                }
            }
        }
    }

    onDragEnd(){
        this.mCanDragStart = true;

        if( this.visible == false ){ return }
        if( this.mDragLock == true ){ return }
        const dropSound = App.Handle.currentGame.getResource(`am_sfx_2.mp3`).sound;
        dropSound.play();
        // 움직일수 있는상황이면, 드래그 다시시작할수 없게 잠근다. 떨어지고, 매치작업이 모두 종료되면 잠김이 풀림.
        this.mDragLock = true;
        
        //블록을 배치한다.
        const block = Stage.Handle.getBlock( this.mOffset );
        block.blockCode = this.blockCode;

        block.startDrop();
        //Stage.Handle.dropBlockCheckProc();
        
        //떨어지는 블록을 세팅했으니 드래그블록은 다시 안보이게 처리
        this.visible = false;
    }

    // 모든 떨어지고, 매칭되는 작업 끝남.
    onDropFinish(){
        this.mDragLock = false;
    }
}