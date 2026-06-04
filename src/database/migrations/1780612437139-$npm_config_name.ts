import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1780612437139 implements MigrationInterface {
    name = ' $npmConfigName1780612437139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."images_type_enum" NOT NULL, "mime_type" character varying(100) NOT NULL, "original_name" character varying(255) NOT NULL, "server_name" character varying(255) NOT NULL, "path" character varying(255) NOT NULL, "size" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "images"`);
    }

}
