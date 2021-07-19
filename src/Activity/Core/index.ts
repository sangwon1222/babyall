

export * from "./App";
export * from "./GameBase";
export * from "./SceneBase";

import * as Util from "./Util"; 
export { Util };


/*
declare global {
    interface String {
        testFuc(): string;
    }
}


String.prototype.testFuc = function (): string  {
    let result = "";
    for( const v of this){
        result += "#";
    }
    return result;
};

console.log( "aa".testFuc() );
*/