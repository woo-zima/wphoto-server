import { Context } from 'koa'
import { User } from '../entity/user';
import { Photo } from "../entity/photo";
import {getRepository, getConnection, Like } from 'typeorm';

import { Likes } from '../entity/likes';
import { NotFoundException } from '../exceptions';

export default class LikeController {
  //获取喜欢页数据
  public static async getLikesByUid(ctx: Context) {
    const { pageNum,pageSize} = ctx.query;
    const photoRepository = getConnection().createQueryBuilder(Likes,"like")

    let likeObj;
    if(+pageNum == 1){
      likeObj = await photoRepository.leftJoinAndMapOne("like.photoMsg",Photo,"photo","photo.pid = like.pid")
      .where("like.uid = :id", { id: +ctx.query.uid })
      .take(+pageNum * 16)
      .orderBy("like.likeid", "DESC")
      .getMany();
    }else{
      likeObj = await photoRepository.leftJoinAndMapOne("like.photoMsg",Photo,"photo","photo.pid = like.pid")
      .where("like.uid = :id", { id: +ctx.query.uid })
      .skip((+pageNum - 1) * +pageSize)
      .take(+pageNum * +pageSize)
      .orderBy("like.likeid", "DESC")
      .getMany();
    }
    
    if(likeObj){
      ctx.status = 200; 
      ctx.body = likeObj;
    }
    else {
      ctx.body = 'find';
    }
  }
  //添加like
  public static async addLike(ctx:Context){
    const {uid,pid} = ctx.request.body;
    const getLikeByidObj = await getConnection().createQueryBuilder(Likes,"like")
    .where("like.uid = :uid",{uid:uid})
    .andWhere("like.pid = :pid",{pid:pid})
    .getOne()
    if(getLikeByidObj) {
      ctx.status = 204
      return
    }
    
    const addLikeObj = new Likes()
    addLikeObj.uid = uid;
    addLikeObj.pid = pid;
    addLikeObj.liketime = new Date()
    const addObj = await getConnection().createQueryBuilder(Likes,"like")
    .insert()
    .values(addLikeObj)
    .execute();
    if(addObj){
      ctx.status = 200,
      ctx.body = addObj
    }else {
      ctx.status = 204;
    }

    
  }
  //取消like
  public static async cancelLike(ctx:Context){
    const queryLike = await getConnection().createQueryBuilder(Likes,"like")
    .where("like.likeid = :id", { id: +ctx.request.body.likeid })
    .getOne()

    if(!queryLike){
      console.log("e");
      ctx.status = 204
      return
    }

    const cancelObj = await getConnection().createQueryBuilder()
    .delete()
    .from(Likes)
    .where("likeid = :likeid", { likeid: +ctx.request.body.likeid })
    .execute()

    if(cancelObj.affected){
      ctx.status = 200
      ctx.body = cancelObj
    }
    else {
      ctx.status = 204;
    }
  }

  public static async getLikeByid(ctx: Context){
    console.log(ctx.query);
    
    const getLikeByidObj = await getConnection().createQueryBuilder(Likes,"like")
    .where("like.uid = :uid",{uid:ctx.query.uid})
    .andWhere("like.pid = :pid",{pid:ctx.query.pid})
    .getOne()
    if(getLikeByidObj){
      ctx.status = 200,
      ctx.body = getLikeByidObj
    }else {
      ctx.status = 204;
    }
  }


}