import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1774036068712 implements MigrationInterface {
    name = ' $npmConfigName1774036068712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cellphones" ADD CONSTRAINT "UQ_d284f1d3ab6dc7c1c6154e6b406" UNIQUE ("user_id", "number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cellphones" DROP CONSTRAINT "UQ_d284f1d3ab6dc7c1c6154e6b406"`);
    }

}
