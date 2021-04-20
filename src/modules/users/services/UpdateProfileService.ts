import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
  user_id: string;
  name?: string;
  email?: string;
  password?: string;
  old_password?: string;
}
@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: Request): Promise<User> {
    const findUser = await this.usersRepository.findById(user_id);
    if (!findUser) {
      throw new AppError('User not found', 400);
    }
    if (email) {
      const userWithUpdatedEmail = await this.usersRepository.findByEmail(
        email,
      );
      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
        throw new AppError('E-mail already in use');
      }
    }

    if (password && !old_password) {
      throw new AppError(
        'You need inform the old password to set a new password',
      );
    }
    if (password && old_password) {
      const comparePassword = await this.hashProvider.compareHash(
        old_password,
        findUser.password,
      );
      if (!comparePassword) {
        throw new AppError('Passwords does not match');
      }
      findUser.password = await this.hashProvider.generateHash(password);
    }

    Object.assign(findUser, { name, email });

    const userUpdated = await this.usersRepository.save(findUser);

    return userUpdated;
  }
}
export default UpdateProfileService;
