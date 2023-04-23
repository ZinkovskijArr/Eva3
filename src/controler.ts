/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const { GoogleSpreadsheet } = require('google-spreadsheet');
import { regParse } from './model/model';

require('dotenv').config();


const serviceEmail = process.env.SERVICE_EMAIL;
const serviceKey = process.env.SERVICE_KEY;
const regExType: RegExp = /доп|отработка|отработал/;
const regExSince: RegExp = /\b\d\d:\d\d\b|\b\d:\d\d\b/;//(d{2}):(d{2})/;
const regExDay: RegExp = /\b\d\d.\d\d|\b\d.\d\d/;

let data = {
    date: '',
    ldap: '',
    time_since: '',
    time_to: '',
    type: '',
    for_date: ''
};

const doc = new GoogleSpreadsheet('1YUs8Ye_8jTbEYeO_HoDvKuOPmqFCTacawNTb9SAVFx0');

const start = async (msg: any): Promise<void> => {
    let str:string = msg.text!;
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


    data.ldap = msg.from.username;

    data.type = regParse.getRegEx(str, regExType);
    // ищет регулярное выражение в сообжении
    if (regParse.matchRegEx(str, regExSince)) {
        data.time_since = regParse.getRegEx(str, regExSince);
        str = regParse.replaceSubStr(str, data.time_since);

        data.time_to = regParse.getRegEx(str, regExSince);
        str = regParse.replaceSubStr(str, data.time_to);

        let dataTime = new Date();
        let day = dataTime.getMonth()
        let currentData = `${dataTime.getDate()}.${day < 10 ? '0' + day : day}.${dataTime.getFullYear()}`;
        data.date = currentData;
        //проверяет отработка или допка
        if (data.type !== 'доп') {
            let res;
            data.type = 'отработка';
            res = regParse.getRegEx(str, regExDay);
            data.for_date = res.length == 1 ? '0' + res : res;
        }
        //добавление собраные данные в гугл таблицу
        await sheet.addRow(data);
        //const rows = await sheet.getRows();
        data.for_date = '';
    }
    else console.log('Not found rexex');
    const rows = await sheet.getRows(); // can pass in { limit, offset }

// read/write row values
    console.log(rows.length);
    //console.log(sheet.getSheet());
    //console.log(cel);
    //console.log(await sheet.values.get('1YUs8Ye_8jTbEYeO_HoDvKuOPmqFCTacawNTb9SAVFx0','A1:C3'));
}




export const newMessage = (msg: any): void => {
    start(msg);
}