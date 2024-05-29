import React, { createContext, useContext, useEffect, useState, ReactNode, FC } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../store';  // Actualizează calea în funcție de structura proiectului tău
import { User } from '../App';  // Actualizează calea în funcție de structura proiectului tău

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/profile', {
          withCredentials: true,
        });
        const userData = {
          id: res.data._id,
          username: res.data.username,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          color: res.data.color,
        };
        setUser(userData);
        dispatch(setCurrentUser(userData));
      } catch (err) {
        console.log(err);
      }
    };

    checkAuth();
  }, []);

  const authContextValue: AuthContextType = {
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
