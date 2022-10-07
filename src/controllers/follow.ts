import { Context } from 'koa'
import { User } from '../entity/user';
import {getRepository, getConnection } from 'typeorm';

import { Follow } from '../entity/follow';
import { NotFoundException } from '../exceptions';

export default class FollowController {
  //获取关注信息
  public static async getFollowRelation(ctx: Context) {
    const followObj = await getConnection().createQueryBuilder(Follow,"follow")
    .leftJoinAndMapOne("follow.uMsg",User,"u","u.uid = follow.followuid")
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
    .leftJoinAndMapOne  ("follow.uMsg",User,"u","u.uid = follow.uid")
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

    if(uid == followuid){
      ctx.status = 200; 
      ctx.body = "不能关注自己哦QAQ";
      return
    }
    const followRepository = getConnection().getRepository(Follow);
    const follow = await followRepository.insert(followObj);
    if(follow){
      ctx.status = 200; 
      ctx.body = "关注成功QAQ";
    }
    else {
      throw new NotFoundException();
    }

  }
  //取消关注
  public static async deleteFollowRelation(ctx: Context) {
    const { gzid} = ctx.request.body;
     const delFol = await getRepository(Follow)
  .createQueryBuilder("follow")
  .where("follow.gzid = :uid", { uid: gzid })
  .delete()
  .execute();
  
    if(delFol.affected !== 0){
      ctx.status = 200; 
      ctx.body = "取关成功QAQ";
    }
    else {
      throw new NotFoundException();
    }

  }
  public static async deleteFollowRelationByIds(ctx: Context) {
    const { followId , followedId} = ctx.request.body;

     const delFol = await getRepository(Follow)
  .createQueryBuilder("follow")
  .where("follow.uid = :uid", { uid: followId })
  .andWhere("follow.followuid = :fuid",{fuid:followedId})  
  .delete()
  .execute();
  
    if(delFol.affected !== 0){
      ctx.status = 200; 
      ctx.body = "取关成功QAQ";
    }
    else {
      throw new NotFoundException();
    }

  }

}