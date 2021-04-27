/* eslint-disable no-unused-vars */
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

interface User {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string | null;
  userId: string | null;
}

interface UserContextValue {
  user: User | null;
  username: string | null;
  sessionId: string | null;
  accessCode: string | null;
  isLecturer: string | null;
  updateUser: (user: User | null) => void;
  updateUsername: (username: string) => void;
  updateSessionId: (sessionId: string) => void;
  updateAccessCode: (accessCode: string) => void;
  updateLecturer: (isLecturer: string | null) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  username: '',
  sessionId: '',
  accessCode: '',
  isLecturer: null,
  updateUser: () => null,
  updateUsername: () => '',
  updateSessionId: () => '',
  updateAccessCode: () => '',
  updateLecturer: () => null,
});

export const UserProvider: React.FunctionComponent = (props) => {
  const { children } = props;
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [sessionId, setSessionId] = useState(sessionStorage.getItem('sessionId'));
  const [accessCode, setAccessCode] = useState(sessionStorage.getItem('accessCode'));
  const [isLecturer, setLecturer] = useState<string | null>(sessionStorage.getItem('isLecturer'));

  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  const updateUsername = useCallback((newUsername: string) => {
    setUsername(newUsername);
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
      userId: sessionStorage.getItem('userId'),
    });
    updateLecturer(sessionStorage.getItem('isLecturer'));
  }, [sessionStorage.getItem('isLecturer')]);

  return (
    <UserContext.Provider
      value={{
        user,
        username,
        sessionId,
        accessCode,
        isLecturer,
        updateUser,
        updateUsername,
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
