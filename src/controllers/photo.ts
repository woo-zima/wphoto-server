import { Context } from 'koa'
import { User } from '../entity/user';
import { getManager,getRepository,getConnection  } from 'typeorm';

import { Photo } from '../entity/photo';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Likes } from '../entity/likes';

export default class PhotoController {
  public static async listPhotos(ctx: Context) {
    const { startIndex,pageSize } = ctx.request.body;
    const photoRepository =  getRepository(Photo)
    .createQueryBuilder('photo');
    let users;
    if(+startIndex == 1){
       users = await photoRepository
    .take(+startIndex * 16)
    .orderBy("photo.pid", "DESC")
    .getMany();
    }
    else{
     users = await photoRepository
    .skip((+startIndex - 1) * +pageSize)
    .take(+startIndex * +pageSize)
    .orderBy("photo.pid", "DESC")
    .getMany();
    }
    if(users){
      ctx.status = 200; 
      ctx.body = users;
    }
    else {
      throw new NotFoundException();
    }

  }

  public static async showPhotoDetail(ctx: Context) {
    const photo =  await getConnection().createQueryBuilder(Photo,"photo")
    .leftJoinAndMapOne("photo.user",User, "user", "user.uid = photo.upid")
    .leftJoinAndMapMany("photo.likes",Likes,"likes","likes.pid = photo.pid")
    .where("photo.pid = :id", { id: +ctx.query.pid })
    .getOne();

    if (photo) {
      ctx.status = 200;
      ctx.body = photo;
    } else {
      throw new NotFoundException();
    }
  }

  public static async addPhoto(ctx: Context) {
    // console.log(ctx.request.body);
    const rep = new Photo();
    const { upid,psize,pname,pdescribe,pwidth,uptime,pheight,purl} = ctx.request.body
    rep.upid  = upid;
    rep.psize = psize;
    rep.pname = pname;
    rep.pdescribe = pdescribe;
    rep.pwidth = pwidth;
    rep.pheight = pheight;
    rep.uptime = uptime;
    rep.purl = purl;
    
    // const { name: string, path: filePath, size, type } = ctx.request;
    const photoRepository = getManager().getRepository(Photo);
    const photo = await photoRepository.insert(rep);

    if (photo) {
      ctx.status = 200;
      ctx.body = photo;
    } else {
      throw new NotFoundException();
    }
  }

  public static async getKeyWorlds(ctx: Context) {
    const queryvalue = ctx.query.queryValue;
    console.log(queryvalue  );
    
    const photoKey = await getRepository(Photo)
  .createQueryBuilder("photo")
  .select(["photo.pdescribe"])
  .where('photo.pdescribe LIKE "'+queryvalue+'%"')
  .getOne()

    if (photoKey) {
      ctx.status = 200;
      ctx.body = photoKey;
    } else {
      ctx.status = 404;
    }
  }

  public static async getKeyPhotos(ctx: Context) {
    const { pageNum,pageSize,queryValue} = ctx.query;

    const photoKRepository = await getRepository(Photo).createQueryBuilder("photo")
    let photoK;
    if(+pageNum == 1){
      photoK = await photoKRepository.select(["photo"])
      .where('photo.pdescribe LIKE "'+queryValue+'%"')
      .take(+pageNum * 16)
      .getMany()
   }else{
    photoK = await photoKRepository.select(["photo"])
      .where('photo.pdescribe LIKE "'+queryValue+'%"')
      .skip((+pageNum - 1) * +pageSize)
      .take(+pageNum * +pageSize)
      .getMany()
   }
    if (photoK) {
      ctx.status = 200;
      ctx.body = photoK;
    } else {
      ctx.status = 404;
    }
  }
  
  public static async getUpPhotos(ctx: Context) {
    const selectvalue = ctx.query.upid;
    const photoK = await getRepository(Photo)
  .createQueryBuilder("photo")
  .select(["photo"])
  .where('photo.upid = :upid',{upid:selectvalue})
  .orderBy("photo.pid", "DESC")
  .getMany()

    if (photoK) {
      ctx.status = 200;
      ctx.body = photoK;
    } else {
      ctx.status = 404;
    }
  }

}
