import React, { createContext, useContext, ReactNode } from 'react';
import { getUserTypeConfig, UserTypeConfig } from '../types';

interface UserTypeContextType {
  userType: string;
  config: UserTypeConfig;
  updateUserType: (userType: string) => void;
}

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

interface UserTypeProviderProps {
  children: ReactNode;
  initialUserType: string;
}

export const UserTypeProvider: React.FC<UserTypeProviderProps> = ({ 
  children, 
  initialUserType 
}) => {
  const [userType, setUserType] = React.useState(initialUserType);
  
  const contextValue: UserTypeContextType = {
    userType,
    config: getUserTypeConfig(userType),
    updateUserType: setUserType
  };

  return (
    <UserTypeContext.Provider value={contextValue}>
      {children}
    </UserTypeContext.Provider>
  );
};

export { UserTypeContext };
