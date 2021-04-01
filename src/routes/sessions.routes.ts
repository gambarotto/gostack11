import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
  const { email, password } = request.body;
  const sessionsCreate = new AuthenticateUserService();
  const { user, token } = await sessionsCreate.execute({ email, password });
  // @ts-expect-error Deleta password apenas para retorno pro frontend
  delete user.password;
  return response.json({ user, token });
});
export default sessionsRoutes;
