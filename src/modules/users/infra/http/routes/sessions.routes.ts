import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRoutes = Router();
// const usersRepository = new UsersRepository();
sessionsRoutes.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticateUser = container.resolve(AuthenticateUserService);
  const { user, token } = await authenticateUser.execute({ email, password });
  // @ts-expect-error Deleta password apenas para retorno pro frontend
  delete user.password;
  return response.json({ user, token });
});
export default sessionsRoutes;
