import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepositories';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 15, 15).getTime();
    });
    const notificationCreate = jest.spyOn(
      fakeNotificationsRepository,
      'create',
    );

    const appointment = await createAppointment.execute({
      date: new Date(2021, 3, 15, 16),
      provider_id: 'rghhhue74433',
      user_id: 'user_id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('rghhhue74433');
    expect(notificationCreate).toHaveBeenCalled();
  });
  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 15, 15).getTime();
    });

    const date = new Date(2021, 3, 15, 17);
    await createAppointment.execute({
      date,
      provider_id: 'rghhhue74433',
      user_id: 'user_id',
    });
    await expect(
      createAppointment.execute({
        date,
        provider_id: 'rghhhue74433',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointments on a past time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 15, 15).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 3, 15, 13),
        provider_id: 'rghhhue74433',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 15, 15).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 3, 15, 16),
        provider_id: 'user_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment before 08am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 15, 15).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 3, 16, 7),
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createAppointment.execute({
        date: new Date(2021, 3, 16, 18),
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
