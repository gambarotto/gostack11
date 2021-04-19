import AppError from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface Request {
  token: string;
  password: string;
}
@injectable()
class ResetPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: Request): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User token does not exists');
    }
    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User dos not exists');
    }

    const createdAt = userToken.created_at;
    const createdAtWithMoreTwoHours = addHours(createdAt, 2);
    if (isAfter(Date.now(), createdAtWithMoreTwoHours)) {
      throw new AppError('Token expired');
    }
    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}
export default ResetPasswordEmailService;
