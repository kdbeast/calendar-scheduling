import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";
import { DayAvailability } from "./day-availability";

@Entity({ name: "availables" })
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.availability)
  user: User;

  @OneToMany(
    () => DayAvailability,
    (dayAvailability) => dayAvailability.availability,
    {
      cascade: true,
    },
  )
  days: DayAvailability[];

  @Column({ default: 30 })
  timeGap: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
