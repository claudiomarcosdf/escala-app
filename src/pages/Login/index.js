import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';

import firebase from '../../firebaseConfig';

export default function Login({ changeStatus }) {
  const [type, setType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    Keyboard.dismiss();
    if (type === 'login') {
      const user = firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          changeStatus(user.user.uid);
        })
        .catch((err) => {
          alert('Erro ao logar. \n' + err)
          return
        })
    } else {
      const user = firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          changeStatus(user.user.uid);
        })
        .catch((err) => {
          alert('Erro ao cadastrar usuário. \n' + err)
          return
        })
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder='Seu email'
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder='***********'
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={[styles.btnLogin, { backgroundColor: type === 'login' ? '#0984e3' : '#141414' }]} onPress={handleLogin}>
        <Text style={styles.loginText}>
          {type === 'login' ? 'Acessar' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnCriarConta} onPress={() => setType(type => type === 'login' ? 'cadastrar' : 'login')}>
        <Text style={{ textAlign: 'center' }}>
          {type === 'login' ? 'Criar uma conta' : 'Já possuo uma conta'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: '#747d8c'
  },
  loginText: {
    color: '#FFF',
    fontSize: 17
  },
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBotton: 10
  },
  btnCriarConta: {
    marginTop: 10
  }
});
