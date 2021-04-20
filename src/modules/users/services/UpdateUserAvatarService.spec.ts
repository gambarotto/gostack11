import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able update a avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'foto-de-avatar',
    });
    expect(user.avatar).toBe('foto-de-avatar');
  });
  it('should not be able update a avatar in non-existent user', async () => {
    expect(
      updateUserAvatarService.execute({
        user_id: 'NON-EXISTING-USER',
        avatarFilename: 'foto-de-avatar',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakeUsersRepository.create({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'foto-de-avatar',
    });
    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'outra-foto-de-avatar',
    });
    expect(deleteFile).toHaveBeenCalledWith('foto-de-avatar');
    expect(user.avatar).toBe('outra-foto-de-avatar');
  });
});
