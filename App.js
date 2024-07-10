import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';

import Login from './src/pages/Login';
import EscalaProvider from './src/contexts/escalaContext';

export default function escalaapp() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login changeStatus={(user) => setUser(user)} />;
  }

  return (
    <NavigationContainer>
      <EscalaProvider>
        <Routes />
      </EscalaProvider>
    </NavigationContainer >
  );
}

