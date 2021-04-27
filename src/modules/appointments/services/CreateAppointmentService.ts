import { getHours, isBefore, startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
  date: Date;
  provider_id: string;
  user_id: string;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: Request): Promise<Appointment> {
    const appointmentsDate = startOfHour(date);
    // validations
    if (isBefore(appointmentsDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself");
    }
    if (getHours(appointmentsDate) < 8 || getHours(appointmentsDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm',
      );
    }
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentsDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 400);
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentsDate,
    });
    return appointment;
  }
}
export default CreateAppointmentService;
