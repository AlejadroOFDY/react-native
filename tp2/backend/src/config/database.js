import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
);

export const startDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión con la base de datos exitosa");
    await sequelize.sync({
      force: true,
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};
