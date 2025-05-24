import { MedicamentoRepository } from '../repositories/MedicamentoRepository';
import { Medicamento } from '../models/Medicamento';

export class MedicamentoService {
    private repository: MedicamentoRepository;

    constructor() {
        this.repository = new MedicamentoRepository();
    }

    async cadastrarMedicamento(medicamento: Partial<Medicamento>): Promise<Medicamento> {
        // Validações básicas
        if (!medicamento.nome || !medicamento.fabricante || !medicamento.lote || !medicamento.dataValidade) {
            throw new Error('Todos os campos obrigatórios devem ser preenchidos');
        }

        if (medicamento.quantidade < 0) {
            throw new Error('A quantidade não pode ser negativa');
        }

        const dataValidade = new Date(medicamento.dataValidade);
        if (dataValidade < new Date()) {
            throw new Error('A data de validade não pode ser anterior à data atual');
        }

        return await this.repository.create(medicamento);
    }

    async consultarPorNome(nome: string): Promise<Medicamento[]> {
        return await this.repository.findByNome(nome);
    }

    async consultarPorFabricante(fabricante: string): Promise<Medicamento[]> {
        return await this.repository.findByFabricante(fabricante);
    }

    async atualizarEstoque(id: string, quantidade: number): Promise<Medicamento | null> {
        const medicamento = await this.repository.findById(id);
        if (!medicamento) {
            throw new Error('Medicamento não encontrado');
        }

        if (medicamento.quantidade + quantidade < 0) {
            throw new Error('Quantidade insuficiente em estoque');
        }

        return await this.repository.atualizarEstoque(id, quantidade);
    }

    async verificarVencimentoProximo(dias: number = 30): Promise<Medicamento[]> {
        return await this.repository.findProximosVencimento(dias);
    }

    async gerarRelatorioEstoque(): Promise<{
        totalMedicamentos: number;
        medicamentos: Medicamento[];
        medicamentosProximosVencimento: Medicamento[];
    }> {
        const medicamentos = await this.repository.findAll();
        const medicamentosProximosVencimento = await this.verificarVencimentoProximo();

        return {
            totalMedicamentos: medicamentos.length,
            medicamentos,
            medicamentosProximosVencimento
        };
    }
} 