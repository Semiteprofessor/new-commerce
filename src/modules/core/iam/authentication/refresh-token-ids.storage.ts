import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  private redisClient: Redis;
  // onApplicationBootstrap(): any {
  //   this.redisClient = new Redis({
  //     host: 'localhost',
  //     port: 6379,
  //   });
  // }
  //
  // onApplicationShutdown(): any {
  //   return this.redisClient.quit();
  // }

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }
  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    if (storedId === tokenId) {
      throw new InvalidateRefreshTokenError();
    }
    return storedId === tokenId;
  }
  async invalidate(userId: string): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: string): string {
    return `user:${userId}`;
  }
}
