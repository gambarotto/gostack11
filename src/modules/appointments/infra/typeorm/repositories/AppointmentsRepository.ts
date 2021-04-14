import { getRepository, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

// @EntityRepository(Appointment)
class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });
    return findAppointment;
  }

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    // cria apenas uma instancia de um objeto que será criado no bd, por isso não precisa do await
    const appointment = this.ormRepository.create({
      provider_id: data.provider_id,
      date: data.date,
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
