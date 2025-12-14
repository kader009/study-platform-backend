import { getDB } from '../config/database.js';

export const getMaterialCollection = () => {
  return getDB().collection('material');
};
