import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Diego');
  });
  it('should not be able create a new user with an email already existing', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const emailUser = 'diego@diego.com';
    await createUserService.execute({
      name: 'Diego',
      email: emailUser,
      password: '123456',
    });
    expect(
      createUserService.execute({
        name: 'Diego2',
        email: emailUser,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
