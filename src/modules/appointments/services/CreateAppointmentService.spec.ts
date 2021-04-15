import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: 'rghhhue74433',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('rghhhue74433');
  });
  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );
    const date = new Date();
    await createAppointment.execute({
      date,
      provider_id: 'rghhhue74433',
    });
    expect(
      createAppointment.execute({
        date,
        provider_id: 'rghhhue74433',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
