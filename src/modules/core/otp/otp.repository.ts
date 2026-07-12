import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Otps } from "./otp.entity";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class OtpRepository {
  constructor(
    @InjectRepository(Otps)
    private readonly _otpRepo: Repository<Otps>,
  ) {}

  async create(data: DeepPartial<Otps>): Promise<Otps> {
    const _record = this._otpRepo.create(data);
    return await this._otpRepo.save(_record);
  }

  async findOne(
    filterQuery: FindOptionsWhere<Otps>,
    options?: FindOneOptions<Otps>,
  ): Promise<Otps | null> {
    return await this._otpRepo.findOne({ where: filterQuery, ...options });
  }

  async findOneAndUpdate(
    filterQuery: FindOptionsWhere<Otps>,
    updateEntityData: DeepPartial<Otps>,
  ): Promise<Otps | null> {
    await this._otpRepo.update(filterQuery, updateEntityData);
    return await this.findOne(filterQuery);
  }

  // async find(
  //   filterQuery: FindOptionsWhere<T>,
  //   options?: FindManyOptions<T>
  // ): Promise<T[] | null> {
  //   return this.entityRepository.find({ where: filterQuery, ...options });
  // }
}