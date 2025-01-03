import express from 'express';
import myrouter from './router';
import mongoose from 'mongoose';

const port = 3001;
const app = express();
const DB_URL = "mongodb://127.0.0.1:27017/test"

app.use(express.json());
app.use(myrouter);

async function initServer() {
  console.log("Connecting to database")
  await mongoose.connect(DB_URL);
  app.listen(port, () => {
    console.log(`App running at port ${port}`)
  })
}

initServer();