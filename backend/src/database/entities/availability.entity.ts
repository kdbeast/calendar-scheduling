import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { DayAvailabilty } from "./day-availability";

@Entity({ name: "availables" })
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => User, (user) => user.availability)
  user: User;

  @OneToMany(() => DayAvailabilty, (dayAvailability) => dayAvailability.availability)
  days: DayAvailabilty[];

  @Column({default:30})
  timeGap: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
