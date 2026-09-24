import express from 'express';
import dotenv from 'dotenv';
import { pool } from './config/database'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Init');
});

pool.connect(); 

app.listen(PORT, () => {
    console.log(`Server Init on port ${PORT}`);
});