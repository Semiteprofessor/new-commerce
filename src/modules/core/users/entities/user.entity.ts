import { BaseEntity } from "src/db/entity/base.entity";
import { Entity, In, Index } from "typeorm";

@Entity("users")
@Index(['email', 'role'], {unique: true})
@Index(["phone", "phone2"])
@Index(["role"])
export class User extends BaseEntity {
    
}