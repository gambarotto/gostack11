import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });
  it('should be able to list all profiles', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Diego',
      email: 'diego@diego.com',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'Diego2',
      email: 'diego2@diego2.com',
      password: '123456',
    });
    const findUsers = await listProvidersService.execute({ user_id: user.id });
    expect(findUsers).toHaveLength(1);
    expect(findUsers).toEqual([user2]);
  });
});
