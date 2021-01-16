/**
 * 个人哔哔云存储json
 * date: 2021.01.15 23:59
**/
'use strict';
const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV })
const db = app.database()
const path = require('path')
const fs = require('fs')

exports.main = async (event, context) => {
    const talksCollection = db.collection('talks')
    const CreateTime = Date.now()
    await talksCollection.where({}).orderBy("date", "desc").limit(9).get().then((res) => {
        let dataJson = {code: 0,data: [],msg: `成功`}
        for(var i=0;i<res.data.length;i++){
            var obj = {
                date: res.data[i].date,
                content: res.data[i].content,
                from: res.data[i].from
            };
            dataJson.data.push(obj);
        }
        let contentJson = JSON.stringify(dataJson,null,'\t')
        console.log(contentJson)
        let ws = fs.createWriteStream('/tmp/bber'+CreateTime+'.json', { autoClose: true });
        ws.write(contentJson, 'utf8')
        app.uploadFile({
            cloudPath: 'json/bber.json',
            fileContent: fs.createReadStream('/tmp/bber'+CreateTime+'.json')
        }).then((res) => {
            ws.on('finish', function () {
                console.log('ok')
            });
        })
    }) 
}