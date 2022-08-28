import { Context } from 'koa'
import { User } from '../entity/user';
import { getConnection } from 'typeorm';

import { Comment } from '../entity/comment';
import { NotFoundException } from '../exceptions';
import { Photo } from '../entity/photo';

export default class PhotoController {
  public static async getPhotoComment(ctx: Context) {
    const comment = await getConnection().createQueryBuilder(Comment,"comment")
    .leftJoinAndMapOne("comment.user",User, "user", "user.uid = comment.uid")
    .leftJoinAndMapOne  ("comment.photo",Photo,"photo","photo.pid = comment.pid")
    .where("comment.pid = :id", { id: +ctx.query.pid })
    .getMany();
    if(comment){
      ctx.status = 200; 
      ctx.body = comment;
    }
    else {
      throw new NotFoundException();
    }

  }
  public static async addCommentById(ctx: Context) {
    console.log(ctx.request.body);

    
    const commentObj = new Comment();
    const { uid,pid,content} = ctx.request.body;

    const commentFlag = await getConnection().createQueryBuilder(Comment,"comment")
    .leftJoinAndMapOne("comment.user",User, "user", "user.uid = comment.uid")
    .leftJoinAndMapOne  ("comment.photo",Photo,"photo","photo.pid = comment.pid")
    .where("comment.pid = :id", { id: +pid })
    .getMany();
    if(commentFlag.length !== 0){
      ctx.body = '请不要重复评论';
      return 
    }
  
    commentObj.uid = uid;
    commentObj.pid = pid;
    commentObj.content = content;
    commentObj.pltime = new Date();
    commentObj.iscross = 1;

    const comment = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Comment)
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