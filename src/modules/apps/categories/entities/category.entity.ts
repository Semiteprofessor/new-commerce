import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from "typeorm";
import { Product } from "../../shop/products/entities/product.entity";
import { Section } from "./sections.entity";

@Entity('categories')
@Tree('materialized-path')
@Index('idx_category_slug', ['slug'], { unique: true })
@Index('idx_category_parent', ['parent'])
@Index('idx_category_section', ['section'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @ManyToOne(() => Section, (section) => section.categories, {
    nullable: false,
  })
  section: Section;

  @TreeParent()
  parent: Category;

  @TreeChildren({ cascade: true })
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Column({ type: 'decimal', precision: 15, scale: 5, default: 2 })
  commision: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}