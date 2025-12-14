import { ObjectId } from 'mongodb';
import { getBookedCollection } from '../models/bookedModel.js';
import { getSessionCollection } from '../models/sessionModel.js';
import { getMaterialCollection } from '../models/materialModel.js';

// Book a session
export const bookSession = async (req, res) => {
  const { sessionId, studentEmail, registrationFee, tutorEmail } = req.body;

  try {
    const session = await getSessionCollection().findOne({
      _id: new ObjectId(sessionId),
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const result = await getBookedCollection().insertOne({
      sessionId,
      studentEmail,
      registrationFee,
      tutorEmail,
      status: 'booked',
      bookedAt: new Date(),
    });

    if (result.insertedId) {
      return res.status(200).json({
        message: 'Booking added successfully',
        insertedId: result.insertedId,
      });
    } else {
      return res.status(500).json({
        error: ' failed to insert booking data in to the database',
      });
    }
  } catch (error) {
    console.error('Error in booking session', error);
    res.status(500).json({ error: 'internal server error' });
  }
};

// Get booked sessions by student email
export const getBookedSessionsByEmail = async (req, res) => {
  const email = req.params.email;
  const query = { studentEmail: email };
  try {
    const getBooked = await getBookedCollection().find(query).toArray();
    res.send(getBooked);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch booked sessions' });
  }
};

// Get booked session by ID
export const getBookedSessionById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = { SessionId: id };
    const session = await getMaterialCollection().find(query).toArray();
    console.log('sessionId', session);

    if (!session || session.length === 0) {
      return res.status(404).json({
        message: 'session not found',
      });
    }

    res.status(200).json({ msessage: 'session fetch successfully', session });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'failed to get booked session',
    });
  }
};
