import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
dotenv.config();

// mongodb ulr
const uri = process.env.DATABASE_URL;

// mongodb client connection
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log('You successfully connected to MongoDB!');
  } finally {
  }
}
run().catch(console.dir);

app.use('/', (req, res) => {
  res.send('student platform');
});

app.listen(port, () => {
  console.log(`Student server is on ${port}`);
});
