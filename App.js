import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';

import AuthProvider from './src/contexts/authContext';
import CoroinhaProvider from './src/contexts/coroinhaContext';
import EscalaProvider from './src/contexts/escalaContext';

export default function escalaapp() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <CoroinhaProvider>
          <EscalaProvider>
            <Routes />
          </EscalaProvider>
        </CoroinhaProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
