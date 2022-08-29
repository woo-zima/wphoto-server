import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-body';
import { createConnection } from 'typeorm';
import jwt from 'koa-jwt';
import 'reflect-metadata';
import svgCapTcha from 'svg-captcha';
import session from 'koa-session';


import { protectedRouter, unprotectedRouter } from './routes';
import { logger } from './logger';
import { JWT_SECRET } from './constants';

createConnection()
  .then(() => {
    // 初始化 Koa 应用实例
    const app = new Koa();
    //设置session
    app.keys = ['wphot'];
    const config = {
    key: "koa.photo",
    //有效期
    maxAge: 1000 * 60 * 20,
    //刷新之后刷新 maxAge
    rolling: true,
    renew: true
    }
    app.use(session(config, app))
    // 注册中间件
    app.use(logger());
    app.use(cors());
    app.use(bodyParser({
      multipart: true 
    }));

    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        // 只返回 JSON 格式的响应
        ctx.status = err.status || 500;
        ctx.body = { message: err.message };
      }
    });

    // 无需 JWT Token 即可访问
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // 注册 JWT 中间件
    app.use(jwt({ secret: JWT_SECRET }).unless({ method: 'GET' }));

    // 需要 JWT Token 才可访问
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // 运行服务器
    app.listen(3001);
  })
  .catch((err: string) => console.log('TypeORM connection error:', err));
