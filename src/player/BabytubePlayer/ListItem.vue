<template>
    <div class="BabytubeListItem" @click="_onSelect">
        <div class="case">
            <img ref="thumb" class="thumb" :src="this._getThumb()" />
            <div class="contents">
                <div class="category" :style=" 'color:'+info.titleColor+'; font-weight:bold;' ">{{info.category}}</div>
                <div class="subject">{{info.subject}}</div>
                <div class="bottom">
                    <span>{{movieLength}}</span>
                    <div class="imgCase">
                        <img @click.stop="_onToggleFavorite" class="favorite" :src="this._getFavoriteFlag()===true?'img/babytube/favorite_on.png':'img/babytube/favorite_off.png'" />
                    </div>
                    
                </div>
            </div>
        </div>
        <img class="bridge" src="img/babytube/list_bridge.png" />
        <!-- <img v-show="selected" class="list_select" src="img/babytube/list_select.png" /> -->
    </div>
</template>

<style lang="scss" scoped>
.BabytubeListItem{
    /* border:1px dashed #F00; */
    cursor:pointer;
    width: 30rem;
    // min-height:210px;
    background-color: #f8f8f8;
    display:flex;
    flex-wrap:wrap;
    flex-direction: column;
    .case{
        display:flex;
        flex-direction: row;
        width:100%;
        height:8.3rem;
        .thumb{
            height:100%;
        }
        .contents{
            // border:1px solid #F00;
            position:relative;
            z-index: 2;
            display:flex;
            flex-direction: column;
            margin-left:1rem;
            height:100%;
            width:100%;
            .category{
                font-family: "BPreplay-Bold";
                font-size: 20px;
                margin-top: 0.3rem;
                margin-bottom: 0.3rem;
            }
            .subject{
                font-family: "Noto sans";
                font-size: 17px;
                margin-top: 0.3rem;
                margin-bottom: 0.3rem;
                flex: 1;
            }
            .bottom{
                position:absolute;
                bottom:0px;
                width:100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                span{
                    display:block;
                    background-color: rgba(0,0,0,0.7);
                    margin-bottom: 10px;
                    padding:2.5px 10px;
                    border-radius: 15px;
                    font-size: 16px;
                    color:#fff;
                }
            }
            .imgCase{
                    overflow: hidden;
                    position: relative;
                    float:right;
                    margin:0.5rem;

                    width:50px;
                    height:50px;
                    border-radius: 50px;
                    cursor: pointer;
                .favorite {
                    position:absolute;
                    transform: translate(-50%,-50%);
                    top:50%;
                    left:50%;
                    width:100%;
                }
            }
            
        }
    }
    .list_select{
        position:absolute;
        height:8.3rem;
        z-index:1;
    }
}
.bridge{
        width:100%;
    }

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { BabyTubeItemInfo } from "../../store/Babytube"

import gsap from "gsap";


@Component({
    components:{
    }
})
export default class BabytubeListItem extends Vue {
    @Prop({required: true}) private info!: BabyTubeItemInfo;
    
    get selected(): boolean{
        // 선택될때 자신의 위치를 리스트 최상단으로 스크롤한다.(세로모드 기능)
        if( this.info.selected ){
            const self: HTMLDivElement = (this.$el as HTMLDivElement);
            if( self !== undefined){
                gsap.to( (self.offsetParent as HTMLDivElement), {
                    scrollTop:self.offsetTop,
                    duration:0.5
                    });
            }
        }
        return this.info.selected;
    }
    get movieLength(): string{
        // console.log( this.info );
        return this.info.movieLength;
    }
    constructor(){
        super();
    }

    mounted(){
        // console.log( this.info);
    }

    private _getFavoriteFlag(): boolean{
        if( this.info == null ){
            return false;
        }
        return this.info.favoriteFlag;
    }

    private _getThumb(): string{
        if( this.info ){
            return this.info.thumb;
        }
        return "img/babytube/no_thumb.png";
    }

    private _onSelect(){
        this.$emit( 'onSelectVideo', this.info );
        //this.$nextTick( ()=>{ this.$forceUpdate() })

    }
    private _onToggleFavorite(){
        this.$emit( 'toggleFavorite', this.info );
    }
}
</script>

