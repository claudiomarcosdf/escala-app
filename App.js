import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';

import AuthProvider from './src/contexts/authContext';
import UsuarioProvider from './src/contexts/usuarioContext';
import CoroinhaProvider from './src/contexts/coroinhaContext';
import EscalaProvider from './src/contexts/escalaContext';
import HorarioProvider from './src/contexts/horarioContext';
import HorarioUsuarioProvider from './src/contexts/horariosUsuarioContext';

export default function escalaapp() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <UsuarioProvider>
          <HorarioProvider>
            <HorarioUsuarioProvider>
              <CoroinhaProvider>
                <EscalaProvider>
                  <Routes />
                </EscalaProvider>
              </CoroinhaProvider>
            </HorarioUsuarioProvider>
          </HorarioProvider>
        </UsuarioProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
