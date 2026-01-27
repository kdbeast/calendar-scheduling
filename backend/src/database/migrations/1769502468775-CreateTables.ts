import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1769502468775 implements MigrationInterface {
    name = 'CreateTables1769502468775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."meetings_status_enum" AS ENUM('SCHEDULED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "meetings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guestName" character varying NOT NULL, "guestEmail" character varying, "additionalInfo" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "meetLink" character varying NOT NULL, "calendarEventId" character varying NOT NULL, "status" "public"."meetings_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "eventId" uuid, CONSTRAINT "PK_aa73be861afa77eb4ed31f3ed57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."integrations_provider_enum" AS ENUM('GOOGLE', 'ZOOM')`);
        await queryRunner.query(`CREATE TYPE "public"."integrations_category_enum" AS ENUM('CALENDAR_AND_VIDEO_CONFERENCE', 'VIDEO_CONFERENCE', 'CALENDAR')`);
        await queryRunner.query(`CREATE TYPE "public"."integrations_app_type_enum" AS ENUM('GOOGLE_MEET_AND_CALENDAR', 'ZOOM_MEETING', 'OUTLOOK_CALENDAR')`);
        await queryRunner.query(`CREATE TABLE "integrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."integrations_provider_enum" NOT NULL, "category" "public"."integrations_category_enum" NOT NULL, "app_type" "public"."integrations_app_type_enum" NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying, "expiry_date" bigint, "metadata" json NOT NULL, "isConnected" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_9adcdc6d6f3922535361ce641e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "slug" character varying NOT NULL, "isPrivate" character varying NOT NULL, "locationType" character varying NOT NULL, "isAllDay" boolean NOT NULL, "isRecurring" boolean NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."day_availabilities_day_enum" AS ENUM('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')`);
        await queryRunner.query(`CREATE TABLE "day_availabilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" "public"."day_availabilities_day_enum" NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "isAvailable" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "availabilityId" uuid, CONSTRAINT "PK_670f3896c93148fe850546e5159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "availables" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeGap" integer NOT NULL DEFAULT '30', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d051ea2ea7e0d27032f064c2e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "imageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD CONSTRAINT "FK_4b70ab8832f1d7f9a7387d14307" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD CONSTRAINT "FK_2e6f88379a7a198af6c0ba2ca02" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "integrations" ADD CONSTRAINT "FK_c32758a01d05d0d1da56fa46ae1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day_availabilities" ADD CONSTRAINT "FK_51ab724d48189b93d60c48da4a8" FOREIGN KEY ("availabilityId") REFERENCES "availables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day_availabilities" DROP CONSTRAINT "FK_51ab724d48189b93d60c48da4a8"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_9929fa8516afa13f87b41abb263"`);
        await queryRunner.query(`ALTER TABLE "integrations" DROP CONSTRAINT "FK_c32758a01d05d0d1da56fa46ae1"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP CONSTRAINT "FK_2e6f88379a7a198af6c0ba2ca02"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP CONSTRAINT "FK_4b70ab8832f1d7f9a7387d14307"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        await queryRunner.query(`DROP TABLE "availables"`);
        await queryRunner.query(`DROP TABLE "day_availabilities"`);
        await queryRunner.query(`DROP TYPE "public"."day_availabilities_day_enum"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "integrations"`);
        await queryRunner.query(`DROP TYPE "public"."integrations_app_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."integrations_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."integrations_provider_enum"`);
        await queryRunner.query(`DROP TABLE "meetings"`);
        await queryRunner.query(`DROP TYPE "public"."meetings_status_enum"`);
    }

}
