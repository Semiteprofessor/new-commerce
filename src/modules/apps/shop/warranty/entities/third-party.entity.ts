import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('third_party_warranty')
export class ThirdParty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  imei?: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;
}
