import { getDB } from '../config/database.js';

export const getNoteCollection = () => {
  return getDB().collection('note');
};
