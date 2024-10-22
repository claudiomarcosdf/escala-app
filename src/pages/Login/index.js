import { useState, useContext } from 'react';
import {
  Alert,
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

export default function Login({ loginType = 'login' }) {
  const [type, setType] = useState(loginType);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { loading, login, singUp } = useContext(AuthContext);

  function setLogin() {
    setType('login');
    setNome('');
    setCelular('');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleLogin() {
    Keyboard.dismiss();

    if (type === 'login') {
      await login(email, password);
    } else {
      if (!email || !nome || !password || !confirmPassword) {
        Alert.alert('Atenção', 'Dados obrigatórios em branco.');
        return;
      }

      if (password != confirmPassword) {
        Alert.alert('Atenção', 'A senha não confere.');
        return;
      }

      await singUp(email, nome, celular, password);
      Alert.alert('Sucesso', 'Conta criada. Aguarde o administrador ativá-la.');
      setLogin();
    }
  }

  function getStyleBottom() {
    const btnAcessar = {
      backgroundColor: '#001e39',
      borderWidth: 1.4,
      borderColor: '#01446c',
      borderRadius: 5
    };
    const btnCadastrar = {
      backgroundColor: '#001e39',
      borderColor: '#01446c',
      borderWidth: 1.4,
      borderRadius: 5
    };
    return type === 'login' ? btnAcessar : btnCadastrar;
    //{ backgroundColor: type === 'login' ? '#192a56' : '#141414' }
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

        {type === 'cadastrar' && (
          <>
            <TextInput
              placeholder='Nome completo'
              style={styles.input}
              value={nome}
              onChangeText={(text) => setNome(text)}
            />

            <TextInput
              placeholder='Celular'
              style={styles.input}
              value={celular}
              onChangeText={(text) => setCelular(text)}
            />
          </>
        )}

        <TextInput
          placeholder='Senha'
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {type === 'cadastrar' && (
          <>
            <TextInput
              placeholder='Confirmar senha'
              secureTextEntry={true}
              style={styles.input}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.btnLogin, getStyleBottom()]}
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
            <Text style={{ textAlign: 'center', color: 'white' }}>
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
    backgroundColor: '#1d2638'
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
    fontSize: 17,
    fontWeight: '600'
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
    borderColor: '#5b7192',
    borderWidth: 2
  }
});
