import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1774111101417 implements MigrationInterface {
    name = ' $npmConfigName1774111101417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resetPasswordTokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "user_id" uuid, CONSTRAINT "UQ_ad88301fdc79593dd222268a8b6" UNIQUE ("user_id"), CONSTRAINT "REL_ad88301fdc79593dd222268a8b" UNIQUE ("user_id"), CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "FK_ad88301fdc79593dd222268a8b6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "FK_ad88301fdc79593dd222268a8b6"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
    }

}
