import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Escalas from '../pages/Escalas';
import StackRoutes from '../routes/stackRoutes';
import GeradorEscalas from '../pages/GeradorEscalas';

const Tab = createBottomTabNavigator();

export default function Routes() {
  const [user, setUser] = useState('Claudio');

  if (!user) {
    return <Login />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          borderTopWidth: 0
        }
      }}
    >
      <Tab.Screen
        name='StackHome'
        component={StackRoutes}
        options={{
          headerShown: false,
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => {
            return <Feather name="home" color={color} size={size} />
          }
        }}
      />

      <Tab.Screen
        name='Escalas'
        component={Escalas}
        options={{
          headerShown: false,
          tabBarLabel: 'Escalas',
          tabBarIcon: ({ color, size }) => {
            return <Feather name="list" color={color} size={size} />
          }
        }}
      />

      <Tab.Screen
        name='GeradorEscalas'
        component={GeradorEscalas}
        options={{
          headerShown: false,
          tabBarLabel: 'Gerador',
          tabBarIcon: ({ color, size }) => {
            return <MaterialCommunityIcons name="play-speed" color={color} size={size} />
          }
        }}
      />


    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({

});
