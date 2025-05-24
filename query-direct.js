const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados');
    
    // Lista todas as tabelas no banco
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Tabelas encontradas:');
    console.log(tablesResult.rows.map(row => row.table_name).join(', '));
    
    // Consultar usuários
    const usersResult = await client.query('SELECT * FROM "users"');
    console.log('\nUsuários encontrados:', usersResult.rowCount);
    console.log(JSON.stringify(usersResult.rows, null, 2));
    
    // Consultar roles
    const rolesResult = await client.query('SELECT * FROM "roles"');
    console.log('\nRoles encontradas:', rolesResult.rowCount);
    console.log(JSON.stringify(rolesResult.rows, null, 2));
    
    // Consultar agendamentos
    const schedulesResult = await client.query('SELECT * FROM "schedules"');
    console.log('\nAgendamentos encontrados:', schedulesResult.rowCount);
    
    // Consultar atendimentos
    const attendancesResult = await client.query('SELECT * FROM "attendances"');
    console.log('\nAtendimentos encontrados:', attendancesResult.rowCount);
    
  } catch (error) {
    console.error('Erro ao consultar banco de dados:', error);
  } finally {
    await client.end();
    console.log('Conexão fechada');
  }
}

main(); 