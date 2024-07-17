import { useEffect, useState, useContext } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import { AuthContext } from '../../contexts/authContext';

export default function Configuracoes() {
  const [nomeParoquia, setNomeParoquia] = useState(null);
  const [enderecoParoquia, setEnderecoParoquia] = useState(null);
  const { paroquia, salvarParoquia } = useContext(AuthContext);

  useEffect(() => {
    if (paroquia) {
      setNomeParoquia(paroquia.nome);
      setEnderecoParoquia(paroquia.endereco);
    }
  }, []);

  function handleSave() {
    if (!nomeParoquia || !enderecoParoquia) {
      Alert.alert('Atenção', 'Favor informar nome e endereço da Paróquia!');
      return;
    }
    salvarParoquia(nomeParoquia, enderecoParoquia);
    Alert.alert('Sucesso', 'Informações salvas com sucesso!');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaElements}>
        <Text style={styles.titleText}>Configurações</Text>

        <TextInput
          placeholder='Nome da Paróquia'
          style={styles.input}
          value={nomeParoquia}
          onChangeText={(text) => setNomeParoquia(text)}
        />
        <TextInput
          placeholder='Endereço'
          style={styles.input}
          value={enderecoParoquia}
          onChangeText={(text) => setEnderecoParoquia(text)}
        />

        <TouchableOpacity style={styles.btnSalvar} onPress={handleSave}>
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 2,
    backgroundColor: '#F2f6fc'
  },
  boxAreaElements: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2f3640',
    marginBottom: 15
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
    fontSize: 14,
    fontWeight: '600'
  },
  btnSalvar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBotton: 10,
    marginTop: 5,
    borderRadius: 8,
    backgroundColor: '#0984e3',
    backgroundColor: '#0096c7',
    width: '100%'
  }
});
