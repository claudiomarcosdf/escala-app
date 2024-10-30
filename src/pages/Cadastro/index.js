import { useEffect, useState, useMemo, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Switch,
  Keyboard,
  Alert
} from 'react-native';
import Dropdown from 'react-native-input-select';
import { Feather } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import filter from 'lodash.filter';

import AppStyles from '../../appStyles';
import firebase from '../../firebaseConfig';
import ItemListaPessoa from '../../components/ItemListaPessoa';
import { PessoaContext } from '../../contexts/pessoaContext';

export default function Cadastro() {
  const inputRef = useRef(null);
  const [nome, setNome] = useState(null);
  const [celular, setCelular] = useState(null);
  const [tipoPessoa, setTipoPessoa] = useState(null);
  const [key, setKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pessoasFiltered, setPessoasFiltered] = useState([]);

  const [ativo, setAtivo] = useState(false);
  const toggleSwitch = () => setAtivo((previousState) => !previousState);

  const {
    loading,
    getPessoas,
    pessoas,
    setPessoas,
    alterarPessoa,
    excluirPessoa
  } = useContext(PessoaContext);

  useMemo(() => {
    setPessoasFiltered(pessoas);
  }, [pessoas]);

  useEffect(() => {
    getPessoas();
  }, []);

  async function handleSave() {
    if (!nome || !tipoPessoa) return;

    if (key) {
      await alterarPessoa(key, nome, celular, tipoPessoa, ativo);
      setPessoasFiltered(pessoas);
      Keyboard.dismiss();
      setNome('');
      setCelular('');
      setTipoPessoa(null);
      setAtivo(false);
      setKey(null);
      return;
    }

    //Inclusão NÃO disponível para o administrador porque é devida ao próprio usuário
    //await incluirPessoa(nome, celular, tipo, ativo);
    //setPessoasFiltered(pessoas);

    Alert.alert('Atenção', 'O cadastro é realizado pela própria pessoa.');
    setNome(null);
    setCelular(null);
    setTipoPessoa(null);
    setAtivo(false);
    Keyboard.dismiss();
  }

  async function handleDelete(key, nome) {
    if (!key) return;

    Alert.alert('Atenção', `Confirma exclusão de "${nome}"?`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => {
          excluirPessoa(key);
          setPessoasFiltered(pessoas);
        }
      }
    ]);
  }

  function handleEdit(data) {
    setKey(data.key);
    setNome(data.nome);
    setCelular(data.celular);
    setTipoPessoa(data?.tipo || null);
    setAtivo(data?.ativo);
    inputRef.current.focus();
  }

  function handleCancelEdit() {
    setKey(null);
    setNome(null);
    setCelular(null);
    setTipoPessoa(null);
    setAtivo(false);
    Keyboard.dismiss();
  }

  function handleSearch(query) {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(pessoasFiltered, (pessoa) => {
      if (pessoa.nome.toLowerCase().includes(formattedQuery)) return true;
      return false;
    });

    setPessoas(filteredData);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaCadastro}>
        <Text style={styles.titleText}>Cadastro de Pessoas</Text>

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
              <Text style={{ color: '#fff', fontSize: 13 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.boxStatus}>
          <Text style={{ fontSize: 13, marginLeft: 5, color: '#fff' }}>
            {ativo ? 'Ativo' : 'Inativo'}
          </Text>
          <Switch
            style={styles.customSwitch}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={ativo ? AppStyles.color.blueLightColor : '#f4f3f4'}
            ios_backgroundColor='#3e3e3e'
            onValueChange={toggleSwitch}
            value={ativo}
          />
        </View>
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
          placeholder='Selecione a função...'
          placeholderStyle={{ opacity: 0.5 }}
          dropdownStyle={styles.dropdown}
          options={[
            { label: 'Administrador', value: 'Administrador' },
            { label: 'Cerimoniário', value: 'Cerimoniário' },
            { label: 'Coroinha', value: 'Coroinha' },
            { label: 'Mesce', value: 'Mesce' }
          ]}
          selectedValue={tipoPessoa}
          onValueChange={(value) => setTipoPessoa(value)}
          primaryColor={AppStyles.color.primary}
        />

        <TouchableOpacity style={styles.btnCadastrar} onPress={handleSave}>
          <Text style={styles.btnText}>{key ? 'Editar' : 'Cadastrar'}</Text>
        </TouchableOpacity>

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

        <View style={styles.boxTotalCoroinhas}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.textTotal}>Pessoas cadastradas: </Text>
            <Text style={[styles.textTotal, { fontWeight: '700' }]}>
              {pessoas.length != 0 ? pessoas.length : 0}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnRefresh}
            onPress={() => getPessoas()}
          >
            <SimpleLineIcons name='refresh' size={15} color='#fff' />
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.key}
          data={pessoas}
          renderItem={({ item }) => (
            <ItemListaPessoa
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
                <Text style={{ fontSize: 14, color: AppStyles.color.danger }}>
                  Nenhuma pessoa cadastrada!
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
    borderWidth: 1.4,
    borderColor: AppStyles.color.secondary,
    borderRadius: 5,
    backgroundColor: AppStyles.color.primary,
    width: '100%'
  },
  boxStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
    width: '100%',
    padding: 0,
    marginBottom: 2
  },
  customSwitch: {
    padding: 0,
    margin: 0,
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
  },
  boxTotalCoroinhas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 5
  },
  btnRefresh: {
    marginBottom: 2,
    paddingHorizontal: 2
  },
  textPesquisar: {
    color: '#fff',
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
    backgroundColor: '#ffcccc'
  },
  btnCancelEdit: {
    height: 20,
    borderWidth: 0,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    paddingRight: 8,
    paddingLeft: 8,
    marginLeft: 10
  }
});
