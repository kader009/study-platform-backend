import { ObjectId } from 'mongodb';
import { getUserCollection } from '../models/userModel.js';

// Create user
export const createUser = async (req, res) => {
  const data = req.body;
  const email = data.email;
  try {
    const existingUser = await getUserCollection().findOne({ email });

    if (existingUser) {
      res.status(409).send({
        successs: false,
        message: 'Email already exist in the database',
      });
    }
    const result = await getUserCollection().insertOne(data);
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
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const allUser = await getUserCollection().find().toArray();
    res.send(allUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get single tutor
export const getSingleTutor = async (req, res) => {
  const email = req.user.email;

  try {
    const tutor = await getUserCollection().findOne({ email, role: 'tutor' });

    if (!tutor) {
      return res.status(404).json({ message: 'tutor not found' });
    }

    res.json(tutor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Interval server error.' });
  }
};

// Update user role to admin
export const updateUserRole = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updateRole = { $set: { role: 'admin' } };
  try {
    const allUser = await getUserCollection().updateOne(query, updateRole);
    res.send(allUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

// Get all tutors
export const getAllTutors = async (req, res) => {
  const tutor = { role: 'tutor' };
  try {
    const Tutorresponse = await getUserCollection().find(tutor).toArray();
    res.send(Tutorresponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tutors' });
  }
};
