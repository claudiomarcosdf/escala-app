import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Keyboard } from 'react-native';

import ItemListaCoroinha from '../../components/ItemListaCoroinha';

const coroinhas = [
  { key: 1, nome: 'Therezinha', celular: '99236-4764' },
  { key: 2, nome: 'João Pedro', celular: '99236-4764' },
  { key: 3, nome: 'Othor', celular: '99236-4764' },
  { key: 4, nome: 'Salete', celular: '99236-4764' },
  { key: 5, nome: 'Mão Diná', celular: '99236-4764' },
  { key: 6, nome: 'Mão Diná', celular: '99236-4764' },
  { key: 7, nome: 'Mão Diná', celular: '99236-4764' },
  { key: 8, nome: 'Mão Diná', celular: '99236-4764' },
  { key: 9, nome: 'Mão Diná', celular: '99236-4764' },
]

export default function Cadastro() {
  const [nome, setNome] = useState(null);
  const [celular, setCelular] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaCadastro}>
        <Text style={styles.titleText}>Cadastro de Coroinha</Text>

        <TextInput
          placeholder='Nome'
          style={styles.input}
          value={nome}
          onChangeText={(text) => setNome(text)}
        />
        <TextInput
          placeholder='Celular'
          style={styles.input}
          value={celular}
          onChangeText={(text) => setCelular(text)}
        />

        <TouchableOpacity style={styles.btnCadastrar} onPress={() => { }}>
          <Text style={styles.btnText}>
            Cadastrar
          </Text>
        </TouchableOpacity>

        <FlatList
          style={styles.list}
          keyExtractor={item => item.key}
          data={coroinhas}
          renderItem={({ item }) => (<ItemListaCoroinha data={item} />)}
        />
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
  },
  boxAreaCadastro: {
    flex: 1,
    alignItems: 'center',
    padding: 30
  },
  titleText: {
    fontSize: 16,
    color: '#2f3640',
    marginBottom: 20
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: '#747d8c',
    width: '100%'
  },
  btnText: {
    color: '#FFF',
    fontSize: 14
  },
  btnCadastrar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBotton: 10,
    marginTop: 5,
    backgroundColor: '#0984e3',
    width: '100%',
  },
  list: {
    width: '100%',
    marginTop: 15,
    backgroundColor: '#dfe4ea',
  }
});
