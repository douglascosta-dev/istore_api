import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1774117046189 implements MigrationInterface {
    name = ' $npmConfigName1774117046189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset" ADD "token_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "token_id"`);
    }

}
