/* eslint-disable no-unused-vars */
import React, { useState, createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

interface User {
  email: string;
  role: string;
}

interface UserContextValue {
  user: User | null;
  updateUser: (arg0: User | null) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  updateUser: () => null,
});

export const UserProvider: React.FunctionComponent = (props) => {
  const { children } = props;
  const [user, setUser] = useState<User | null>(null);

  const updateUser = useCallback((userToUpdate: User | null) => {
    setUser(userToUpdate);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
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
