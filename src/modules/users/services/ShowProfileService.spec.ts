import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });
    const findUser = await showProfileService.execute({ user_id: user.id });
    expect(findUser).toHaveProperty('id');
    expect(findUser).not.toHaveProperty('password');
  });
  it('should not be able show profile from non-existent user', async () => {
    expect(
      showProfileService.execute({ user_id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
