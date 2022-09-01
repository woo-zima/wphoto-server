import { Context } from 'koa';
import * as argon2 from 'argon2';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';

import { User } from '../entity/user';
import { JWT_SECRET } from '../constants';
import { UnauthorizedException } from '../exceptions';
const koaSession:any = require('koa-session');

export default class AuthController {
  public static async login(ctx: Context) {
    const {  verifyCode = '' } = ctx.request.body;
    const userRepository = getManager().getRepository(User);

    const user = await userRepository
      .createQueryBuilder()
      .where({ uname: ctx.request.body.username })
      .addSelect('User.password')
      .getOne();

    if(verifyCode !== ''){
      if(verifyCode.toLowerCase() === koaSession.captchaCode){
        if (!user) {
          throw new UnauthorizedException('用户名不存在');
        } else if (await argon2.verify(user.password, ctx.request.body.password)) {
          Reflect.deleteProperty(user,'password')
          ctx.status = 200;
          ctx.body = { 
            token: jwt.sign({ id: user.uid }, JWT_SECRET),
            userInfo:user,
            msg:'登录成功'
          };
        } else {
          throw new UnauthorizedException('密码错误');
        }
      }
      else{
        ctx.body = { msg: '验证码错误' }
      }
    }
    else{
      ctx.body = { msg: '请输入验证码' }
    } 
  }

  public static async register(ctx: Context) {
    const {  verifyCode = '' } = ctx.request.body;
    const userRepository = getManager().getRepository(User);

    if(verifyCode !== ''){
      if(verifyCode.toLowerCase() === koaSession.captchaCode){
        const newUser = new User();
        newUser.uname = ctx.request.body.username;
        newUser.password = await argon2.hash(ctx.request.body.password);
        newUser.createtime = new Date()
        const user = await userRepository.save(newUser);
        // 保存到数据库
        if(user){
          ctx.status = 200;
          ctx.body = {
            userInfo:user,
            msg:'注册成功,请登录'
          };
        }else{
          ctx.status = 500;
          ctx.body = '服务器错误';
        }
      }else{
        ctx.body = { msg: '验证码错误' }
      }
    } else{
      ctx.body = { msg: '请输入验证码' }
    } 

  }
}
