import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';

import AuthProvider from './src/contexts/authContext';
import EscalaProvider from './src/contexts/escalaContext';

export default function escalaapp() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <EscalaProvider>
          <Routes />
        </EscalaProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
