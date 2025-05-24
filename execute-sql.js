const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados');
    
    // Ler o arquivo SQL
    const sql = fs.readFileSync('./seed.sql', 'utf8');
    
    // Executar o SQL
    await client.query(sql);
    console.log('Script SQL executado com sucesso!');
    
    // Verificar os dados inseridos
    const rolesResult = await client.query('SELECT * FROM "roles"');
    console.log('\nRoles inseridas:', rolesResult.rowCount);
    
    const usersResult = await client.query('SELECT id, name, email, "roleId", "isActive" FROM "users"');
    console.log('\nUsuários inseridos:', usersResult.rowCount);
    console.log(JSON.stringify(usersResult.rows, null, 2));
    
  } catch (error) {
    console.error('Erro ao executar script SQL:', error);
  } finally {
    await client.end();
    console.log('Conexão fechada');
  }
}

main(); 