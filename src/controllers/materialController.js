import { ObjectId } from 'mongodb';
import { getMaterialCollection } from '../models/materialModel.js';
import { getBookedCollection } from '../models/bookedModel.js';

// Create material
export const createMaterial = async (req, res) => {
  try {
    const material = req.body;
    const saveMaterial = await getMaterialCollection().insertOne(material);
    res.send(saveMaterial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create material' });
  }
};

// Get all materials
export const getAllMaterials = async (req, res) => {
  try {
    const getAllmaterial = await getMaterialCollection().find().toArray();
    res.send(getAllmaterial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch materials' });
  }
};

// Get materials by tutor email
export const getMaterialsByEmail = async (req, res) => {
  const email = req.params.email;
  const query = { TutorEmail: email };
  try {
    const sessionMaterial = await getMaterialCollection().find(query).toArray();
    res.send(sessionMaterial);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'server error', error });
  }
};

// Delete material
export const deleteMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteMaterial = await getMaterialCollection().deleteOne({
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
};

// Update material
export const updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { TutorEmail, UploadImages, GoogledriveLink } = req.body;

  const updateData = {};
  if (TutorEmail) updateData.TutorEmail = TutorEmail;
  if (UploadImages) updateData.UploadImages = UploadImages;
  if (GoogledriveLink) updateData.GoogledriveLink = GoogledriveLink;

  try {
    const updateMaterial = await getMaterialCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );
    if (updateMaterial.matchedCount === 0) {
      res.status(404).json({ message: 'material not found.' });
    }

    res.json({ message: 'material update successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update material.' });
  }
};

// Get materials by session ID (with count)
export const getMaterialsBySessionId = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const materials = await getMaterialCollection()
      .find({ SessionId: sessionId })
      .toArray();

    res.status(200).json({
      sessionId,
      count: materials.length,
      materials,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch materials for session' });
  }
};

// Get all materials from student's booked sessions
export const getStudentMaterials = async (req, res) => {
  const { email } = req.params;

  try {
    // Find all bookings for this student
    const bookedSessions = await getBookedCollection()
      .find({ studentEmail: email })
      .toArray();

    if (!bookedSessions || bookedSessions.length === 0) {
      return res.status(404).json({
        message: 'No booked sessions found for this student',
        totalMaterials: 0,
        sessions: [],
      });
    }

    const sessionIds = bookedSessions.map((b) => b.sessionId);

    // Fetch materials for these sessions
    const materials = await getMaterialCollection()
      .find({ SessionId: { $in: sessionIds } })
      .toArray();

    // Group materials by sessionId
    const materialsBySession = sessionIds.map((sid) => {
      const sessionMaterials = materials.filter((m) => m.SessionId === sid);
      return {
        sessionId: sid,
        materialCount: sessionMaterials.length,
        materials: sessionMaterials,
      };
    });

    res.status(200).json({
      studentEmail: email,
      totalBookedSessions: sessionIds.length,
      totalMaterials: materials.length,
      sessions: materialsBySession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch student materials' });
  }
};

export const getMaterialById = async (req, res) => {
  const { id } = req.params;
  try {
    const material = await getMaterialCollection().findOne({
      _id: new ObjectId(id),
    });
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.status(200).json({
      message: 'Material fetched successfully',
      material,
    });
  } catch (error) {
    console.error('Error fetching material by ID', error);
    res.status(500).json({ error: 'internal server error' });
  }
};

export const getMaterialBySessionId = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const material = await getMaterialCollection().findOne({
      SessionId: sessionId,
    });
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.status(200).json({
      message: 'Material fetched successfully',
      material,
    });
  } catch (error) {
    console.error('Error fetching material by session ID', error);
    res.status(500).json({ error: 'internal server error' });
  }
};
