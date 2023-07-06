import express from 'express';
import { rootHandler, helloHandler } from './handlers';
import { main } from './puppeteer';

const app = express();
const port = process.env.PORT || '8000';

app.get('/', main);
app.get('/hello/:name', helloHandler);

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});