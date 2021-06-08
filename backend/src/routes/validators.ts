import { CustomValidator } from 'express-validator';
import { Quiz } from '../database/models/quiz';
import { Session } from '../database/models/session';

export const quizIdValidator: CustomValidator = async (quizId) => {
  return new Promise<void>((resolve, reject) => {
    Quiz.findOne({ _id: quizId }).then((res: any) => {
      if (res != null) resolve();
      else reject();
    });
  });
};

export const sessionIdValidator: CustomValidator = async (sessionId) => {
  return new Promise<void>((resolve, reject) => {
    Session.findOne({ _id: sessionId }).then((res: any) => {
      if (res != null) resolve();
      else reject();
    });
  });
};
