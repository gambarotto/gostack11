import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '../../../services/CreateAppointmentService';

class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;
    const parseDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date: parseDate,
      provider_id,
      user_id,
    });
    return response.json(appointment);
  }
}
export default AppointmentsController;
