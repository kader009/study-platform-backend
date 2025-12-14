import { getDB } from '../config/database.js';

export const getBookedCollection = () => {
  return getDB().collection('booked');
};
