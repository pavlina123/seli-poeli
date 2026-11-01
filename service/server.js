import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import pg from 'pg';

const { Pool } = pg;
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ==========================================
// ПОДКЛЮЧЕНИЕ К БАЗЕ NEON
// ==========================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ==========================================
// НАСТРОЙКА CLOUDINARY (ОБЛАКО ДЛЯ ФОТО)
// ==========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'seli_poeli', // Папка в облаке
    resource_type: 'auto', // Автоматически определяет фото или видео
  },
});

const upload = multer({ storage: storage });

// ==========================================
// 1. АВТОРИЗАЦИЯ ПО КОДУ
// ==========================================
app.post('/api/login', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Введите код' });
  
  const { rows } = await pool.query('SELECT role, name FROM access_codes WHERE code = $1', [code.trim().toUpperCase()]);
  
  if (!rows.length) return res.status(401).json({ error: 'Неверный код' });
  res.json({ role: rows[0].role, name: rows[0].name, code: code.trim().toUpperCase() });
});

// ==========================================
// 2. ПОЛУЧИТЬ ВСЕ БЛЮДА (ДЛЯ МЕНЮ)
// ==========================================
app.get('/api/dishes', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM dishes ORDER BY created_at DESC');
  res.json(rows);
});

// ==========================================
// 3. ДОБАВИТЬ БЛЮДО
// ==========================================
app.post('/api/dishes', async (req, res) => {
  const { title, description, price, weight, category, photos, videos, code } = req.body;
  const actor = await checkCode(code);
  if (!actor) return res.status(401).json({ error: 'Нет доступа' });

  const { rows } = await pool.query(
    `INSERT INTO dishes (title, description, price, weight, category, photos, videos, created_by, created_by_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [title, description, price, weight, category, JSON.stringify(photos), JSON.stringify(videos), actor.role, code]
  );

  await logAction(rows[0].id, 'create', actor.role, code, null);
  res.status(201).json(rows[0]);
});

// ==========================================
// 4. ИЗМЕНИТЬ БЛЮДО
// ==========================================
app.put('/api/dishes/:id', async (req, res) => {
  const { title, description, price, weight, category, photos, videos, code } = req.body;
  const actor = await checkCode(code);
  if (!actor) return res.status(401).json({ error: 'Нет доступа' });

  const old = await pool.query('SELECT * FROM dishes WHERE id = $1', [req.params.id]);
  
  const { rows } = await pool.query(
    `UPDATE dishes SET title=$1, description=$2, price=$3, weight=$4, category=$5, photos=$6, videos=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
    [title, description, price, weight, category, JSON.stringify(photos), JSON.stringify(videos), req.params.id]
  );

  await logAction(rows[0].id, 'update', actor.role, code, old.rows[0]);
  res.json(rows[0]);
});

// ==========================================
// 5. УДАЛИТЬ БЛЮДО
// ==========================================
app.delete('/api/dishes/:id', async (req, res) => {
  const { code } = req.body;
  const actor = await checkCode(code);
  if (!actor) return res.status(401).json({ error: 'Нет доступа' });

  const old = await pool.query('SELECT * FROM dishes WHERE id = $1', [req.params.id]);
  await pool.query('DELETE FROM dishes WHERE id = $1', [req.params.id]);
  
  await logAction(req.params.id, 'delete', actor.role, code, old.rows[0]);
  res.json({ ok: true });
});

// ==========================================
// 6. ЗАГРУЗКА ФАЙЛОВ В CLOUDINARY
// ==========================================
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  // Multer + Cloudinary автоматически загружают файл и возвращают ссылку (path)
  const urls = (req.files || []).map(f => f.path); 
  res.json({ urls });
});

// ==========================================
// 7. ЛОГИ ДЛЯ АДМИНА
// ==========================================
app.get('/api/log', async (req, res) => {
  const actor = await checkCode(req.query.code);
  if (!actor || actor.role !== 'admin') return res.status(403).json({ error: 'Только админ' });

  const { rows } = await pool.query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 100');
  res.json(rows);
});

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================
async function checkCode(code) {
  if (!code) return null;
  const { rows } = await pool.query('SELECT role FROM access_codes WHERE code = $1', [code]);
  return rows[0] || null;
}

async function logAction(dishId, action, role, code, snapshot) {
  await pool.query(
    'INSERT INTO activity_log (dish_id, action, actor_role, actor_code, snapshot) VALUES ($1,$2,$3,$4,$5)',
    [dishId, action, role, code, snapshot ? JSON.stringify(snapshot) : null]
  );
}

// ==========================================
// ЗАПУСК СЕРВЕРА
// ==========================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT} (с Cloudinary)`));