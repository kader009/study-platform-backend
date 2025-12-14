import { getDB } from '../config/database.js';

export const getUserCollection = () => {
  return getDB().collection('user');
};
