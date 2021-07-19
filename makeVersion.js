// import * as fs from 'fs'
const fs = require('fs');

const builder = "LSW"
fs.writeFileSync( "./src/version.ts", `
export const version = "${new Date().toString()}"

export function check(){
    window['aramversion'] = "[${builder}] "+version ;
}
`)