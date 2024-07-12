import { useEffect, useState, useRef } from 'react';
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

import firebase from '../../firebaseConfig';
import ItemListaCoroinha from '../../components/ItemListaCoroinha';
import { Feather } from '@expo/vector-icons';

export default function Cadastro() {
  const inputRef = useRef(null);
  const [nome, setNome] = useState(null);
  const [celular, setCelular] = useState(null);
  const [coroinhas, setCoroinhas] = useState([]);
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDados() {
      setCoroinhas([]);

      await firebase
        .database()
        .ref('coroinhas') //'coroinhas/1'
        .once('value', (snapshot) => {
          snapshot?.forEach((childItem) => {
            let data = {
              key: childItem.key,
              nome: childItem.val().nome,
              celular: childItem.val().celular
            };

            setCoroinhas((oldCoroinhas) => [...oldCoroinhas, data].reverse());
          });
          setLoading(false);
          //snapshot.val().nome
          //snapshot.val().idade
        })
        .catch((err) => {
          setLoading(false);
        });
    }

    getDados();
  }, []);

  function handleAdd() {
    if (!nome || !celular) return;

    if (key) {
      firebase
        .database()
        .ref('coroinhas')
        .child(key)
        .update({
          nome,
          celular
        })
        .then(() => {
          const coroinhaIndex = coroinhas.findIndex(
            (coroinha) => coroinha.key === key
          );
          let coroinhasClone = coroinhas;
          coroinhasClone[coroinhaIndex].nome = nome;
          coroinhasClone[coroinhaIndex].celular = celular;

          setCoroinhas([...coroinhasClone]);
        });

      Keyboard.dismiss();
      setNome('');
      setCelular('');
      setKey(null);
      return;
    }

    let coroinha = firebase.database().ref('coroinhas');
    let chave = coroinha.push().key;

    coroinha
      .child(chave)
      .set({
        nome,
        celular
      })
      .then(() => {
        const data = {
          key: chave,
          nome,
          celular
        };

        setCoroinhas((oldCoroinhas) => [...oldCoroinhas, data].reverse());
      });

    setNome(null);
    setCelular(null);
    Keyboard.dismiss();
  }

  function handleDelete(key, nome) {
    if (!key) return;

    Alert.alert(
      'Atenção',
      `Confirma exclusão do coroinha "${nome}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => {
            firebase
              .database()
              .ref('coroinhas')
              .child(key)
              .remove()
              .then(() => {
                const newCoroinhasList = coroinhas.filter((item) => item.key !== key);
                setCoroinhas(newCoroinhasList);
              });
          }
        }
      ]
    );
  }

  function handleEdit(data) {
    setKey(data.key);
    setNome(data.nome);
    setCelular(data.celular);
    inputRef.current.focus();
  }

  function handleCancelEdit() {
    setKey(null);
    setNome(null);
    setCelular(null);
    Keyboard.dismiss();
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

        <TouchableOpacity style={styles.btnCadastrar} onPress={handleAdd}>
          <Text style={styles.btnText}>{key ? 'Editar' : 'Cadastrar'}</Text>
        </TouchableOpacity>

        <View style={styles.boxTotalCoroinhas}>
          <Text style={styles.textTotal}>Coroinhas cadastrados: </Text>
          <Text style={[styles.textTotal, { fontWeight: '700' }]}>{coroinhas.length != 0 ? coroinhas.length : 0}</Text>
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
    borderRadius: 8,
    backgroundColor: '#0984e3',
    width: '100%'
  },
  boxTotalCoroinhas: { flexDirection: 'row', width: '100%', marginTop: 10, paddingHorizontal: 5 },
  textTotal: { fontSize: 12, color: '#0652DD' },
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
