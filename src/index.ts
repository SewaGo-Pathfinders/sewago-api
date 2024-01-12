import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import 'dotenv/config';
import './database';

import router from './routes';

const app = express();
const PORT = 3030;

app.use(helmet());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(urlencoded({ extended: false }));
app.use(json());

app.use(router);

app.listen(PORT, () => {
  console.log(`server starting on http://localhost:${PORT}`);
});
