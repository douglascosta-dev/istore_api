import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1773275844880 implements MigrationInterface {
    name = ' $npmConfigName1773275844880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "default" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "default" DROP DEFAULT`);
    }

}
