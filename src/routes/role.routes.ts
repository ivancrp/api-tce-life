import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';

const roleRoutes = Router();
const roleController = new RoleController();

// Rotas para roles
roleRoutes.get('/', roleController.getAllRoles.bind(roleController));
roleRoutes.get('/:id', roleController.getRoleById.bind(roleController));

export default roleRoutes; 