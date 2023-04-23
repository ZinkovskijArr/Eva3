export interface IRexParcer {
    //удаление подстроки
    replaceSubStr(str:string,sub:string,replacement:string):string;
    //проверяет наличие регулярного выражения в строке
    matchRegEx(str: string | undefined,regexp:RegExp):boolean;
    //проверка на undefined
    isNotUndefined(str: string | undefined): boolean;
    getRegEx(str: string | undefined,regexp:RegExp):string;
}