import jwt from 'jsonwebtoken';
import { config } from '@_config/env.config';

export const generateJWT = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET, { expiresIn: '1h' });
};
