import express from 'express';
import myrouter from './router';

const port = 3001;
const app = express();

app.use(express.json());
app.use(myrouter);

app.listen(port, () => {
  console.log(`App running at port ${port}`)
})