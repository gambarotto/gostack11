import { classToClass } from 'class-transformer';
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
    return response.status(200).json(classToClass(user));
  }
}
export default UserAvatarController;
