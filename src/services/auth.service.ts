console.log('Criando novo usuário a partir da autenticação Google:', googleUserInfo.email);
// Se não existir, criar um novo usuário
// Buscar role de paciente (padrão para novos usuários)
const pacienteRole = await prisma.role.findUnique({
  where: { name: 'Paciente' }
});

if (!pacienteRole) {
  throw new Error('Role não encontrada');
}

// Criar usuário
user = await prisma.user.create({
  data: {
    name: googleUserInfo.name || 'Usuário Google',
    email: googleUserInfo.email,
    profilePicture: googleUserInfo.picture || null,
    googleId: googleUserInfo.sub || '',
    roleId: pacienteRole.id
  },
  include: { role: true }
});

console.log('Novo usuário criado via Google Auth:', user.email);