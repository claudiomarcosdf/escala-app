import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';

import AuthProvider from './src/contexts/authContext';
import PessoaProvider from './src/contexts/pessoaContext';
import EscalaProvider from './src/contexts/escalaContext';
import HorarioProvider from './src/contexts/horarioContext';
import HorarioPessoaProvider from './src/contexts/horariosPessoaContext';

export default function escalaapp() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <PessoaProvider>
          <HorarioProvider>
            <HorarioPessoaProvider>
              <EscalaProvider>
                <Routes />
              </EscalaProvider>
            </HorarioPessoaProvider>
          </HorarioProvider>
        </PessoaProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
