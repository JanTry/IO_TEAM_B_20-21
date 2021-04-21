/* eslint-disable no-unused-vars */
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

interface User {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string | null;
}

interface UserContextValue {
  user: User | null;
  userId: string | null;
  sessionId: string | null;
  accessCode: string | null;
  isLecturer: string | null;
  updateUser: (user: User | null) => void;
  updateUserId: (userId: string) => void;
  updateSessionId: (sessionId: string) => void;
  updateAccessCode: (accessCode: string) => void;
  updateLecturer: (isLecturer: string | null) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  userId: '',
  sessionId: '',
  accessCode: '',
  isLecturer: null,
  updateUser: () => null,
  updateUserId: () => '',
  updateSessionId: () => '',
  updateAccessCode: () => '',
  updateLecturer: () => null,
});

export const UserProvider: React.FunctionComponent = (props) => {
  const { children } = props;
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
  const [sessionId, setSessionId] = useState(sessionStorage.getItem('sessionId'));
  const [accessCode, setAccessCode] = useState(sessionStorage.getItem('accessCode'));
  const [isLecturer, setLecturer] = useState<string | null>(sessionStorage.getItem('isLecturer'));

  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  const updateUserId = useCallback((newUserId: string) => {
    setUserId(newUserId);
  }, []);

  const updateSessionId = useCallback((newSessionId: string) => {
    setSessionId(newSessionId);
  }, []);

  const updateAccessCode = useCallback((newAccessCode: string) => {
    setAccessCode(newAccessCode);
  }, []);

  const updateLecturer = useCallback((lecturerFlag: string | null) => {
    setLecturer(lecturerFlag);
  }, []);

  useEffect(() => {
    updateUser({
      firstName: sessionStorage.getItem('firstName'),
      lastName: sessionStorage.getItem('lastName'),
      email: sessionStorage.getItem('email'),
      role: sessionStorage.getItem('role'),
    });
    updateLecturer(sessionStorage.getItem('isLecturer'));
  }, [sessionStorage.getItem('isLecturer')]);

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        sessionId,
        accessCode,
        isLecturer,
        updateUser,
        updateUserId,
        updateSessionId,
        updateAccessCode,
        updateLecturer,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node,
};

UserProvider.defaultProps = {
  children: null,
};

export const useUser = (): UserContextValue => useContext(UserContext);