import { Context } from 'koa'
import svgCapTcha from 'svg-captcha';
const koaSession:any = require('koa-session');

export default class captchaController{
    public static async getCaptcha(ctx: Context) {
        let captcha = svgCapTcha.create({
            size: 4,
            ignoreChars: '0o1i',
            noise: 6,
            color: true,
            background: 'white',
          })
              
          koaSession.captchaCode = String(captcha.text).toLocaleLowerCase()
          ctx.response.type = 'image/svg+xml';
          ctx.body = captcha.data;
        }

}