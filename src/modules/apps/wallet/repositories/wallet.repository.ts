import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from 'src/db/repository/entity.repository';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletRepository extends EntityRepository<Wallet> {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {
    super(walletRepository);
  }
}
