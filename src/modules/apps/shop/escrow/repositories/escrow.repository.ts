import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from '../../../../../db/repository/entity.repository';
import { EscrowPayment } from '../entities/escrow-payment.entity';

@Injectable()
export class EscrowRepository extends EntityRepository<EscrowPayment> {
  constructor(
    @InjectRepository(EscrowPayment)
    private readonly escrowPaymentRepository: Repository<EscrowPayment>,
  ) {
    super(escrowPaymentRepository);
  }
}
