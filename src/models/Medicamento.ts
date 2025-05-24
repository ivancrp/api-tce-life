import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('medicamentos')
export class Medicamento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nome: string;

    @Column()
    fabricante: string;

    @Column()
    lote: string;

    @Column()
    quantidade: number;

    @Column({ type: 'date' })
    dataValidade: Date;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 