import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '../../../services/CreateUserService';
import UpdateUserAvatarService from '../../../services/UpdateUserAvatarService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({ name, email, password });
    // @ts-expect-error Deleta password apenas para retorno pro frontend
    delete user.password;
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatarUser = container.resolve(UpdateUserAvatarService);
    const user = await updateAvatarUser.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    // @ts-expect-error Deleta password apenas para retorno pro frontend
    delete user.password;
    return response.status(200).json(user);
  }
}
export default UsersController;
