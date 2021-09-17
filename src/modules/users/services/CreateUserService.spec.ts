import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Diego');
  });
  it('should not be able create a new user with an email already existing', async () => {
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
