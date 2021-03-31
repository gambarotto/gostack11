import { Router } from 'express';
import multer from 'multer';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import uploadConfig from '../config/upload';

const usersRoutes = Router();
const upload = multer(uploadConfig);

usersRoutes.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();
    const user = await createUser.execute({ name, email, password });
    // @ts-expect-error Deleta password apenas para retorno pro frontend
    delete user.password;
    return response.json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  (request, response) => {
    return response.json({ ok: true });
  },
);
export default usersRoutes;
