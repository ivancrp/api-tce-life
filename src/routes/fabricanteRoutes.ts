import { Router } from 'express';
import { FabricanteController } from '../controllers/FabricanteController';
import { verificarPermissao } from '../middlewares/authMiddleware';

const router = Router();
const fabricanteController = new FabricanteController();

// Middleware para verificar se o usuário tem permissão (administrador)
const verificarAcessoAdmin = verificarPermissao(['Admin']);

// Rotas protegidas que requerem permissão de administrador
router.get('/fabricantes', verificarAcessoAdmin, fabricanteController.listarFabricantes.bind(fabricanteController));
router.get('/fabricantes/:id', verificarAcessoAdmin, fabricanteController.buscarFabricante.bind(fabricanteController));
router.post('/fabricantes', verificarAcessoAdmin, fabricanteController.criarFabricante.bind(fabricanteController));
router.put('/fabricantes/:id', verificarAcessoAdmin, fabricanteController.atualizarFabricante.bind(fabricanteController));
router.delete('/fabricantes/:id', verificarAcessoAdmin, fabricanteController.deletarFabricante.bind(fabricanteController));

// Listar todos os fabricantes
router.get('/', fabricanteController.listarFabricantes);

// Buscar fabricante por ID
router.get('/:id', fabricanteController.buscarFabricante);

// Criar novo fabricante
router.post('/', fabricanteController.criarFabricante);

// Atualizar fabricante
router.put('/:id', fabricanteController.atualizarFabricante);

// Deletar fabricante
router.delete('/:id', fabricanteController.deletarFabricante);

export default router; 