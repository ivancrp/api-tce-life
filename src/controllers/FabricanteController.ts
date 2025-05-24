import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FabricanteController {
    async listarFabricantes(req: Request, res: Response) {
        try {
            const fabricantes = await prisma.fabricante.findMany({
                orderBy: {
                    nome: 'asc'
                }
            });
            return res.json(fabricantes);
        } catch (error) {
            console.error('Erro ao listar fabricantes:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async buscarFabricante(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const fabricante = await prisma.fabricante.findUnique({
                where: { id }
            });

            if (!fabricante) {
                return res.status(404).json({ error: 'Fabricante não encontrado' });
            }

            return res.json(fabricante);
        } catch (error) {
            console.error('Erro ao buscar fabricante:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async criarFabricante(req: Request, res: Response) {
        try {
            const { nome, registroAnvisa } = req.body;

            const fabricante = await prisma.fabricante.create({
                data: {
                    nome,
                    registroAnvisa
                }
            });

            return res.status(201).json(fabricante);
        } catch (error) {
            console.error('Erro ao criar fabricante:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async atualizarFabricante(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, registroAnvisa } = req.body;

            const fabricante = await prisma.fabricante.update({
                where: { id },
                data: {
                    nome,
                    registroAnvisa
                }
            });

            return res.json(fabricante);
        } catch (error) {
            console.error('Erro ao atualizar fabricante:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async deletarFabricante(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await prisma.fabricante.delete({
                where: { id }
            });

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar fabricante:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
} 