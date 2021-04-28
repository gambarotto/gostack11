import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRoutes = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

const validationRequest = celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().uuid().required(),
    date: Joi.date().required(),
  },
});

appointmentsRoutes.use(ensureAuthenticated);

appointmentsRoutes.post('/', validationRequest, appointmentsController.create);
appointmentsRoutes.get('/me', providerAppointmentsController.index);

export default appointmentsRoutes;
