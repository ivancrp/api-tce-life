-- Inserir roles
INSERT INTO "roles" (id, name, description, "createdAt", "updatedAt")
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Administrador do sistema', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Médico', 'Médico do sistema', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Recepcionista', 'Recepcionista do sistema', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Paciente', 'Paciente do sistema', NOW(), NOW());

-- Inserir usuários
-- Senhas: 'admin123', 'medico123', 'recepcao123', 'paciente123'
-- Nota: Em um ambiente real, estas senhas devem ser hash, mas para fins de demonstração estamos colocando texto simples
INSERT INTO "users" (id, name, email, password, "roleId", "isActive", "createdAt", "updatedAt")
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin', 'admin@example.com', '$2b$10$hACwQ5/HsfCI6KFO3RMol.wUWbUSuXbJXkfOEp4xomz8lcljvwAiG', '11111111-1111-1111-1111-111111111111', true, NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Dr. João Silva', 'joao.silva@example.com', '$2b$10$MsodMmE5FaPCVX1KpV8jqucq3ZAt8y.zhbD16E.P7P8s/tJwCUB7O', '22222222-2222-2222-2222-222222222222', true, NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Maria Santos', 'maria.santos@example.com', '$2b$10$dICc.XrQ9rI9HNpD95LYwucq4z1gA1CWCRsJ9VbzJGj.5kPszNvoy', '33333333-3333-3333-3333-333333333333', true, NOW(), NOW()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Paciente Teste', 'paciente@example.com', '$2b$10$HGBfPehIjLMX0chzewDlM.nvUF7/a2y8a9LMwVz/3G2gVOIExi.v.', '44444444-4444-4444-4444-444444444444', true, NOW(), NOW()); 