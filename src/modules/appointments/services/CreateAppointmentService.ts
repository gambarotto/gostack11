import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../repositories/appointmentsRepository';

interface Request {
  date: Date;
  provider_id: string;
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentsDate = startOfHour(date);
    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentsDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 400);
    }
    // cria apenas uma instancia de um objeto que será criado no bd, por isso não precisa do await
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentsDate,
    });
    await appointmentsRepository.save(appointment);
    return appointment;
  }
}
export default CreateAppointmentService;
