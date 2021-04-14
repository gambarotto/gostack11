import { parseISO } from 'date-fns';
import { Router } from 'express';
import { container } from 'tsyringe';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

const appointmentsRoutes = Router();
// const appointmentsRepository = new AppointmentsRepository();

appointmentsRoutes.use(ensureAuthenticated);

// appointmentsRoutes.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find({
//     where: { provider_id: request.user.id },
//   });
//   return response.json(appointments);
// });
appointmentsRoutes.post('/', async (request, response) => {
  const { provider_id, date } = request.body;
  const parseDate = parseISO(date);

  const createAppointment = container.resolve(CreateAppointmentService);

  const appointment = await createAppointment.execute({
    date: parseDate,
    provider_id,
  });
  return response.json(appointment);
});
export default appointmentsRoutes;
