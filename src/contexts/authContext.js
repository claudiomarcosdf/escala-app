import { createContext, useState } from 'react';

export const AuthContext = createContext({});

function authProvider({ children }) {

  return (
    <AuthContext>
      {children}
    </AuthContext>
  )
}