import { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/authContext';

export default function Home() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.areaButtons}>
        <View style={styles.boxButtons}>
          <View style={styles.title}>
            <Text>HOME</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.textButtom}>Cadastro de Coroinha</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('GeradorEscalas')}
          >
            <Text style={styles.textButtom}>Gerador de Escalas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EscalaIndividual')}
          >
            <Text style={styles.textButtom}>Escala Individual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Escalas')}
          >
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
    fontWeight: '700',
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
    width: '90%',
    justifyContent: 'center'
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#0984e3',
    borderWidth: 1,
    borderColor: '#18dcff',
    borderRadius: 50,
    padding: 15,
    marginBottom: 10
  },
  textButtom: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  buttonOut: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ced6e0',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    marginTop: 20
  },
  textButtomOut: {
    color: '#2f3640',
    color: '#0984e3',
    fontWeight: '700'
  },
  developer: { fontSize: 9, fontStyle: 'italic', color: '#2d3436' }
});
