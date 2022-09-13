import Router from '@koa/router';

import AuthController from './controllers/auth';
import PhotoController from './controllers/photo';
import CommentController from './controllers/comment'
import UserController from './controllers/user';
import FollowController from './controllers/follow'
import getToken from './api/qiniu'
import captchaController from './controllers/captcha';
import LikeController from './controllers/likes';

const unprotectedRouter = new Router();

// auth 相关的路由
unprotectedRouter.post('/auth/login', AuthController.login);
unprotectedRouter.post('/auth/register', AuthController.register);
//qiniu
unprotectedRouter.get('/getToken',getToken);
//photo
unprotectedRouter.post('/photo/getPhotoList',PhotoController.listPhotos);
unprotectedRouter.post('/photo/addPhoto',PhotoController.addPhoto);
unprotectedRouter.get('/photo/getKeyWorlds',PhotoController.getKeyWorlds);
unprotectedRouter.get('/photo/getKeyPhotos',PhotoController.getKeyPhotos);
unprotectedRouter.get('/photo/getUpPhotos',PhotoController.getUpPhotos);
unprotectedRouter.get('/photo/showPhotoDetail',PhotoController.showPhotoDetail);
//关注
unprotectedRouter.get('/follow/getFollowRelation',FollowController.getFollowRelation);
unprotectedRouter.get('/follow/getFansRelation',FollowController.getFansRelation);
unprotectedRouter.post('/follow/addFollowRelation',FollowController.addFollowRelation);
unprotectedRouter.post('/follow/deleteFollowRelation',FollowController.deleteFollowRelation)
//like
unprotectedRouter.get('/like/getLikesByUid',LikeController.getLikesByUid)
unprotectedRouter.post('/like/addLikeById',LikeController.addLike)
unprotectedRouter.post('/like/cancelLike',LikeController.cancelLike)
unprotectedRouter.get('/like/getLikeByid',LikeController.getLikeByid)

//comment
unprotectedRouter.get('/comment/getPhotoComment',CommentController.getPhotoComment);
unprotectedRouter.post('/comment/addComment',CommentController.addCommentById);

//查看用户信息
unprotectedRouter.get('/users/:id', UserController.showUserDetail);

//captcha
unprotectedRouter.get('/getCaptcha/:id',captchaController.getCaptcha);

const protectedRouter = new Router();

// users 相关的路由
protectedRouter.get('/users', UserController.listUsers);
protectedRouter.put('/users/:id', UserController.updateUser);
protectedRouter.delete('/users/:id', UserController.deleteUser);

export { protectedRouter, unprotectedRouter };
