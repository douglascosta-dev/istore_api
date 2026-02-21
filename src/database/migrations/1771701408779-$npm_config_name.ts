import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1771701408779 implements MigrationInterface {
    name = ' $npmConfigName1771701408779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "zipcode" character varying(8) NOT NULL, "street" character varying(255) NOT NULL, "number" integer NOT NULL, "complement" character varying(255), "neighborhood" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "state" character(2) NOT NULL, "default" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_44e36a64ebd336dc0a85770e36" ON "address" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_4a29bc76281bcbf1ce62c3d267" ON "address" ("state") `);
        await queryRunner.query(`CREATE TABLE "cellphones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_6299caf71097270d09872fd96a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9d1247dc03a29ed00dd5c48535" ON "cellphones" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cellphone"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`CREATE INDEX "IDX_a2cecd1a3531c0b041e29ba46e" ON "users" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cellphones" ADD CONSTRAINT "FK_9d1247dc03a29ed00dd5c485350" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cellphones" DROP CONSTRAINT "FK_9d1247dc03a29ed00dd5c485350"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a2cecd1a3531c0b041e29ba46e"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "cellphone" character varying(11) NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d1247dc03a29ed00dd5c48535"`);
        await queryRunner.query(`DROP TABLE "cellphones"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a29bc76281bcbf1ce62c3d267"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44e36a64ebd336dc0a85770e36"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
