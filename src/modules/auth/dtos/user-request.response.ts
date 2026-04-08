import { UserResponse } from 'src/modules/users/dto/user.response';

export class UserResquest extends Request {
  user: UserResponse;
}
