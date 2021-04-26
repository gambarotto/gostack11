import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });
    const compareHash = jest.spyOn(fakeHashProvider, 'compareHash');
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Diego Atualizado',
      email: 'diegoatualizado@diego.com',
      password: '1234567',
      old_password: '123456',
    });
    expect(updateUser.name).toBe('Diego Atualizado');
    expect(updateUser.email).toBe('diegoatualizado@diego.com');
    expect(updateUser.password).toBe('1234567');
    expect(compareHash).toHaveBeenCalledWith('123456', '123456');
    expect(generateHash).toHaveBeenCalledWith(updateUser.password);
  });
  it('should be able update the name and email profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });
    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Diego Atualizado',
      email: 'diegoatualizado@diego.com',
    });
    expect(updateUser.name).toBe('Diego Atualizado');
    expect(updateUser.email).toBe('diegoatualizado@diego.com');
  });
  it('should not be able to update a non-existent user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existent-id',
        name: 'Diego Atualizado',
        email: 'diego@diego.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'test@test.com',
      password: '123456',
    });
    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Diego Atualizado',
        email: 'diego@diego.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to change password without inform old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'test@test.com',
      password: '123456',
    });
    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Diego Atualizado',
        email: 'diego@diego.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to set a new password if old password was wrong', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Diego Atualizado',
      email: 'diego@diego.com',
      password: '1234567',
    });
    const compareHash = jest.spyOn(fakeHashProvider, 'compareHash');

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Diego Atualizado',
        email: 'diego@diego.com',
        password: '1234567',
        old_password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(compareHash).toHaveBeenCalledWith('wrong-password', user.password);
  });
});
