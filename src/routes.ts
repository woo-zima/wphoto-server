import Router from '@koa/router';

import AuthController from './controllers/auth';
import PhotoController from './controllers/photo';
import CommentController from './controllers/comment'
import UserController from './controllers/user';
import FollowController from './controllers/follow'
import getToken from './api/qiniu'
import captchaController from './controllers/captcha';

const unprotectedRouter = new Router();

// auth 相关的路由
unprotectedRouter.post('/auth/login', AuthController.login);
unprotectedRouter.post('/auth/register', AuthController.register);
unprotectedRouter.post('/photo/getPhotoList',PhotoController.listPhotos);
unprotectedRouter.post('/photo/addPhoto',PhotoController.addPhoto);
unprotectedRouter.get('/getToken',getToken);
unprotectedRouter.get('/photo/getKeyWorlds',PhotoController.getKeyWorlds);
unprotectedRouter.get('/photo/getKeyPhotos',PhotoController.getKeyPhotos);
unprotectedRouter.get('/photo/getUpPhotos',PhotoController.getUpPhotos);

unprotectedRouter.get('/follow/getFollowRelation',FollowController.getFollowRelation);
unprotectedRouter.get('/follow/addFollowRelation',FollowController.addFollowRelation);

unprotectedRouter.get('/photo/showPhotoDetail',PhotoController.showPhotoDetail);
unprotectedRouter.get('/comment/getPhotoComment',CommentController.getPhotoComment);
unprotectedRouter.post('/comment/addComment',CommentController.addCommentById);

//captcha
unprotectedRouter.get('/getCaptcha/:id',captchaController.getCaptcha);

const protectedRouter = new Router();

// users 相关的路由
protectedRouter.get('/users', UserController.listUsers);
protectedRouter.get('/users/:id', UserController.showUserDetail);
protectedRouter.put('/users/:id', UserController.updateUser);
protectedRouter.delete('/users/:id', UserController.deleteUser);

export { protectedRouter, unprotectedRouter };
