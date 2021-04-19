import { v4 } from 'uuid';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '../IUserTokensRepository';

class FakeUserTokensRepository implements IUserTokensRepository {
  private tokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: v4(),
      token: v4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    this.tokens.push(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.tokens.find(u => u.token === token);
    return userToken;
  }
}

export default FakeUserTokensRepository;
