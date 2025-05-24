import { Router } from 'express';
import { MedicamentoController } from '../controllers/MedicamentoController';
import { verificarPermissao } from '../middlewares/authMiddleware';

const router = Router();
const medicamentoController = new MedicamentoController();

// Middleware para verificar se o usuário tem permissão (médico, recepcionista ou administrador)
const verificarAcessoEstoque = verificarPermissao(['Médico', 'Recepcionista', 'Admin']);

// Rotas protegidas que requerem permissão específica
router.get('/medicamentos', verificarAcessoEstoque, medicamentoController.listarMedicamentos.bind(medicamentoController));
router.get('/medicamentos/nome', verificarAcessoEstoque, medicamentoController.buscarPorNome.bind(medicamentoController));
router.get('/medicamentos/fabricante', verificarAcessoEstoque, medicamentoController.buscarPorFabricante.bind(medicamentoController));
router.post('/medicamentos', verificarAcessoEstoque, medicamentoController.criarMedicamento.bind(medicamentoController));
router.put('/medicamentos/:id/estoque', verificarAcessoEstoque, medicamentoController.atualizarEstoque.bind(medicamentoController));
router.get('/medicamentos/relatorio', verificarAcessoEstoque, medicamentoController.relatorioEstoque.bind(medicamentoController));
router.get('/medicamentos/vencimento', verificarAcessoEstoque, medicamentoController.medicamentosProximosVencimento.bind(medicamentoController));
router.delete('/medicamentos/:id', verificarAcessoEstoque, medicamentoController.excluirMedicamento.bind(medicamentoController));

export default router; 