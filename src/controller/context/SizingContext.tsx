// SizingContext.tsx


import React, { createContext, useContext, ReactNode, useState } from 'react';

interface SizingContextProps {
  accountName: string;
  opportunityNo: string;
  user: string;
  sameUser: boolean;
  hasRendered: boolean;
  cardIndex: number;
  createIndex: boolean;
  usecaseSelected : string;

  setSizingData: (accountName: string, opportunityNo: string) => void;
  setUserData: (user: string) => void;
  setSameUserData: (sameUser: boolean) => void;
  setHasRendered: (hasRendered: boolean) => void;
  setCardIndex: (cardIndex: number) => void;
  setCreateIndex: (createIndex: boolean) => void;
  setUsecaseSelected: (usecaseSelected: string) => void;
}

const SizingContext = createContext<SizingContextProps | undefined>(undefined);

interface SizingProviderProps {
  children: ReactNode;
}


let sizingDataSetter: ((accountName: string, opportunityNo: string) => void) | null = null;

let userDataSetter: ((user: string) => void) | null = null;

let sameUserDataSetter: ((sameUser: boolean) => void) | null = null;

let hasRenderedSetter: ((hasRendered: boolean) => void) | null = null;

let cardIndexSetter: ((cardIndex: number) => void) | null = null;

let createIndexSetter: ((createIndex: boolean) => void) | null = null;

let usecaseSelectedSetter: ((usecaseSelected: string) => void) | null = null;

export const SizingProvider: React.FC<SizingProviderProps> = ({ children }) => {
  const [accountName, setAccountName] = useState('');
  const [opportunityNo, setOpportunityNo] = useState('');
  const [user, setUser] = useState('');
  const [sameUser, setSameUser] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [createIndex, setCreateIndex] = useState(false);
  const [usecaseSelected, setUsecaseSelected] = useState('');


  const setSizingData = (newAccountName: string, newOpportunityNo: string) => {
    setAccountName(newAccountName);
    setOpportunityNo(newOpportunityNo);
  };

  const setUserData = (newUser: string) => {
    setUser(newUser);

  };

  const setSameUserData = (newUser: boolean) => {
    setSameUser(newUser);

  };

  const setHasRenderedData = (newHasRendered: boolean) => {
    setHasRendered(newHasRendered);

  };

  const setCardIndexData = (newCardIndex: number) => {
    setCardIndex(newCardIndex);

  };

  const setCreateIndexData = (newCreateIndex: boolean) => {
    setCreateIndex(newCreateIndex);

  };

  const setUsecaseSelectedData = (newUsecaseSelected: string) => {
    setUser(usecaseSelected);

  };

  // Store the setSizingData function in the sizingDataSetter variable
  sizingDataSetter = setSizingData;

  userDataSetter = setUserData;

  sameUserDataSetter = setSameUserData;

  hasRenderedSetter = setHasRenderedData;

  cardIndexSetter = setCardIndex;

  createIndexSetter = setCreateIndex;

  usecaseSelectedSetter = setUsecaseSelectedData;

  return (
    <SizingContext.Provider value={{ accountName, opportunityNo, user, sameUser, hasRendered, cardIndex, createIndex,usecaseSelected,  setSizingData, setUserData, setSameUserData, setHasRendered, setCardIndex, setCreateIndex, setUsecaseSelected }}>
      {children}
    </SizingContext.Provider>
  );
};

export const useSizingContext = () => {
  const context = useContext(SizingContext);
  if (!context) {
    throw new Error('useSizingContext must be used within a SizingProvider');
  }
  return context;
};

export {  sizingDataSetter, userDataSetter, sameUserDataSetter, hasRenderedSetter, cardIndexSetter, createIndexSetter, usecaseSelectedSetter };
