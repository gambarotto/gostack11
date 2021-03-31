import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '../models/Users';

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
      throw new Error('Email address already used.');
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
