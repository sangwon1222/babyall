import { App } from '../../../Core'
import { GameTypeBase ,QuizBox, StickBox } from './'
import { QuizDataType1 } from '../Define';
import gsap from 'gsap';
import { WordBlockSprite, WordEditSprite } from './MarkerData';
import Util from '@/Util';
import Axios from 'axios';
import { Activity } from '../../block/Scene';

export class GameType1 extends GameTypeBase {
    private mMarkerSprite: WordBlockSprite
    private mInfo: QuizDataType1;
    private mData: any;

    constructor( info: QuizDataType1 , UpOrLow: string){
        super(`Type1`);
        
        this.mInfo = info;
        this.mData = [];
        this.readyResource(UpOrLow);
    }
        

    async readyResource(UpOrLow: string){
        let symbol = App.Handle.appData.symbol;
        let caseFlag = (symbol == symbol.toUpperCase())?1:2;

        if(UpOrLow == 'upper'){
            caseFlag =1;
            symbol = App.Handle.appData.symbol.toUpperCase();
        }else if (UpOrLow == 'lower'){
            caseFlag =2;
            symbol = App.Handle.appData.symbol.toLowerCase();
        }else{
            UpOrLow = 'upper'
            caseFlag =1;
            symbol = App.Handle.appData.symbol.toUpperCase();
        }
        

        const rscProduct =[]
        const sliceNameList = [];
        if( caseFlag == 1 ){
            const info = this.mInfo;
            rscProduct.push( info.guide );
            for( const v of info.correct){
                rscProduct.push( v );                
            }

            for( const v of info.lines){
                sliceNameList.push( v.replace("line_","") )
            }
        }else{
            const info = this.mInfo;
            rscProduct.push( info.guide );
            for( const v of info.correct){
                rscProduct.push( v );                
            }
            for( const v of info.lines){
                sliceNameList.push( v.replace("line_","") )
            }
        }
        const texSlice = [];
        for( let i=0; i< sliceNameList.length; i++ ){
            texSlice.push(App.Handle.currentGame.getProductResource(sliceNameList[i]).texture )
        }
        
        this.mMarkerSprite = new WordBlockSprite(
            App.Handle.currentGame.getResource("marker_2.png").texture,
            App.Handle.currentGame.getResource("marker_1.png").texture,
            App.Handle.currentGame.getProductResource(`ab_line_${symbol.toLowerCase()}_${caseFlag}.png`).texture,
            App.Handle.currentGame.getProductResource(`ab_${symbol.toLowerCase()}_${caseFlag}.png`).texture,            
            texSlice
        );

        const w = App.Handle.currentGame.getProductResource(`ab_line_${symbol.toLowerCase()}_${caseFlag}.png`).texture.width/2;
        const h = App.Handle.currentGame.getProductResource(`ab_line_${symbol.toLowerCase()}_${caseFlag}.png`).texture.height/2;
        this.mMarkerSprite.position.set(672.5-w,313.5-h);

        this.addChild(this.mMarkerSprite);
        
        const response = await Axios.get( `${Util.Config.restAPIProd}/learning/alphabet/block/${symbol.toUpperCase()}` );
        
        // console.error(response.data)

        if(caseFlag==1){
            this.mData = response.data.infolist.upperCase;
        }else if(caseFlag==2){
            this.mData = response.data.infolist.lowerCase;
        }
        // console.error(this.mData)
        this.mMarkerSprite.loadData(this.mData)

        this.mMarkerSprite.on( WordBlockSprite.EVT_LineComplete, (param)=>  {
            const lineCompleteSound = App.Handle.currentGame.getResource(`ab_sfx_4.mp3`).sound;
            const nextLineSound = App.Handle.currentGame.getResource(`ab_sfx_6.mp3`).sound;
            
            lineCompleteSound.play();
            gsap.delayedCall(lineCompleteSound.duration,()=>{  nextLineSound.play();  })
        })
        this.mMarkerSprite.on( WordBlockSprite.EVT_WordComplete, ()=>{
            console.log('WORD complete');
            const symbol = App.Handle.appData.symbol.toLowerCase();
            const wordSound = App.Handle.currentGame.getProductResource(`${symbol.toLowerCase()}.mp3`).sound;
            wordSound.play();
            gsap.delayedCall(wordSound.duration,()=>{
                const nextPageSound = App.Handle.currentGame.getResource(`ab_sfx_3.mp3`).sound;
                nextPageSound.play();
                Activity._handle.NextType();
            })
        })
        this.mMarkerSprite.on( WordBlockSprite.EVT_WrongSelect, ()=>{
            const wrongSound = App.Handle.currentGame.getResource(`ab_sfx_2.mp3`).sound;
            wrongSound.play();
        })
    }   
}