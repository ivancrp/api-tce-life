INSERT INTO medicamentos (
    id,
    nome,
    fabricante,
    lote,
    quantidade,
    dataValidade,
    createdAt,
    updatedAt
) VALUES (
    gen_random_uuid(),
    'Paracetamol 500mg',
    'EMS',
    'LOT123456',
    100,
    '2025-12-31',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
); 