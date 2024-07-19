import { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert
} from 'react-native';
import Dropdown from 'react-native-input-select';
import { Feather } from '@expo/vector-icons';
import filter from 'lodash.filter';

import firebase from '../../firebaseConfig';
import ItemListaCoroinha from '../../components/ItemListaCoroinha';
import { CoroinhaContext } from '../../contexts/coroinhaContext';

export default function Cadastro() {
  const inputRef = useRef(null);
  const [nome, setNome] = useState(null);
  const [celular, setCelular] = useState(null);
  const [horario, setHorario] = useState(null);
  const [key, setKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [coroinhasFiltered, setCoroinhasFiltered] = useState([]);

  const {
    loading,
    coroinhas,
    setCoroinhas,
    incluirCoroinha,
    alterarCoroinha,
    excluirCoroinha
  } = useContext(CoroinhaContext);

  useEffect(() => {
    setCoroinhasFiltered(coroinhas);
  }, []);

  async function handleAdd() {
    if (!nome || !celular) return;

    if (key) {
      await alterarCoroinha(key, nome, celular, horario);
      setCoroinhasFiltered(coroinhas);
      Keyboard.dismiss();
      setNome('');
      setCelular('');
      setHorario(null);
      setKey(null);
      return;
    }

    await incluirCoroinha(nome, celular, horario);
    setCoroinhasFiltered(coroinhas);
    //setCoroinhasFiltered((oldCoroinhas) => [...oldCoroinhas, data].reverse());

    setNome(null);
    setCelular(null);
    setHorario(null);
    Keyboard.dismiss();
  }

  async function handleDelete(key, nome) {
    if (!key) return;

    Alert.alert('Atenção', `Confirma exclusão do coroinha "${nome}"?`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => {
          excluirCoroinha(key);
          setCoroinhasFiltered(coroinhas);
        }
      }
    ]);
  }

  function handleEdit(data) {
    setKey(data.key);
    setNome(data.nome);
    setCelular(data.celular);
    setHorario(data?.horario || null);
    inputRef.current.focus();
  }

  function handleCancelEdit() {
    setKey(null);
    setNome(null);
    setCelular(null);
    setHorario(null);
    Keyboard.dismiss();
  }

  function handleSearch(query) {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(coroinhasFiltered, (coroinha) => {
      if (coroinha.nome.toLowerCase().includes(formattedQuery)) return true;
      return false;
    });

    setCoroinhas(filteredData);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaCadastro}>
        <Text style={styles.titleText}>Cadastro de Coroinha</Text>

        {key && (
          <View style={styles.boxMessageEdit}>
            <Feather name='alert-triangle' size={20} color='#e74c3c' />
            <Text style={{ fontSize: 13, marginLeft: 5, color: '#e74c3c' }}>
              Você está editando este registro
            </Text>
            <TouchableOpacity
              style={styles.btnCancelEdit}
              onPress={handleCancelEdit}
            >
              <Text style={{ color: '#e74c3c', fontSize: 13 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          placeholder='Nome'
          style={styles.input}
          value={nome}
          ref={inputRef}
          onChangeText={(text) => setNome(text)}
        />
        <TextInput
          placeholder='Celular'
          style={styles.input}
          value={celular}
          onChangeText={(text) => setCelular(text)}
        />
        <Dropdown
          placeholder='Selecione um horário...'
          placeholderStyle={{ opacity: 0.5 }}
          dropdownStyle={styles.dropdown}
          options={[
            { label: '1º Horário', value: 'AHR' },
            { label: '2º Horário', value: 'BHR' },
            { label: '3º Horário', value: 'CHR' },
            { label: '4º Horário', value: 'DHR' },
            { label: '5º Horário', value: 'EHR' },
            { label: '6º Horário', value: 'FHR' },
            { label: '7º Horário', value: 'GHR' },
            { label: '8º Horário', value: 'HHR' },
            { label: '9º Horário', value: 'IHR' },
            { label: '10º Horário', value: 'JHR' }
          ]}
          selectedValue={horario}
          onValueChange={(value) => setHorario(value)}
          primaryColor={'#0096c7'}
        />

        <TouchableOpacity style={styles.btnCadastrar} onPress={handleAdd}>
          <Text style={styles.btnText}>{key ? 'Editar' : 'Cadastrar'}</Text>
        </TouchableOpacity>

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
            <ItemListaCoroinha
              data={item}
              deleteItem={handleDelete}
              editItem={handleEdit}
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
  dropdown: {
    borderColor: '#747d8c',
    backgroundColor: '#FFF',
    borderRadius: 4
  },
  btnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  btnCadastrar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBotton: 10,
    marginTop: 5,
    borderRadius: 8,
    backgroundColor: '#0096c7',
    width: '100%'
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
  },
  boxMessageEdit: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
    height: 30,
    width: '100%',
    backgroundColor: '#fab1a0'
  },
  btnCancelEdit: {
    height: 20,
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 5,
    paddingRight: 5,
    paddingLeft: 5,
    marginLeft: 10
  }
});
