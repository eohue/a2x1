const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'ibookee',
  entities: [path.join(__dirname, '/entities/*.entity.{js,ts}')],
  migrations: [path.join(__dirname, '/migrations/*.{js,ts}')],
  synchronize: false,
  logging: true,
}); 