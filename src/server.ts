import express from 'express';
import myrouter from './router';
import mongoose from 'mongoose';

const port = 3001;
const app = express();
const DB_URL = "mongodb://127.0.0.1:27017/test"

app.use(express.json());
app.use(myrouter);

/**
 * Inicializa o servidor da aplicação.
 * 
 * Esta função realiza a conexão com o banco de dados MongoDB utilizando 
 * o Mongoose e, em seguida, inicia o servidor Express na porta 3001.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Uma promessa que é resolvida após a conexão com o banco de dados e o início do servidor.
 */

async function initServer() {
  console.log("Connecting to database")
  await mongoose.connect(DB_URL);
  app.listen(port, () => {
    console.log(`App running at port ${port}`)
  })
}

initServer();