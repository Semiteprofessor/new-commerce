import { BaseEntity } from "src/db/entity/base.entity";
import { User } from "src/modules/core/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('warranty')
export class Warranty extends BaseEntity {
  @ManyToOne(() => User, (user) => user.warranty, {
    nullable: false,
    eager: false,
  })
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: false })
  imei?: string;

  @Column({ type: 'varchar', nullable: false })
  brand_model: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false })
  area: string;

  @Column({ type: 'varchar', nullable: false })
  phone: string;
}