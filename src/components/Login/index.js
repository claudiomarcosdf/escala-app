import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    alert('Acessar');
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

      <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
        <Text style={styles.loginText}>Acessar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnCriarConta}>
        <Text style={{ textAlign: 'center' }}>Criar uma conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
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
    borderColor: '#141414'
  },
  loginText: {
    color: '#FFF',
    fontSize: 17
  },
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414',
    height: 45,
    marginBotton: 10
  },
  btnCriarConta: {
    marginTop: 10
  }
});
