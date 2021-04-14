import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '../../../services/UpdateUserAvatarService';

class UserAvatarController {
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
export default UserAvatarController;
