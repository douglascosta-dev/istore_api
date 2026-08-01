import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1785286710959 implements MigrationInterface {
    name = ' $npmConfigName1785286710959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "image_id" uuid, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "REL_5336de31c6bef5b1e543d66d2b" UNIQUE ("image_id"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_5336de31c6bef5b1e543d66d2bc" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_5336de31c6bef5b1e543d66d2bc"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
