import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '../controllers/ProfileController';

const profileRoutes = Router();
const profileController = new ProfileController();

const validationRequestUpdate = celebrate({
  [Segments.BODY]: {
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    old_password: Joi.string().min(6),
    password_confirmation: Joi.string().valid(Joi.ref('password')),
  },
});

profileRoutes.use(ensureAuthenticated);

profileRoutes.get('/', profileController.show);
profileRoutes.put('/', validationRequestUpdate, profileController.update);

export default profileRoutes;
