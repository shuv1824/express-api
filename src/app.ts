import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

export default app;
