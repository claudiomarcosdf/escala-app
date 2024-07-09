import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Keyboard
} from 'react-native';

import firebase from '../../firebaseConfig';
import ItemListaCoroinha from '../../components/ItemListaCoroinha';

// const coroinhas = [
//   { key: 1, nome: 'Therezinha', celular: '99236-4764' },
//   { key: 2, nome: 'João Pedro', celular: '99236-4764' },
//   { key: 3, nome: 'Othor', celular: '99236-4764' },
//   { key: 4, nome: 'Salete', celular: '99236-4764' },
//   { key: 5, nome: 'Mão Diná', celular: '99236-4764' },
//   { key: 6, nome: 'Mão Diná', celular: '99236-4764' },
//   { key: 7, nome: 'Mão Diná', celular: '99236-4764' },
//   { key: 8, nome: 'Mão Diná', celular: '99236-4764' },
//   { key: 9, nome: 'Mão Diná', celular: '99236-4764' }
// ];

export default function Cadastro() {
  const inputRef = useRef(null);
  const [nome, setNome] = useState(null);
  const [celular, setCelular] = useState(null);
  const [coroinhas, setCoroinhas] = useState([]);
  const [key, setKey] = useState(null);

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

            setCoroinhas((oldCoroinhas) => [...oldCoroinhas, data]);
          });
          //snapshot.val().nome
          //snapshot.val().idade
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

        setCoroinhas((oldCoroinhas) => [...oldCoroinhas, data]);
      });

    setNome(null);
    setCelular(null);
    Keyboard.dismiss();
  }

  function handleDelete(key) {
    if (!key) return;

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

  function handleEdit(data) {
    setKey(data.key);
    setNome(data.nome);
    setCelular(data.celular);
    inputRef.current.focus();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaCadastro}>
        <Text style={styles.titleText}>Cadastro de Coroinha</Text>

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
          <Text style={styles.btnText}>Cadastrar</Text>
        </TouchableOpacity>

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
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 14, color: '#ff6348' }}>
                Nenhum coroinha cadastrado!
              </Text>
            </View>
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
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  },
  boxAreaCadastro: {
    flex: 1,
    alignItems: 'center',
    padding: 15
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
    borderRadius: 8,
    backgroundColor: '#0984e3',
    width: '100%'
  },
  list: {
    width: '100%',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#dfe4ea'
  }
});
