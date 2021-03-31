import { parseISO } from 'date-fns';
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import AppointmentsRepository from '../repositories/appointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRoutes = Router();
appointmentsRoutes.use(ensureAuthenticated);

appointmentsRoutes.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find({
    where: { provider_id: request.user.id },
  });
  return response.json(appointments);
});
appointmentsRoutes.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;
    const parseDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
      date: parseDate,
      provider_id,
    });
    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});
export default appointmentsRoutes;
