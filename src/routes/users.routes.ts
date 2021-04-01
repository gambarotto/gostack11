import { Router } from 'express';
import multer from 'multer';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRoutes = Router();
const upload = multer(uploadConfig);

usersRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUser = new CreateUserService();
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
    const updateAvatarUser = new UpdateUserAvatarService();
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
