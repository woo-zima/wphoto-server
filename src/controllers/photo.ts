import { Context } from 'koa'
import { User } from '../entity/user';
import { getManager,getRepository,getConnection  } from 'typeorm';

import { Photo } from '../entity/photo';
import { NotFoundException, ForbiddenException } from '../exceptions';

export default class PhotoController {
  public static async listPhotos(ctx: Context) {
    const { startIndex,pageSize } = ctx.request.body;
    const photoRepository =  getRepository(Photo)
    .createQueryBuilder('photo');
    let users;
    if(+startIndex == 1){
       users = await photoRepository
    .take(+startIndex * 16).getMany();

    }
    else{
     users = await photoRepository
    .skip((+startIndex - 1) * +pageSize)
    .take(+startIndex * +pageSize).getMany();
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
  .getMany();

    if (photoKey) {
      ctx.status = 200;
      ctx.body = photoKey;
    } else {
      ctx.status = 404;
    }
  }

//   public static async deleteUser(ctx: Context) {
//     const userId = +ctx.params.id;

//     if (userId !== +ctx.state.user.id) {
//       throw new ForbiddenException();
//     }

//     const userRepository = getManager().getRepository(Photo);
//     await userRepository.delete(userId);

//     ctx.status = 204;
//     ctx.body = '删除成功'
//   }
}
