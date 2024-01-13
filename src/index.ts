import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import 'dotenv/config';
import './database';

import router from './routes';
import checkNodeEnv from './lib/checkNodeEnv';

const app = express();
const PORT = 3030;

app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: checkNodeEnv()
    ? ['https://sewago-6b835.web.app', 'https://sewago-6b835.firebaseapp.com']
    : 'http://localhost:5173',
  credentials: true
}));
app.use(urlencoded({ extended: false }));
app.use(json());

app.get('/', (req, res) => {
  res.send('Hey, Our RESTfull-API has been published!');
});

app.use(router);

if (!checkNodeEnv()) {
  app.listen(PORT, () => {
    console.log(`server starting on http://localhost:${PORT}`);
  });
}

export default app;
