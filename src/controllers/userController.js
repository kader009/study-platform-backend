import { ObjectId } from 'mongodb';
import { getUserCollection } from '../models/userModel.js';

// Create user
export const createUser = async (req, res) => {
  const data = req.body;
  const email = data.email;
  try {
    const existingUser = await getUserCollection().findOne({ email });

    if (existingUser) {
      return res.status(409).send({
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

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, photoUrl } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const userData = {};
  if (name) userData.name = name;
  if (photoUrl) userData.photoUrl = photoUrl;

  if (Object.keys(userData).length === 0) {
    return res.status(400).json({ message: 'No data provided for update' });
  }

  try {
    const result = await getUserCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: userData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await getUserCollection().findOne({
      _id: new ObjectId(id),
    });
    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};
