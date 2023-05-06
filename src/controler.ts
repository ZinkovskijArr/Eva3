/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const { GoogleSpreadsheet } = require('google-spreadsheet');
import { regParse } from './model/model';
import { Shifts } from './model/ShiftsType';

require('dotenv').config();


const serviceEmail = process.env.SERVICE_EMAIL;
const serviceKey = process.env.SERVICE_KEY;
const regExType: RegExp = /доп|отработка|отработал/;
const regExSince: RegExp = /\b\d\d:\d\d\b|\b\d:\d\d\b/;//(d{2}):(d{2})/;
const regExDay: RegExp = /\b\d\d.\d\d|\b\d.\d\d/;


const doc = new GoogleSpreadsheet('1YUs8Ye_8jTbEYeO_HoDvKuOPmqFCTacawNTb9SAVFx0');//в аргументах ИД документа

const start = async (msg: any): Promise<void> => {

    if (msg === undefined) throw console.log('msg from user in undefined!')
    let str: string = msg.text!;
    str = str.toLowerCase();

    try {
        await doc.useServiceAccountAuth({ client_email: serviceEmail, private_key: serviceKey?.replace(/\\n/g, '\n') });
        console.log('auth okey');
    }
    catch (e) {
        console.error(`Error with auth : ${e}`);
    }
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[0];

    // ищет регулярное выражение в сообжении
    if (regParse.matchRegEx(str, regExType)) {
        //добавление собраные данные в гугл таблицу
        let data: Shifts[] = collectData(msg)
        for (let item of data) {
            await sheet.addRow(item);
        }
    }
    else console.log('Not found regex');
}


const collectData = (msg: any): Shifts[] => {
    let data: Shifts[] = [];
    let date: string, ldap: string, time_since: string, time_to: string, type: string, for_date: string;
    let str: string = msg.text!;
    str = str.toLowerCase();

    type = regParse.getRegEx(str, regExType);
    console.log(msg.from.id);
    console.log(msg.from.username);

    ldap = msg.from.username;

    do {
        time_since = regParse.getRegEx(str, regExSince);
        str = regParse.replaceSubStr(str, time_since);

        time_to = regParse.getRegEx(str, regExSince);
        str = regParse.replaceSubStr(str, time_to);

        let dataTime = new Date();
        let day = dataTime.getMonth()
        let currentData = `${dataTime.getDate()}.${day < 10 ? '0' + day : day}.${dataTime.getFullYear()}`;
        date = currentData;
        //проверяет отработка или допка(доп смены отсутствует поле "за какую дату")
        if (type !== 'доп') {
            let res;
            type = 'отработка';
            res = regParse.getRegEx(str, regExDay);
            str = regParse.replaceSubStr(str, res);
            for_date = res.length == 1 ? '0' + res : res;
        }
        else for_date = '';
        data.push({ ldap, date, time_since, time_to, type, for_date });
    } while (regParse.matchRegEx(str, regExSince))
    return data;
}


export const newMessage = (msg: any): void => {
    start(msg);
}