import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from 'src/db/repository/entity.repository';
import { SystemWallet } from '../entities/system-wallets.entity';

@Injectable()
export class SystemWalletRepository extends EntityRepository<SystemWallet> {
  constructor(
    @InjectRepository(SystemWallet)
    private readonly systemWalletRepository: Repository<SystemWallet>,
  ) {
    super(systemWalletRepository);
  }
}
