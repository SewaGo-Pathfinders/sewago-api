import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = 3030;

app.listen(PORT, () => {
  console.log(`server starting on https://localhost:${PORT}`);
});
