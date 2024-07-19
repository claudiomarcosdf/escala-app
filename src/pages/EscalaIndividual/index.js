import { useState, useContext } from 'react';
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

import { CoroinhaContext } from '../../contexts/coroinhaContext';
import firebase from '../../firebaseConfig';
import ItemListaCoroinhaEscala from '../../components/ItemListaCoroinhaEscala';
import ModalEscala from '../../components/ModalEscala';

export default function EscalaIndividual() {
  const { coroinhas, setCoroinhas } = useContext(CoroinhaContext);
  const [coroinhaSelecionado, setCoroinhaSelecionado] = useState(null);
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [coroinhasFiltered, setCoroinhasFiltered] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  function handleSearch(query) {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(coroinhasFiltered, (coroinha) => {
      if (coroinha.nome.toLowerCase().includes(formattedQuery)) return true;
      return false;
    });

    setCoroinhas(filteredData);
  }

  function handleSelectCoroinha(data) {
    setCoroinhaSelecionado(data);
    setModalVisible(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaCadastro}>
        <Text style={styles.titleText}>Cadastro de Escala Individual</Text>

        <View style={{ width: '100%', marginTop: 15 }}>
          <TextInput
            placeholder='Pesquisar'
            clearButtonMode='always'
            style={styles.textPesquisar}
            autoCapitalize='none'
            autoCorrect={false}
            underlineColorAndroid='transparent'
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
          />
        </View>

        <View style={styles.boxTotalCoroinhas}>
          <Text style={styles.textTotal}>Coroinhas cadastrados: </Text>
          <Text style={[styles.textTotal, { fontWeight: '700' }]}>
            {coroinhas.length != 0 ? coroinhas.length : 0}
          </Text>
        </View>

        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.key}
          data={coroinhas}
          renderItem={({ item }) => (
            <ItemListaCoroinhaEscala
              data={item}
              selectCoroinha={handleSelectCoroinha}
            />
          )}
          ListEmptyComponent={
            loading ? (
              <View style={styles.textMessage}>
                <Text style={styles.textMessage}>Carregando...</Text>
              </View>
            ) : (
              <View style={styles.textMessage}>
                <Text style={{ fontSize: 14, color: '#ee5253' }}>
                  Nenhum coroinha cadastrado!
                </Text>
              </View>
            )
          }
        />

        <ModalEscala
          visible={modalVisible}
          setVisible={setModalVisible}
          coroinha={coroinhaSelecionado}
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
    backgroundColor: '#F2f6fc'
  },
  boxAreaCadastro: {
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
  boxTotalCoroinhas: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 5
  },
  textPesquisar: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10
  },
  textTotal: { fontSize: 12, color: '#0096c7' },
  list: {
    width: '100%',
    marginTop: 2,
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#dfe4ea'
  },
  textMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  }
});
