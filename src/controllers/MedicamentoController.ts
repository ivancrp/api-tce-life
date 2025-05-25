import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

export class MedicamentoController {
    async listarMedicamentos(req: Request, res: Response) {
        try {
            const medicamentos = await prisma.medicamento.findMany();
            return res.json(medicamentos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar medicamentos' });
        }
    }

    async buscarPorNome(req: Request, res: Response) {
        try {
            const { nome } = req.query;
            const medicamentos = await prisma.medicamento.findMany({
                where: {
                    nome: {
                        contains: nome as string,
                        mode: 'insensitive'
                    }
                }
            });
            return res.json(medicamentos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar medicamentos' });
        }
    }

    async buscarPorFabricante(req: Request, res: Response) {
        try {
            const { fabricante } = req.query;
            const medicamentos = await prisma.medicamento.findMany({
                where: {
                    fabricante: {
                        contains: fabricante as string,
                        mode: 'insensitive'
                    }
                }
            });
            return res.json(medicamentos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar medicamentos' });
        }
    }

    async criarMedicamento(req: Request, res: Response) {
        try {
            const { nome, fabricante, lote, quantidade, dataValidade } = req.body;
            const medicamento = await prisma.medicamento.create({
                data: {
                    nome,
                    fabricante,
                    lote,
                    quantidade,
                    dataValidade: new Date(dataValidade)
                }
            });
            return res.status(201).json(medicamento);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar medicamento' });
        }
    }

    async atualizarEstoque(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;

            const medicamento = await prisma.medicamento.findUnique({
                where: { id }
            });

            if (!medicamento) {
                return res.status(404).json({ error: 'Medicamento não encontrado' });
            }

            const novaQuantidade = medicamento.quantidade + quantidade;
            if (novaQuantidade < 0) {
                return res.status(400).json({ error: 'Quantidade não pode ser negativa' });
            }

            const medicamentoAtualizado = await prisma.medicamento.update({
                where: { id },
                data: { quantidade: novaQuantidade }
            });

            return res.json(medicamentoAtualizado);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar estoque' });
        }
    }

    async relatorioEstoque(req: Request, res: Response) {
        try {
            const medicamentos = await prisma.medicamento.findMany({
                include: {
                    fabricante: true
                }
            });

            const hoje = new Date();
            const trintaDias = addDays(hoje, 30);

            const medicamentosProximosVencimento = medicamentos.filter(med => {
                const dataValidade = new Date(med.dataValidade);
                return dataValidade <= trintaDias && dataValidade >= hoje;
            });

            const medicamentosEstoqueBaixo = medicamentos.filter(med => 
                med.quantidadeEstoque <= med.quantidadeMinima
            );

            const totalMedicamentos = medicamentos.length;

            res.json({
                medicamentosProximosVencimento: medicamentosProximosVencimento.map(med => ({
                    id: med.id,
                    nomeComercial: med.nomeComercial,
                    nomeGenerico: med.nomeGenerico,
                    fabricante: med.fabricante.nome,
                    lote: med.lote,
                    dataValidade: med.dataValidade,
                    quantidadeEstoque: med.quantidadeEstoque
                })),
                medicamentosEstoqueBaixo: medicamentosEstoqueBaixo.map(med => ({
                    id: med.id,
                    nomeComercial: med.nomeComercial,
                    nomeGenerico: med.nomeGenerico,
                    fabricante: med.fabricante.nome,
                    quantidadeEstoque: med.quantidadeEstoque,
                    quantidadeMinima: med.quantidadeMinima
                })),
                totalMedicamentos,
                medicamentos: medicamentos.map(med => ({
                    id: med.id,
                    nomeComercial: med.nomeComercial,
                    nomeGenerico: med.nomeGenerico,
                    fabricante: med.fabricante.nome,
                    lote: med.lote,
                    dataValidade: med.dataValidade,
                    quantidadeEstoque: med.quantidadeEstoque,
                    quantidadeMinima: med.quantidadeMinima,
                    localArmazenamento: med.localArmazenamento
                }))
            });
        } catch (error) {
            console.error('Erro ao gerar relatório de estoque:', error);
            return res.status(500).json({ error: 'Erro ao gerar relatório de estoque' });
        }
    }

    async medicamentosProximosVencimento(req: Request, res: Response) {
        try {
            const medicamentos = await prisma.medicamento.findMany({
                where: {
                    dataValidade: {
                        lte: addDays(new Date(), 30), // Medicamentos que vencem nos próximos 30 dias
                        gte: new Date() // Apenas medicamentos não vencidos
                    }
                }
            });

            return res.json(medicamentos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar medicamentos próximos do vencimento' });
        }
    }

    async excluirMedicamento(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const medicamento = await prisma.medicamento.findUnique({
                where: { id }
            });

            if (!medicamento) {
                return res.status(404).json({ error: 'Medicamento não encontrado' });
            }

            await prisma.medicamento.delete({
                where: { id }
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao excluir medicamento' });
        }
    }
} 