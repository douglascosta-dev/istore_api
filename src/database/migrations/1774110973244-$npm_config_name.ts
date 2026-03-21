import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1774110973244 implements MigrationInterface {
    name = ' $npmConfigName1774110973244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password-reset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resetPasswordTokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "user_id" uuid, CONSTRAINT "UQ_bf8b4ed278ec5739a700ec2d1ec" UNIQUE ("user_id"), CONSTRAINT "REL_bf8b4ed278ec5739a700ec2d1e" UNIQUE ("user_id"), CONSTRAINT "PK_cb52c01cb0559a85c23755fb51d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "password-reset" ADD CONSTRAINT "FK_bf8b4ed278ec5739a700ec2d1ec" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password-reset" DROP CONSTRAINT "FK_bf8b4ed278ec5739a700ec2d1ec"`);
        await queryRunner.query(`DROP TABLE "password-reset"`);
    }

}
