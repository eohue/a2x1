import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddPollEntity1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'polls',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'tenant_id', type: 'varchar' },
          { name: 'event_id', type: 'uuid', isNullable: true },
          { name: 'created_by', type: 'uuid' },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'text' },
          { name: 'options', type: 'jsonb' },
          { name: 'votes', type: 'jsonb', default: "'[]'" },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'is_deleted', type: 'boolean', default: false },
        ],
      })
    );
    await queryRunner.createForeignKey(
      'polls',
      new TableForeignKey({
        columnNames: ['event_id'],
        referencedTableName: 'events',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      })
    );
    await queryRunner.createForeignKey(
      'polls',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('polls');
  }
} 