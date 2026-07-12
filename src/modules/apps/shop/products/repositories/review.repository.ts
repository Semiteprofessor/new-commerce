import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from '../../../../../db/repository/entity.repository';
import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewRepository extends EntityRepository<Review> {
  constructor(
    @InjectRepository(Review)
    private readonly _reviewRepository: Repository<Review>,
  ) {
    super(_reviewRepository);
  }
}
