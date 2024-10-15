import { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthContext } from '../../contexts/authContext';

export default function Home() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.areaButtons}>
        <View style={styles.boxButtons}>
          <View style={styles.title}>
            <Text style={{ fontWeight: '600' }}>MENU</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <FontAwesome6
              name='person-praying'
              size={30}
              color='#fff'
              style={{ marginRight: 25 }}
            />
            <Text style={styles.textButtom}>Cadastro de Coroinha</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CadastroHorarios')}
          >
            <MaterialCommunityIcons
              name='calendar-clock'
              size={30}
              color='#fff'
              style={{ marginRight: 25 }}
            />
            <Text style={styles.textButtom}>Horários das Missas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('GeradorEscalas')}
          >
            <MaterialCommunityIcons
              name='timer-cog-outline'
              size={30}
              color='#fff'
              style={{ marginRight: 25 }}
            />
            <Text style={styles.textButtom}>Gerador de Escalas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EscalaIndividual')}
          >
            <MaterialCommunityIcons
              name='calendar-account'
              size={30}
              color='#fff'
              style={{ marginRight: 25 }}
            />
            <Text style={styles.textButtom}>Escala Individual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Escalas')}
          >
            <MaterialCommunityIcons
              name='calendar-month'
              size={30}
              color='#fff'
              style={{ marginRight: 25 }}
            />
            <Text style={styles.textButtom}>Escalas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOut} onPress={() => logout()}>
            <Text style={styles.textButtomOut}>Sair do aplicativo</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingBottom: 5 }}>
        <Text style={styles.developer}>
          Desenvolvido por Claudio Marcos - (61) 99976-3771
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    alignItems: 'center',
    marginBottom: 20
  },
  areaButtons: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxButtons: {
    flex: 1,
    width: '100%',
    justifyContent: 'center'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 2,
    backgroundColor: '#0096c7',
    padding: 25,
    marginBottom: 4
  },
  textButtom: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  buttonOut: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ced6e0',
    backgroundColor: '#fff',
    borderRadius: 2,
    padding: 10,
    marginTop: 20
  },
  textButtomOut: {
    color: '#2f3640',
    color: '#0096c7',
    fontWeight: '600'
  },
  developer: { fontSize: 9, fontStyle: 'italic', color: '#2d3436' }
});
