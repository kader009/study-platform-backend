import { ObjectId } from 'mongodb';
import { getNoteCollection } from '../models/noteModel.js';

// Create note
export const createNote = async (req, res) => {
  try {
    const NoteData = req.body;
    const noteSend = await getNoteCollection().insertOne(NoteData);
    res.send(noteSend);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create note' });
  }
};

// Get notes by email
export const getNotesByEmail = async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  try {
    const findNote = await getNoteCollection().find(query).toArray({});
    res.send(findNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteNote = await getNoteCollection().deleteOne({
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
};

// Update note
export const updateNote = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  try {
    const updateNote = await getNoteCollection().updateOne(
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
};
