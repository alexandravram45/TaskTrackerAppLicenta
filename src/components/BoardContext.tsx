import React, { ReactNode, createContext, useContext } from 'react';
import { Board } from './Home';

interface BoardContextType {
  selectedBoard: Board | null;
  setSelectedBoard: (board: Board | null) => void; // Function to update selectedBoard

}

interface BoardProviderProps {
    selectedBoard: Board | null;
    setSelectedBoard: (board: Board | null) => void; // Function to update selectedBoard

    children: ReactNode; // Define children as a prop
  }

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

export const BoardProvider: React.FC<BoardProviderProps> = ({ children, selectedBoard, setSelectedBoard }) => {

    
    return (
    <BoardContext.Provider value={{ selectedBoard, setSelectedBoard }}>
      {children}
    </BoardContext.Provider>
  );
};
