import { getDB } from '../config/database.js';

export const getSessionCollection = () => {
  return getDB().collection('session');
};
