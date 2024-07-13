import { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AntDesign } from '@expo/vector-icons';

import { AuthContext } from '../contexts/authContext';
import Login from '../pages/Login';
import Escalas from '../pages/Escalas';
import StackRoutes from '../routes/stackRoutes';
import GeradorEscalas from '../pages/GeradorEscalas';
import Configuracoes from '../pages/Configuracoes';

const Tab = createBottomTabNavigator();

export default function Routes() {
  const { user } = useContext(AuthContext);

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
            return <Feather name='home' color={color} size={size} />;
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
            return <Feather name='list' color={color} size={size} />;
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
            return (
              <MaterialCommunityIcons
                name='play-speed'
                color={color}
                size={size}
              />
            );
          }
        }}
      />

      <Tab.Screen
        name='Configuracoes'
        component={Configuracoes}
        options={{
          headerShown: false,
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color, size }) => {
            return <AntDesign name='setting' size={size} color={color} />;
          }
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
