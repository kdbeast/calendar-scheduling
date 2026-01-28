import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1769579768439 implements MigrationInterface {
  name = "CreateTables1769579768439";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "locationType"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."events_locationtype_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."events_locationtype_enum" AS ENUM('GOOGLE_MEET_AND_CALENDAR', 'ZOOM_MEETING')`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD "locationType" "public"."events_locationtype_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "locationType"`);
    await queryRunner.query(`DROP TYPE "public"."events_locationtype_enum"`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD "locationType" character varying NOT NULL`,
    );
  }
}
