import {
  Column,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from "typeorm";
import { compareValue, hashValue } from "../../utils/bcrypt";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  imageUrl: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashValue(this.password, 12);
    }
  }
  async comparePassword(password: string): Promise<boolean> {
    return await compareValue(password, this.password);
  }
  omitPassword(): Omit<User, "password"> {
    const { password, ...user } = this;
    return user as Omit<User, "password">;
  }
}
