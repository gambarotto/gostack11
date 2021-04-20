import IUpdateProfileDTO from '../dtos/IUpdateProfileDTO';
import User from '../infra/typeorm/entities/Users';

export default interface IUsersRepository {
  create(data: IUpdateProfileDTO): Promise<User>;
  // delete(user: User): Promise<User>;
}
