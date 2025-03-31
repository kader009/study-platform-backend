import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'; 
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

    // All DB collection here
    const database = client.db('studyPlatform');
    const SessionCollection = database.collection('session');
    const UserCollection = database.collection('user');

    // get all session data here
    app.get('/api/v1/session', async (req, res) => {
      const sessiondata = await SessionCollection.find().toArray();
      res.send(sessiondata);
    });

    // single session get here
    app.get('/api/v1/session/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const sessiondata = await SessionCollection.findOne(query);
      res.send(sessiondata);
    });

    // user create and save in the database
    app.post('/api/v1/user', async (req, res) => {
      const data = req.body; 
      const email = data.email;
      try {
        const existingUser = await UserCollection.findOne({email})

        if(existingUser){
          res.status(409).send({
            successs: false,
            message: 'Email already exist in the database'
          })
        }
        const result = await UserCollection.insertOne(data)
        res.send({successs: true, message: 'User created successfully.',result}) 
      } catch (error) {
        console.log(error)
        res.status(500).send({
          successs:false,
          message: 'External server error.'
        })
      }
    });

    // login user
    app.post('/api/v1/login', async (req, res) => {
      const { email, password } = req.body;

      const user = await UserCollection.findOne({ email });

      if (!user) {
        res.status(404).send({ error: 'user not found' });
      }

      if (user.password !== password) {
        res.status(401).send({ error: 'invalid password' });
      }

      res.send(user);
    });

    console.log('You successfully connected to MongoDB!');
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('student platform is on');
});

app.listen(port, () => {
  console.log(`Student server is on ${port}`);
});
