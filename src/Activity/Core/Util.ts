

export function genColorMap(baseTex: any) {
    if (!baseTex.resource) {
        //renderTexture
        return false;
    }
    const imgSource = baseTex.resource.source;
    let canvas = null;
    if (!imgSource) {
        return false;
    }
    let context = null;
    if (imgSource.getContext) {
        canvas = imgSource;
        context = canvas.getContext('2d');
    } else if (imgSource instanceof Image) {
        canvas = document.createElement('canvas');
        canvas.width = imgSource.width;
        canvas.height = imgSource.height;
        context = canvas.getContext('2d');
        context.drawImage(imgSource, 0, 0);
    } else {
        //unknown source;
        return false;
    }
 
    const w = canvas.width, h = canvas.height;
    baseTex.colormap = context.getImageData(0, 0, w, h);
    return true;
}

export function getColorByPoint(spr: PIXI.Sprite, globalPoint: PIXI.Point) {
    const tempPoint = new PIXI.Point();
    spr.worldTransform.applyInverse(globalPoint, tempPoint);

    const width = spr.texture.orig.width;
    const height = spr.texture.orig.height;
    const x1 = -width * spr.anchor.x;
    let y1 = 0;

    let flag = false;

    if (tempPoint.x >= x1 && tempPoint.x < x1 + width)
    {
        y1 = -height * spr.anchor.y;
 
        if (tempPoint.y >= y1 && tempPoint.y < y1 + height)
        {
            flag = true;
        }
    }

    if (!flag) {
        return {r:0, g:0, b:0, a:0};
    }

    const tex = spr.texture;
    const baseTex: any = spr.texture.baseTexture;
    if (!baseTex.colormap) {
        if (!genColorMap(baseTex)) {
            return {r:0, g:0, b:0, a:0};
        }
    }

    const colormap = baseTex.colormap;
    const data = colormap.data;
    const res = baseTex.resolution;
    // this does not account for rotation yet!!!

    const dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res);
    const dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res);
    const num = dx  + dy * colormap.width;

    // console.log("tempPoint:", tempPoint, "tex.frame:", tex.frame, "res:", res, "num:", num, "colormap.width:", colormap.width);
    return {r:data[num*4], g:data[num*4 + 1], b:data[num*4 + 2], a:data[num*4 + 3]};
}

export interface Rect{
    x: number; 
    y: number; 
    w: number; 
    h: number;
}
export function getCropSize(spr: PIXI.Sprite): Rect {
    const result = { x:0, y:0, w:0, h:0 };
    
    const tex = spr.texture;
    const baseTex: any = spr.texture.baseTexture;
    if ( baseTex.colormap === undefined ) {
        genColorMap(baseTex);
    }
    // console.log( "colorMap", baseTex.colormap, baseTex.colormap.width, baseTex.colormap.height );
    let pixelIDX = 0;
    let minX = baseTex.colormap.width;
    let maxX = -1;
    let minY = baseTex.colormap.height;
    let maxY = 0;
    for( let y=0; y<baseTex.colormap.height; y++ ){
        pixelIDX = baseTex.colormap.width * y;
        for( let x=0; x<baseTex.colormap.width; x++ ){
            const offset = pixelIDX + x ;
            const v = offset * 4;
            const r = baseTex.colormap.data[ v + 0 ];
            const g = baseTex.colormap.data[ v + 1 ];
            const b = baseTex.colormap.data[ v + 2 ];
            const a = baseTex.colormap.data[ v + 3 ];
            if( a > 50 ){
                if( minX>x)  minX = x;
                if( minY>y)  minY = y;
                if( maxX<x)  maxX = x;
                if( maxY<y)  maxY = y;
                //console.log( x,y, v, r,g,b,a);
            }
        }   
    }
    result.x = minX;
    result.y = minY;
    result.w = maxX- minX +1;
    result.h = maxY- minY +1;
    return result;
}

export function shuffleArray(a: any) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
