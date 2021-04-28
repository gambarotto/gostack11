import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRoutes = Router();
const sessionsController = new SessionsController();

const validationRequest = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  },
});
sessionsRoutes.post('/', validationRequest, sessionsController.create);

export default sessionsRoutes;
