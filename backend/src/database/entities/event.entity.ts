import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Meeting } from "./meeting.entity";
import { IntegrationAppTypeEnum } from "./integretion";

export enum EventLocationTypeEnum {
  GOOGLE_MEET_AND_CALENDAR = IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
  ZOOM_MEETING = IntegrationAppTypeEnum.ZOOM_MEETING,
}

@Entity({ name: "events" })
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false, default: false })
  isPrivate: boolean;

  @Column({ nullable: false })
  duration: number;

  @Column({type: "enum", enum: EventLocationTypeEnum})
  locationType: EventLocationTypeEnum;

  @Column({ nullable: false, default: false })
  isAllDay: boolean;

  @Column({ nullable: false, default: false })
  isRecurring: boolean;

  @ManyToOne(() => User, (user) => user.events)
  user: User;

  @OneToMany(() => Meeting, (meeting) => meeting.event)
  meetings: Meeting[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
