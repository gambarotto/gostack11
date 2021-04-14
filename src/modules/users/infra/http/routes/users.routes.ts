import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

const usersRoutes = Router();
const upload = multer(uploadConfig);
// const usersRepository = new UsersRepository();

usersRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUser = container.resolve(CreateUserService);
  const user = await createUser.execute({ name, email, password });
  // @ts-expect-error Deleta password apenas para retorno pro frontend
  delete user.password;
  return response.json(user);
});

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateAvatarUser = container.resolve(UpdateUserAvatarService);
    const user = await updateAvatarUser.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    // @ts-expect-error Deleta password apenas para retorno pro frontend
    delete user.password;
    return response.status(200).json(user);
  },
);
export default usersRoutes;
