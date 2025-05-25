import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Diretório base para uploads
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
const EXAMS_DIR = path.join(UPLOAD_DIR, 'exams');

// Garante que os diretórios existam
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(EXAMS_DIR)) {
  fs.mkdirSync(EXAMS_DIR, { recursive: true });
}

export async function uploadFile(file: Express.Multer.File): Promise<string> {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = path.join(EXAMS_DIR, fileName);

  // Salva o arquivo
  await fs.promises.writeFile(filePath, file.buffer);

  // Retorna o caminho relativo do arquivo
  return `/uploads/exams/${fileName}`;
} 