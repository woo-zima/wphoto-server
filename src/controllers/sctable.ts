import { Context } from 'koa'
import { User } from '../entity/user';
import { getConnection } from 'typeorm';

import { Sctable } from '../entity/sctable';
import { NotFoundException } from '../exceptions';
import { Photo } from '../entity/photo';

export default class PhotoController {
  public static async getPhotoSC(ctx: Context) {
    const comment = await getConnection().createQueryBuilder(Sctable,"sctable")
    .leftJoinAndMapOne("sctable.user",User, "user", "user.uid = sctable.uid")
    .leftJoinAndMapOne  ("sctable.photo",Photo,"photo","photo.pid = sctable.pid")
    .where("sctable.pid = :pid and sctable.uid = :uid:", { pid: +ctx.query.pid,uid: + ctx.query.uid})
    .getMany();
    if(comment){
      ctx.status = 200; 
      ctx.body = comment;
    }
    else {
      throw new NotFoundException();
    }

  }
  public static async addPhotoSC(ctx: Context) {
    console.log(ctx.request.body);

    
    const newSctable = new Sctable();
    const { uid,pid} = ctx.request.body;

    const commentFlag = await getConnection().createQueryBuilder(Sctable,"sctable")
    .where("sctable.pid = :pid and sctable.uid = :uid:", { pid: +ctx.query.pid,uid: + ctx.query.uid})
    .getMany();
    if(commentFlag.length !== 0){
      ctx.body = '已收藏!';
      return 
    }
    newSctable.uid =uid;
    newSctable.pid =pid;
  

    const comment = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Sctable)
    .values(newSctable)
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