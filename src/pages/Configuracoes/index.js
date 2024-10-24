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

import AppStyles from '../../appStyles';
import { AuthContext } from '../../contexts/authContext';

export default function Configuracoes() {
  const [nomeParoquia, setNomeParoquia] = useState(null);
  const [enderecoParoquia, setEnderecoParoquia] = useState(null);
  const [qtdePessoasVoluntarias, setQtdePessoasCandidatas] = useState(null);
  const [qtdeCoroinhasPorHorario, setQtdeCoroinhasPorHorario] = useState(null);
  const [qtdeMescesPorHorario, setQtdeMescesPorHorario] = useState(null);
  const [qtdeCerimoniariosPorHorario, setQtdeCerimoniariosPorHorario] =
    useState(null);
  const { paroquiaconfig, salvarParoquiaConfig } = useContext(AuthContext);

  useEffect(() => {
    if (paroquiaconfig) {
      setNomeParoquia(paroquiaconfig.nome);
      setEnderecoParoquia(paroquiaconfig.endereco);
      setQtdePessoasCandidatas(paroquiaconfig.qtdePessoasVoluntarias);
      setQtdeCoroinhasPorHorario(paroquiaconfig.qtdeCoroinhasPorHorario);
      setQtdeMescesPorHorario(paroquiaconfig.qtdeMescesPorHorario);
      setQtdeCerimoniariosPorHorario(
        paroquiaconfig.qtdeCerimoniariosPorHorario
      );
    }
  }, []);

  async function handleSave() {
    if (!nomeParoquia || !enderecoParoquia) {
      Alert.alert('Atenção', 'Favor informar nome e endereço da Paróquia!');
      return;
    }
    salvarParoquiaConfig(
      nomeParoquia,
      enderecoParoquia,
      qtdePessoasVoluntarias,
      qtdeCerimoniariosPorHorario,
      qtdeCoroinhasPorHorario,
      qtdeMescesPorHorario
    );
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
          style={[styles.input, { marginBottom: 30 }]}
          value={enderecoParoquia}
          onChangeText={(text) => setEnderecoParoquia(text)}
        />
        <View style={styles.boxQtde}>
          <Text>Qtde máxima de pessoas voluntárias por horário</Text>
        </View>
        <TextInput
          placeholder='Qtde pessoas por horário'
          style={styles.input}
          value={qtdePessoasVoluntarias}
          onChangeText={(text) => setQtdePessoasCandidatas(text)}
          keyboardType='numeric'
        />

        <View style={styles.boxQtde}>
          <Text>Qtde máxima de Cerimoniário por horário</Text>
        </View>
        <TextInput
          placeholder='Qtde mesces por horário'
          style={[styles.input, { marginBottom: 30 }]}
          value={qtdeCerimoniariosPorHorario}
          onChangeText={(text) => setQtdeCerimoniariosPorHorario(text)}
          keyboardType='numeric'
        />

        <View style={styles.boxQtde}>
          <Text>Qtde máxima de Coroinhas por horário</Text>
        </View>
        <TextInput
          placeholder='Qtde coroinhas por horário'
          style={styles.input}
          value={qtdeCoroinhasPorHorario}
          onChangeText={(text) => setQtdeCoroinhasPorHorario(text)}
          keyboardType='numeric'
        />

        <View style={styles.boxQtde}>
          <Text>Qtde máxima de Mesces por horário</Text>
        </View>
        <TextInput
          placeholder='Qtde mesces por horário'
          style={styles.input}
          value={qtdeMescesPorHorario}
          onChangeText={(text) => setQtdeMescesPorHorario(text)}
          keyboardType='numeric'
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
    backgroundColor: AppStyles.color.background
  },
  boxAreaElements: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 25
  },
  input: {
    color: AppStyles.color.primary,
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
    backgroundColor: AppStyles.color.primary,
    borderWidth: 1.4,
    borderColor: AppStyles.color.secondary,
    marginBotton: 10,
    marginTop: 30,
    borderRadius: 8,
    width: '100%'
  },
  boxQtde: {
    backgroundColor: '#74b9ff',
    paddingHorizontal: 3,
    marginBottom: 3,
    borderRadius: 3
  }
});
