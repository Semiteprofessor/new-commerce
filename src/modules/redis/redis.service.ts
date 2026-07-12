import { Inject, Injectable } from "@nestjs/common";
import { REDIS_KEYS } from "./redis.constant";
import Redis from "ioredis";
import { CourierLocationDto } from "../core/users/dros/courier.dto";
import { promisify } from "util";
import { Location } from "../apps/shop/order/dto/shipping-address.dto";

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async findCouriers(lng: number, lat: number, radius = 3) {
    return this.redisClient.geosearch(
      REDIS_KEYS.COURIERS_LOCATION,
      'FROMLONLAT',
      lng,
      lat,
      'BYRADIUS',
      radius,
      'km',
      'WITHCOORD',
      'WITHDIST',
      'ASC',
    );
  }

  async toggleOnlineStatus(courierId: string, isOnline: boolean) {
    if (!isOnline) {
      return this.courierOffline(courierId);
    }
    return this.redisClient.sadd(
      REDIS_KEYS.ONLINE_COURIERS,
      `courier:${courierId}`,
    );
  }

  async getOnlineCouriers() {
    return this.redisClient.smembers(REDIS_KEYS.ONLINE_COURIERS);
  }

  async isCourierOnline(courierId: string) {
    return (
      (await this.redisClient.sismember(
        REDIS_KEYS.ONLINE_COURIERS,
        `courier:${courierId}`,
      )) === 1
    );
  }

  async updateLocation(courierId: string, data: CourierLocationDto) {
    try {
      const { lng, lat } = data;
      this.redisClient.geoadd(
        REDIS_KEYS.COURIERS_LOCATION,
        lng,
        lat,
        `courier:location:${courierId}`,
      );
    } catch (e) {
      throw e;
    }
  }

  private async courierOffline(courierId: string) {
    this.redisClient.srem(REDIS_KEYS.ONLINE_COURIERS, `courier:${courierId}`);
  }

  async addLocation(key: string, location: Location): Promise<void> {
    try {
      await this.redisClient.geoadd(
        key,
        location.longitude,
        location.latitude,
        location.name,
      );
    } catch (error) {
      console.error('Error adding location to Redis:', error);
      throw error;
    }
  }

  async calculateDistance(
    key: string,
    location1: Location,
    location2: Location,
    unit: 'm' | 'km' | 'mi' | 'ft' = 'km',
  ): Promise<number | null> {
    try {
      await this.addLocation(key, location1);
      await this.addLocation(key, location2);

      const geodistAsync = promisify(this.redisClient.geodist).bind(
        this.redisClient,
      );

      const distance = await geodistAsync(
        key,
        location1.name,
        location2.name,
        unit,
      );
      // const distance = await this.haversineDistance(location1.latitude,location1.longitude, location2.latitude,location2.longitude,'km')
      console.log(distance);
      return distance ? distance : null;
    } catch (error) {
      console.error('Error calculating distance with Redis:', error);
      throw error;
    }
  }

  // deg2rad(deg: number): number {
  //   return deg * (Math.PI / 180);
  // }

  // haversineDistance(
  //   lat1: number,
  //   lon1: number,
  //   lat2: number,
  //   lon2: number,
  //   unit: 'km' | 'm' | 'mi' = 'km'
  // ): number {
  //   const R = unit === 'km' ? 6371 : unit === 'm' ? 6371000 : 3958.8;
  //   const dLat = this.deg2rad(lat2 - lat1);
  //   const dLon = this.deg2rad(lon2 - lon1);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(this.deg2rad(lat1)) *
  //       Math.cos(this.deg2rad(lat2)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return R * c;
  // }
}