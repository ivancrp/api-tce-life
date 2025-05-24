import { Repository } from 'typeorm';
import { Medicamento } from '../models/Medicamento';
import { AppDataSource } from '../data-source';

export class MedicamentoRepository {
    private repository: Repository<Medicamento>;

    constructor() {
        this.repository = AppDataSource.getRepository(Medicamento);
    }

    async create(medicamento: Partial<Medicamento>): Promise<Medicamento> {
        const novoMedicamento = this.repository.create(medicamento);
        return await this.repository.save(novoMedicamento);
    }

    async findAll(): Promise<Medicamento[]> {
        return await this.repository.find();
    }

    async findById(id: string): Promise<Medicamento | null> {
        return await this.repository.findOneBy({ id });
    }

    async findByNome(nome: string): Promise<Medicamento[]> {
        return await this.repository.find({
            where: {
                nome: nome,
                ativo: true
            }
        });
    }

    async findByFabricante(fabricante: string): Promise<Medicamento[]> {
        return await this.repository.find({
            where: {
                fabricante: fabricante,
                ativo: true
            }
        });
    }

    async update(id: string, medicamento: Partial<Medicamento>): Promise<Medicamento | null> {
        await this.repository.update(id, medicamento);
        return await this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.update(id, { ativo: false });
    }

    async findProximosVencimento(dias: number): Promise<Medicamento[]> {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + dias);

        return await this.repository.find({
            where: {
                dataValidade: dataLimite,
                ativo: true
            }
        });
    }

    async atualizarEstoque(id: string, quantidade: number): Promise<Medicamento | null> {
        const medicamento = await this.findById(id);
        if (!medicamento) return null;

        medicamento.quantidade += quantidade;
        return await this.repository.save(medicamento);
    }
} 