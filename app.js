import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './src/app/routes/index.js';
const app = express()
dotenv.config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json())

app.use('/api/v1', router);

const uri = `${process.env.DB_URL}`;
const client = new MongoClient(uri);
  
await client.connect();
export const Database = client.db('ChinaClient');
export const Collections = {
    productsCollection:  Database.collection('Products')
}
    
  app.listen(port, () => {
    console.log(`listening at ${port}`)
  })

export default app;
