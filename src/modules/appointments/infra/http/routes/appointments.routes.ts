import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsRoutes = Router();
// const appointmentsRepository = new AppointmentsRepository();
const appointmentsController = new AppointmentsController();
appointmentsRoutes.use(ensureAuthenticated);

appointmentsRoutes.post('/', appointmentsController.create);

export default appointmentsRoutes;
