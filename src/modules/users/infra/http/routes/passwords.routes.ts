import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRoutes = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

const validationRequestForgot = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  },
});
const validationRequestReset = celebrate({
  [Segments.BODY]: {
    token: Joi.string().uuid().required(),
    password: Joi.string().min(6).required(),
    password_confirmation: Joi.string().required().valid(Joi.ref('password')),
  },
});

passwordRoutes.post(
  '/forgot',
  validationRequestForgot,
  forgotPasswordController.create,
);
passwordRoutes.post(
  '/reset',
  validationRequestReset,
  resetPasswordController.create,
);

export default passwordRoutes;
