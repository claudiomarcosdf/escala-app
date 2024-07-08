import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';

import Login from './src/pages/Login';

export default function escalaapp() {
  const [user, setUser] = useState('Claudio');

  if (!user) {
    return <Login />;
  }

  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer >
  );
}

