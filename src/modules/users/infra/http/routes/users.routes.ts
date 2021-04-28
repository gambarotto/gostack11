import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRoutes = Router();
const upload = multer(uploadConfig);
const userController = new UsersController();
const userAvatarController = new UserAvatarController();

const validationRequestCreate = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  },
});

usersRoutes.post('/', validationRequestCreate, userController.create);

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);
export default usersRoutes;
