export class UserService {
  /**
   * Criar um novo usuário
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      // Se não foi especificada uma role, usar Paciente como padrão
      const roleName = userData.roleName || 'Paciente';
      
      // Buscar a role pelo nome
      const role = await roleService.getRoleByName(roleName);
      
      // Criar o usuário com a role indicada
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          googleId: userData.googleId,
          profilePicture: userData.profilePicture,
          roleId: role.id,
          patientId: userData.patientId
        },
        include: {
          role: true,
          patient: roleName === 'Paciente'
        }
      });
      
      return user;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Não foi possível criar o usuário');
    }
  }
} 