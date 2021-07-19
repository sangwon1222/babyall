<template>
    <div class="TubeListItem" @click="_onSelect">
        <div class="case">
                <img ref="thumb" class="thumb" :src="this._getThumb()" />
                <div class="contents">
                    <div class="subject" >{{info.subject}}</div>
                    <div class="bottom">
                        <span >{{movieLength.slice(0,5)}}</span>
                        <img @click.stop="_onToggleFavorite" class="favorite" :src="this._getFavoriteFlag()===true?'img/babytube/favorite_on.png':'img/babytube/favorite_off.png'" />
                    </div>
                </div>
                <img v-show="selected" class="list_select" src="img/babytube/list_select.png" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.TubeListItem{
    cursor:pointer;
    margin:20px;
    width: 100%;
    max-width: 600px;
    background-color: #f8f8f8;
    display:flex;
    flex-direction: column;
    flex-wrap:wrap;
    margin-bottom: 20px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    box-sizing:border-box;

    .case{
        position:relative;
        display:flex;
        flex-wrap:wrap;
        flex-direction: column;
        height:200px;
        .thumb{
            height:100%;
        }
        .contents{
            // border:1px solid #F00;
            display:flex;
            flex-direction: column;
            margin-left:1rem;
            height:100%;
            width:100%;
            max-width:320px;
            .subject{
                margin: 0.3rem 0;
                font-family: "BPreplay-bold";
                font-size: 1rem;
                font-weight: 800;
                color: #b37cd9;
                flex: 1;
            }
            .bottom{
                position:absolute;
                bottom:0px;
                width:100%;
                max-width:300px;
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
                    text-align: center;
                }
            }
            .favorite {
                cursor: pointer;
                margin:0.5rem;
                float:right;
                // z-index: 100;
                border-radius: 100px;
            }
        }
    }
    .list_select{
        position:absolute;
        transform: translate(-50%,-50%);
        width:100%;
        height:100%;
        top:50%;
        left:50%;
    }
}
// .TubeListItem:last-child{
//     .bridge{
//         display:none;
//     }
// }
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import gsap from "gsap";


@Component({
    components:{
    }
})
export default class TubeListItem extends Vue {
    @Prop({required: true}) private info!: any;
    @Prop({required: true}) private idx!: number;
    
    get selected(): boolean{
        // 선택될때 자신의 위치를 리스트 최상단으로 스크롤한다.
        
        if( this.info.selected ){
            const self: HTMLDivElement = (this.$el as HTMLDivElement);
            if( self !== undefined){
                console.log(self.parentElement)
                console.log(self.parentElement.scrollTop)
                gsap.to( (self.parentElement as HTMLDivElement), {
                    scrollTop: -this.idx*200,
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
        //
    }

    private _getFavoriteFlag(): boolean{
        if( this.info == null ){
            return false;
        }
        return this.info.favoriteFlag;
    }

    private _getThumb(): string{
        if( this.info ){
            // console.log( this.info.thumb );
            return this.info.thumb;
        }
        return "img/babytube/no_thumb.png";
    }

    private _onSelect(){
        this.$emit( 'onSelectVideo', this.info , this.idx);
        //this.$nextTick( ()=>{ this.$forceUpdate() })

    }
    private _onToggleFavorite(){
        this.$emit( 'toggleFavorite', this.info , this.idx );
    }
}
</script>

