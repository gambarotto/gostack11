import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateService: AuthenticateService;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    authenticateService = new AuthenticateService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to authenticate', async () => {
    const user = await createUserService.execute({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });
    const session = await authenticateService.execute({
      email: 'diego@diego.com',
      password: '123456',
    });
    expect(session).toHaveProperty('token');
    expect(session.user).toEqual(user);
  });
  it('should ot be able to authenticate with wrong email/password', async () => {
    await createUserService.execute({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });
    expect(
      authenticateService.execute({
        email: 'diego@diego.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(
      authenticateService.execute({
        email: 'diegoerrado@diego.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
