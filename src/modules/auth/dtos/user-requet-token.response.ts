import { CreateUserToken } from './create-user-token.dto';

export class UserRequestToken extends Request {
  user: CreateUserToken;
}
