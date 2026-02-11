import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database;

export const connectDB = async () => {
  try {
    await client.connect();
    database = client.db('studyPlatform');

    // Ensure email is always unique in user collection
    await database
      .collection('user')
      .createIndex({ email: 1 }, { unique: true });

    // Ensure one student can book a session only once
    await database
      .collection('booked')
      .createIndex({ sessionId: 1, studentEmail: 1 }, { unique: true });

    console.log('You successfully connected to MongoDB!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!database) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return database;
};

export default client;
