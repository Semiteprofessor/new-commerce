import { registerAs } from '@nestjs/config';
import { StringValue } from 'ms';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET!,
  accessTokenTtl: (process.env.JWT_ACCESS_TOKEN_TTL ?? '1h') as StringValue,
  refreshTokenTtl: (process.env.JWT_REFRESH_TOKEN_TTL ?? '7d') as StringValue,
}));
