import { useState, useContext } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard
} from 'react-native';

import firebase from '../../firebaseConfig';
import { AuthContext } from '../../contexts/authContext';

export default function Login({ changeStatus }) {
  const [type, setType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, login, singUp } = useContext(AuthContext);

  function handleLogin() {
    Keyboard.dismiss();
    if (type === 'login') {
      login(email, password);
    } else {
      singUp(email, password);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={{ width: '100%', alignItems: 'center', marginBottom: 30 }}>
          <Image
            style={styles.image}
            source={require('../../../assets/amem.png')}
          />
        </View>
        <TextInput
          placeholder='Seu email'
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder='***********'
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity
          style={[
            styles.btnLogin,
            { backgroundColor: type === 'login' ? '#0096c7' : '#141414' }
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>
            {type === 'login' ? 'Acessar' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnCriarConta}
          onPress={() =>
            setType((type) => (type === 'login' ? 'cadastrar' : 'login'))
          }
        >
          {loading ? (
            <ActivityIndicator size={20} color='#0096c7' />
          ) : (
            <Text style={{ textAlign: 'center' }}>
              {type === 'login' ? 'Criar uma conta' : 'Já possuo uma conta'}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#74b9ff',
    borderWidth: 0.5
  }
});
