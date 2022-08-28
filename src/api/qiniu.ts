import { Context } from "koa";
let qiniu = require('qiniu');

let config = {
    "AK":"MRX2I36Tu2Vvn9TIzjG1Yz9WRyYXo-8zJc1-TtgG",
    "SK":"4TGIWum8ASAp7iviDIODKbuW4ugWfVWe7EzuKuDE",
    "Bucket":"w-photo"
}

export default function getToken(ctx: Context){
    let mac = new qiniu.auth.digest.Mac(config.AK, config.SK);
    let code = '1',msg = '', data:{ [k: string]: any} = {};
    let options = {
        scope: config.Bucket,
        expires: 3600 * 24
    };
    let putPolicy =  new qiniu.rs.PutPolicy(options);
    let uploadToken= putPolicy.uploadToken(mac);
    if (uploadToken) {
        code = '0';
        data.uploadToken = uploadToken;
        ctx.body = {code, data, msg:'success'}
    } else {
        ctx.body = {code, data, msg:'error'}
    }
}
