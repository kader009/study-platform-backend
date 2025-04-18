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
    const NoteCollection = database.collection('note');
    const MaterialCollection = database.collection('material');

    // get all session data here
    app.get('/api/v1/session', async (req, res) => {
      const sessiondata = await SessionCollection.find().toArray();
      res.send(sessiondata);
    });

    // post session from the tutor
    app.post('/api/v1/session', async (req, res) => {
      const SessionPost = req.body;
      const result = await SessionCollection.insertOne(SessionPost);
      res.send(result);
    });

    // get approved session only
    app.get('/api/v1/session/approved', async (req, res) => {
      try {
        const Approvesession = await SessionCollection.find({
          status: 'approved',
        }).toArray();
        res.status(200).send(Approvesession);
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: 'approved session not found.' });
      }
    });

    // get approved session by tutor email
    app.get('/api/v1/session/approved/:email', async (req, res) => {
      const email = req.params.email;
      try {
        const query = { tutorEmail: email, status: 'approved' };
        const Approvesession = await SessionCollection.find(query).toArray();
        res.status(200).send(Approvesession);
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: 'approved session not found.' });
      }
    });

    // single session get here
    app.get('/api/v1/session/:id', async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid session ID format' });
      }

      try {
        const sessiondata = await SessionCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!sessiondata) {
          return res.status(404).send({ message: 'Session not found' });
        }

        res.send(sessiondata);
      } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).send({ message: 'Server error', error });
      }
    });

    // single session delete here
    app.delete('/api/v1/session/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const deleteNote = await SessionCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (deleteNote.deletedCount === 1) {
          res
            .status(200)
            .json({ successs: true, message: 'session delete successfully.' });
        } else {
          res
            .status(404)
            .json({ successs: false, message: 'session not found.' });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete the session.' });
      }
    });

    // update session data approve
    app.patch('/api/v1/session/approve/:id', async (req, res) => {
      const { id } = req.params;

      try {
        const updateSession = await SessionCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: 'approved' } }
        );
        if (updateSession.matchedCount === 0) {
          res.status(404).json({ message: 'session not found.' });
        }

        res.json({ message: 'session update successfully.' });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to approve session.' });
      }
    });

    // get session based on tutor email
    app.get('/api/v1/session/email/:email', async (req, res) => {
      const email = req.params.email;
      const query = { tutorEmail: email };
      try {
        const sessionFortutor = await SessionCollection.find(query).toArray();
        res.send(sessionFortutor);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'server error', error });
      }
    });

    // material post route for database
    app.post('/api/v1/material', async (req, res) => {
      const material = req.body;
      const saveMaterial = await MaterialCollection.insertOne(material);
      res.send(saveMaterial);
    });

    // get all material route
    app.get('/api/v1/material', async (req, res) => {
      const getAllmaterial = await MaterialCollection.find().toArray();
      res.send(getAllmaterial);
    });

    // get material based on the email
    app.get('/api/v1/material/:email', async (req, res) => {
      const email = req.params.email;
      const query = { TutorEmail: email };
      try {
        const sessionMaterial = await MaterialCollection.find(query).toArray();
        res.send(sessionMaterial);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'server error', error });
      }
    });

    // delete material from tutor dashboard
    app.delete('/api/v1/material/:id', async (req, res) => {
      const { id } = req.params;

      try {
        const deleteMaterial = await MaterialCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (deleteMaterial.deletedCount === 0) {
          return res.status(404).json({ error: 'Material not found' });
        }

        res.status(200).json({ message: 'Material deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'failed to delete material' });
      }
    });

    // user create and save in the database
    app.post('/api/v1/user', async (req, res) => {
      const data = req.body;
      const email = data.email;
      try {
        const existingUser = await UserCollection.findOne({ email });

        if (existingUser) {
          res.status(409).send({
            successs: false,
            message: 'Email already exist in the database',
          });
        }
        const result = await UserCollection.insertOne(data);
        res.send({
          successs: true,
          message: 'User created successfully.',
          result,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          successs: false,
          message: 'External server error.',
        });
      }
    });

    // get all user here
    app.get('/api/v1/user', async (req, res) => {
      const allUser = await UserCollection.find().toArray();
      res.send(allUser);
    });

    // get single tutor from the user list
    app.get('api/v1/singletutor', async (req, res) => {
      const email = req.user.email;

      try {
        const tutor = await UserCollection.findOne({ email, role: 'tutor' });

        if (!tutor) {
          return res.status(404).json({ message: 'tutor not found' });
        }

        res.json(tutor);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Interval server error.' });
      }
    });

    // update user role
    app.patch('/api/v1/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateRole = { $set: { role: 'admin' } };
      const allUser = await UserCollection.updateOne(query, updateRole);
      res.send(allUser);
    });

    // get tutor based on role
    app.get('/api/v1/tutor', async (req, res) => {
      const tutor = { role: 'tutor' };
      const Tutorresponse = await UserCollection.find(tutor).toArray();
      res.send(Tutorresponse);
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

    // note creation route here
    app.post('/api/v1/note', async (req, res) => {
      const NoteData = req.body;
      const noteSend = await NoteCollection.insertOne(NoteData);
      res.send(noteSend);
    });

    // note get based on the email
    app.get('/api/v1/note/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const findNote = await NoteCollection.find(query).toArray({});
      res.send(findNote);
    });

    // delete note based on the id
    app.delete('/api/v1/note/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const deleteNote = await NoteCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (deleteNote.deletedCount === 1) {
          res
            .status(200)
            .json({ successs: true, message: 'Note delete successfully.' });
        } else {
          res.status(404).json({ successs: false, message: 'Note not found.' });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete the note.' });
      }
    });

    // update note data based on the id
    app.patch('/api/v1/note/:id', async (req, res) => {
      const id = req.params.id;
      const { title, description } = req.body;

      try {
        const updateNote = await NoteCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { title, description } }
        );

        if (updateNote.matchedCount === 1 && updateNote.modifiedCount === 1) {
          res.status(200).json({
            success: true,
            message: 'Note update successfully',
          });
        } else {
          res.status(404).json({
            successs: false,
            message: 'Note not found.',
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Fail to update note data.',
        });
      }
    });

    console.log('You successfully connected to MongoDB!');
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('student platform server is on');
});

app.listen(port, () => {
  console.log(`Student server is on ${port}`);
});
