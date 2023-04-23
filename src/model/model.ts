/* eslint-disable prefer-const */
import { IRexParcer } from "./IRexParser";

class Model implements IRexParcer {

    public replaceSubStr(str: string, sub: string, replacement = ''): string {
        str = str.replace(sub, replacement);
        return str;
    }
    public matchRegEx(str: string | undefined, regexp: RegExp): boolean {
        if (!this.isNotUndefined(str)) {
            console.log('1 undefined')
            return false;
        }
        else if (str!.match(regexp) === null) {
            console.log('2 regex not fined')
            return false;
        }
        else
            return true;
    }
    public isNotUndefined = (str: number | string | undefined): boolean => {
        if (str === undefined)
            return false;
        else
            return true;
    }

    getRegEx(str: string | undefined, regexp: RegExp): string {
        let result = str!.match(regexp);
        if (result === null)
            return "error";
        else {
            return result[0];
        }
    }
}

export const regParse = new Model();
