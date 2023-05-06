/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("node:fs");

export const writeToFile = (arr: any[]): void => {
    try {
        fs.writeFile('out.json', JSON.stringify(arr),(e: any)=>{
            console.error(`can't write ${e}`);
        });
    }
    catch(e){
        console.error(`Sone error with file ${e}`);
    }
}