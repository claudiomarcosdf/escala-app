import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';

import AuthProvider from './src/contexts/authContext';
import UsuarioProvider from './src/contexts/usuarioContext';
import CoroinhaProvider from './src/contexts/coroinhaContext';
import EscalaProvider from './src/contexts/escalaContext';
import HorarioProvider from './src/contexts/horarioContext';

export default function escalaapp() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <UsuarioProvider>
          <HorarioProvider>
            <CoroinhaProvider>
              <EscalaProvider>
                <Routes />
              </EscalaProvider>
            </CoroinhaProvider>
          </HorarioProvider>
        </UsuarioProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
