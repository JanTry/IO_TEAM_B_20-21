/* eslint-disable no-unused-vars */
import React, { useState, createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

interface User {
  email: string;
  role: string;
}

interface UserContextValue {
  user: User | null;
  userId: string;
  sessionId: string;
  accessCode: string;
  updateUser: (user: User | null) => void;
  updateUserId: (userId: string) => void;
  updateSessionId: (sessionId: string) => void;
  updateAccessCode: (accessCode: string) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  userId: '',
  sessionId: '',
  accessCode: '',
  updateUser: () => null,
  updateUserId: () => '',
  updateSessionId: () => '',
  updateAccessCode: () => '',
});

export const UserProvider: React.FunctionComponent = (props) => {
  const { children } = props;
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [accessCode, setAccessCode] = useState('');

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
    setAccessCode(accessCode);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        sessionId,
        accessCode,
        updateUser,
        updateUserId,
        updateSessionId,
        updateAccessCode,
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
