import { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
import EscolhaHorarios from '../pages/EscolhaHorarios';

const Tab = createBottomTabNavigator();

export default function Routes() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <Login />;
  }

  const LogoutComponent = () => {
    return null;
  };

  if (user.tipo !== 'Administrador') {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: '#e55039',
          tabBarStyle: {
            borderTopWidth: 0
          }
        }}
      >
        <Tab.Screen
          name='Candidatese'
          component={EscolhaHorarios}
          options={{
            headerShown: false,
            tabBarLabel: 'Candidate-se',
            tabBarIcon: ({ color, size }) => {
              return (
                <MaterialCommunityIcons
                  name='update'
                  size={size}
                  color={color}
                />
              );
            }
          }}
        />
        <Tab.Screen
          name='Logout'
          component={LogoutComponent}
          options={{
            headerShown: false,
            tabBarLabel: 'Sair',
            tabBarButton: () => (
              <TouchableOpacity onPress={() => logout()}>
                <View style={styles.BtnLogout}>
                  <Feather name='log-out' size={24} color='#e55039' />
                  <Text style={styles.TextLogout}>Sair</Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#0096c7',
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

const styles = StyleSheet.create({
  BtnLogout: {
    paddingRight: 15,
    marginTop: 7
  },
  TextLogout: {
    fontSize: 10,
    color: '#e55039',
    marginTop: 4
  }
});
