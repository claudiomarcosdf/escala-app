import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text>HOME</Text>
      </View>
      <View style={styles.boxButtons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.textButtom}>Cadastro de Coroinha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GeradorEscalas')}>
          <Text style={styles.textButtom}>Gerador de Escalas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EscalaIndividual')}>
          <Text style={styles.textButtom}>Escala Individual</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Escalas')}>
          <Text style={styles.textButtom}>Escalas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOut} onPress={() => { }}>
          <Text style={styles.textButtomOut}>Sair do aplicativo</Text>
        </TouchableOpacity>
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
  boxButtons: {
    width: '80%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0984e3',
    borderRadius: 50,
    padding: 20,
    marginBottom: 10
  },
  textButtom: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonOut: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#d63031',
    borderRadius: 50,
    padding: 10,
    marginTop: 20
  },
  textButtomOut: {
    color: '#2f3640',
    fontWeight: '700',
  },
});
