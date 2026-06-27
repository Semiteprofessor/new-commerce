import { BaseEntity } from 'src/db/entity/base.entity';
import { Column, Entity, In, Index, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
@Index(['email', 'role'], { unique: true })
@Index(['phone', 'phone2'])
@Index(['role'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: true, unique: true, length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  middleName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  googleId?: string;

  @Column({
    type: 'varchar',
    length: 255,
    secret: false,
    default: 'PLACEHOLDER_PASSWORD',
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Busine)
}
