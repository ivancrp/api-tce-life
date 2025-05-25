import { Router } from 'express';
import { MedicamentoController } from '../controllers/MedicamentoController';
import { verificarPermissao } from '../middlewares/authMiddleware';

const router = Router();
const medicamentoController = new MedicamentoController();

// Middleware para verificar se o usuário tem permissão (médico, recepcionista ou administrador)
const verificarAcessoEstoque = verificarPermissao(['MEDICO', 'SECRETARIA', 'ADMIN']);

// Rotas protegidas que requerem permissão específica
router.get('/', verificarAcessoEstoque, medicamentoController.listarMedicamentos.bind(medicamentoController));
router.get('/nome', verificarAcessoEstoque, medicamentoController.buscarPorNome.bind(medicamentoController));
router.get('/fabricante', verificarAcessoEstoque, medicamentoController.buscarPorFabricante.bind(medicamentoController));
router.post('/', verificarAcessoEstoque, medicamentoController.criarMedicamento.bind(medicamentoController));
router.put('/:id/estoque', verificarAcessoEstoque, medicamentoController.atualizarEstoque.bind(medicamentoController));
router.get('/relatorio', verificarAcessoEstoque, medicamentoController.relatorioEstoque.bind(medicamentoController));
router.get('/vencimento', verificarAcessoEstoque, medicamentoController.medicamentosProximosVencimento.bind(medicamentoController));
router.delete('/:id', verificarAcessoEstoque, medicamentoController.excluirMedicamento.bind(medicamentoController));

export default router; 