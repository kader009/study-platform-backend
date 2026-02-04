import { ObjectId } from 'mongodb';
import { getSessionCollection } from '../models/sessionModel.js';

// Get all sessions
export const getAllSessions = async (req, res) => {
  try {
    const sessiondata = await getSessionCollection().find().toArray();
    res.send(sessiondata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

// Create new session
export const createSession = async (req, res) => {
  try {
    const SessionPost = req.body;
    const result = await getSessionCollection().insertOne(SessionPost);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create session' });
  }
};

// Get approved sessions only
export const getApprovedSessions = async (req, res) => {
  try {
    const Approvesession = await getSessionCollection()
      .find({ status: 'approved' })
      .toArray();
    res.status(200).send(Approvesession);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch approved sessions' });
  }
};

// Get approved sessions by tutor email
export const getApprovedSessionsByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const query = { tutorEmail: email, status: 'approved' };
    const Approvesession = await getSessionCollection().find(query).toArray();
    res.status(200).send(Approvesession);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch approved sessions' });
  }
};

// Get single session by ID
export const getSessionById = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid session ID format' });
  }

  try {
    const sessiondata = await getSessionCollection().findOne({
      _id: new ObjectId(id),
    });

    if (!sessiondata) {
      return res.status(404).send({ message: 'Session not found' });
    }

    res.send(sessiondata);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).send({ message: 'Server error' });
  }
};

// Delete session by ID
export const deleteSession = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteNote = await getSessionCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteNote.deletedCount === 1) {
      res
        .status(200)
        .json({ successs: true, message: 'session delete successfully.' });
    } else {
      res.status(404).json({ successs: false, message: 'session not found.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete the session.' });
  }
};

// Approve session
export const approveSession = async (req, res) => {
  const { id } = req.params;

  try {
    const updateSession = await getSessionCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'approved' } },
    );
    if (updateSession.matchedCount === 0) {
      res.status(404).json({ message: 'session not found.' });
    }

    res.json({ message: 'session update successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to approve session.' });
  }
};

// Get sessions by tutor email
export const getSessionsByTutorEmail = async (req, res) => {
  const email = req.params.email;
  const query = { tutorEmail: email };
  try {
    const sessionFortutor = await getSessionCollection().find(query).toArray();
    res.send(sessionFortutor);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'server error', error });
  }
};

// Update session registration fee
export const updateSessionFee = async (req, res) => {
  const { id } = req.params;
  const { registrationFee } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  try {
    const existingSession = await getSessionCollection().findOne({
      _id: new ObjectId(id),
    });

    if (!existingSession) {
      res.status(404).json({ message: 'session not found' });
    }

    const updateSession = await getSessionCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { registrationFee } },
    );

    if (updateSession.matchedCount === 0) {
      return res.status(404).json({ message: 'session not found' });
    }

    const updatedSession = await getSessionCollection().findOne({
      _id: new ObjectId(id),
    });

    res
      .status(200)
      .json({ message: 'session update successfully', updatedSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'failed to update session' });
  }
};

export const getBookedStudentByEmail = async (req, res) => {
  const email = req.params.email;
  const query = { studentEmail: email };
  try {
    const bookedStudents = await getSessionCollection().find(query).toArray();

    if (!bookedStudents || bookedStudents.length === 0) {
      return res.status(404).json({ message: 'No booked students found' });
    }

    res.status(200).json({
      message: 'Booked students fetched successfully',
      count: bookedStudents.length,
      bookedStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch booked students' });
  }
};
