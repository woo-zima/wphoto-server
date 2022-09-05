import { Context } from 'koa'
import { User } from '../entity/user';
import {getRepository, getConnection } from 'typeorm';

import { Follow } from '../entity/follow';
import { NotFoundException } from '../exceptions';

export default class FollowController {
  //获取关注信息
  public static async getFollowRelation(ctx: Context) {
    const followObj = await getConnection().createQueryBuilder(Follow,"follow")
    .leftJoinAndMapOne("follow.followuid",User,"u","u.uid = follow.followuid")
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
   //获取粉丝信息
  public static async getFansRelation(ctx: Context) {
    const followObj = await getConnection().createQueryBuilder(Follow,"follow")
    .leftJoinAndMapOne  ("follow.uid",User,"u","u.uid = follow.uid")
    .where("follow.followuid = :id", { id: +ctx.query.uid })
    .getMany();
    if(followObj){
      ctx.status = 200; 
      ctx.body = followObj;
    }
    else {
      throw new NotFoundException();
    }

  }
  //增加关注
  public static async addFollowRelation(ctx: Context) {
    console.log(ctx.request.body);

    const followObj = new Follow();
    const { uid,followuid} = ctx.request.body;

    followObj.uid = uid;
    followObj.followuid = followuid;
    followObj.followtime = new Date();

    const followRepository = getConnection().getRepository(Follow);
    const follow = await followRepository.insert(followObj);

    if(follow){
      ctx.status = 200; 
      ctx.body = "success";
    }
    else {
      throw new NotFoundException();
    }

  }
  //取消关注
  public static async deleteFollowRelation(ctx: Context) {
    console.log(ctx.request.body);

    const { uid,followuid} = ctx.request.body;

     const delFol = await getRepository(Follow)
  .createQueryBuilder("follow")
  .where("follow.uid = :uid", { uid: uid })
  .andWhere("follow.followuid = :fid", { fid: followuid })
  .delete()
  .execute();
  
    if(delFol.affected !== 0){
      ctx.status = 200; 
      ctx.body = "delete success";
    }
    else {
      throw new NotFoundException();
    }

  }


}