import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/Users';

interface Request {
  name: string;
  email: string;
  password: string;
}
class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const checkIfUserExists = await userRepository.findOne({
      where: { email },
    });
    if (checkIfUserExists) {
      throw new AppError('Email address already used.', 400);
    }
    const hashedPassword = password ? await hash(password, 8) : '0';
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await userRepository.save(user);
    return user;
  }
}
export default CreateUserService;
