import { Context } from 'koa'
import { User } from '../entity/user';
import { getConnection } from 'typeorm';

import { Follow } from '../entity/follow';
import { NotFoundException } from '../exceptions';

export default class FollowController {
  public static async getFollowRelation(ctx: Context) {
    const followObj = await getConnection().createQueryBuilder(Follow,"follow")
    .leftJoinAndMapOne("follow.uid",User, "user", "user.uid = follow.uid")
    .leftJoinAndMapOne  ("follow.followuid",User,"u","u.uid = follow.followuid")
    .where("follow.uid = :id", { id: +ctx.query.uid })
    .getMany();
    if(followObj){
      ctx.status = 200; 
      ctx.body = followObj;
    }
    else {
      throw new NotFoundException();
    }

  }
  public static async addFollowRelation(ctx: Context) {
    console.log(ctx.request.body);

    
    const commentObj = new Follow();
    const { uid,pid,content} = ctx.request.body;

    const commentFlag = await getConnection().createQueryBuilder(Follow,"comment")
    .leftJoinAndMapOne("comment.user",User, "user", "user.uid = comment.uid")
    .leftJoinAndMapOne  ("comment.photo",Follow,"photo","photo.pid = comment.pid")
    .where("comment.pid = :id", { id: +pid })
    .getMany();
    if(commentFlag.length !== 0){
      ctx.body = '请不要重复评论';
      return 
    }
    const comment = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Follow)
    .values(commentObj)
    .execute();

    if(comment){
      ctx.status = 200; 
      ctx.body = "success";
    }
    else {
      throw new NotFoundException();
    }

  }


}