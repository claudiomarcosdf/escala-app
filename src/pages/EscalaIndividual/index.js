import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import filter from 'lodash.filter';
import firebase from '../../firebaseConfig';

import AppStyles from '../../appStyles';
import { PessoaContext } from '../../contexts/pessoaContext';
import ItemListaPessoaEscala from '../../components/ItemListaPessoaEscala';
import ModalEscala from '../../components/ModalEscala';

export default function EscalaIndividual() {
  const { pessoas: todasPessoas, loading } = useContext(PessoaContext);
  const [pessoas, setPessoas] = useState([]);
  const [pessoaSelecionado, setPessoaSelecionado] = useState(null);
  const [key, setKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pessoasFiltered, setPessoasFiltered] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const pessoasAtivas = todasPessoas.filter(
      (pessoa) => pessoa.ativo == true && pessoa.tipo != 'Administrador'
    );
    setPessoas(pessoasAtivas);
    setPessoasFiltered(pessoasAtivas);
  }, [todasPessoas]);

  function handleSearch(query) {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(pessoasFiltered, (pessoa) => {
      if (pessoa.nome.toLowerCase().includes(formattedQuery)) return true;
      return false;
    });
    setPessoas(filteredData);
  }

  function handleSelectPessoa(data) {
    setPessoaSelecionado(data);
    setModalVisible(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaCadastro}>
        <Text style={styles.titleText}>Cadastro de Escala Individual</Text>

        <View style={{ width: '100%', marginTop: 15 }}>
          <TextInput
            placeholder='Pesquisar...'
            placeholderTextColor='#ccc'
            clearButtonMode='always'
            style={styles.textPesquisar}
            autoCapitalize='none'
            autoCorrect={false}
            underlineColorAndroid='transparent'
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
          />
        </View>

        <View style={styles.boxTotalPessoas}>
          <Text style={styles.textTotal}>Pessoas aptas: </Text>
          <Text style={[styles.textTotal, { fontWeight: '700' }]}>
            {pessoas.length != 0 ? pessoas.length : 0}
          </Text>
        </View>

        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.key}
          data={pessoas}
          renderItem={({ item }) => (
            <ItemListaPessoaEscala
              data={item}
              selectPessoa={handleSelectPessoa}
            />
          )}
          ListEmptyComponent={
            loading ? (
              <View style={styles.textMessage}>
                <Text style={styles.textMessage}>Carregando...</Text>
              </View>
            ) : (
              <View style={styles.textMessage}>
                <Text style={{ fontSize: 14, color: AppStyles.color.danger }}>
                  Nenhuma pessoa cadastrada!
                </Text>
              </View>
            )
          }
        />

        <ModalEscala
          visible={modalVisible}
          setVisible={setModalVisible}
          pessoa={pessoaSelecionado}
        />
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
  boxAreaCadastro: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15
  },
  boxTotalPessoas: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    marginBottom: 3,
    paddingHorizontal: 5
  },
  textPesquisar: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10
  },
  textTotal: { fontSize: 12, color: AppStyles.color.blueLightColor },
  list: {
    width: '100%',
    marginTop: 3,
    padding: 5,
    borderRadius: 8,
    backgroundColor: AppStyles.color.secondary
  },
  textMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  }
});
