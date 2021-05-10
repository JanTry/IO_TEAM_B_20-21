import { Session } from '../models/session';

export const addSession = async (sessionData) => {
  return new Session(sessionData).save();
};
