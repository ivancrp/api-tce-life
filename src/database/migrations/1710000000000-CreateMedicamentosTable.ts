import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMedicamentosTable1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'medicamentos',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'nome',
                        type: 'varchar',
                    },
                    {
                        name: 'fabricante',
                        type: 'varchar',
                    },
                    {
                        name: 'lote',
                        type: 'varchar',
                    },
                    {
                        name: 'quantidade',
                        type: 'int',
                    },
                    {
                        name: 'data_validade',
                        type: 'date',
                    },
                    {
                        name: 'ativo',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('medicamentos');
    }
} 