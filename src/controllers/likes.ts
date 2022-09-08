import { Context } from 'koa'
import { User } from '../entity/user';
import { Photo } from "../entity/photo";
import {getRepository, getConnection } from 'typeorm';

import { Likes } from '../entity/likes';
import { NotFoundException } from '../exceptions';

export default class LikeController {
  //获取喜欢信息
  public static async getLikesByUid(ctx: Context) {
    console.log(ctx.query.uid);
    
    const likeObj = await getConnection().createQueryBuilder(Likes,"like")
    .leftJoinAndMapOne("like.photoMsg",Photo,"photo","photo.pid = like.pid")
    .where("like.uid = :id", { id: +ctx.query.uid })
    .getMany();
    if(likeObj){
      ctx.status = 200; 
      ctx.body = likeObj;
    }
    else {
      throw new NotFoundException();
    }
  }

}