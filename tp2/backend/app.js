import express from "express";
import cors from "cors";
import { startDB } from "./src/config/database.js";
import characterRoute from "./src/routes/character.route.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/characters", characterRoute);

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor levantado en el puerto: ${PORT}`);
  console.log(
    "----------------------------------------- \n LO NUEVO ESTÁ ABAJO ↓↓↓ \n-----------------------------------------",
  );
});
