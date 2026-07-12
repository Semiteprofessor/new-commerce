import { registerAs } from '@nestjs/config';
<<<<<<< HEAD
import { StringValue } from 'ms';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET!,
  accessTokenTtl: (process.env.JWT_ACCESS_TOKEN_TTL ?? '1h') as StringValue,
  refreshTokenTtl: (process.env.JWT_REFRESH_TOKEN_TTL ?? '7d') as StringValue,
}));
=======

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    accessTokenTtl: process.env.JWT_ACCESS_TOKEN_TTL ?? '3600',
    refreshTokenTtl: process.env.JWT_REFRESH_TOKEN_TTL ?? '86400',
  };
});
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
