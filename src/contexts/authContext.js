import { useEffect, createContext, useState } from 'react';
import { Alert } from 'react-native';

import moment from 'moment-timezone';
import firebase from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paroquiaconfig, setParoquiaConfig] = useState(null);

  useEffect(() => {
    async function loadStorage() {
      setLoading(true);
      pegarParoquiaConfig();

      const storageUser = await AsyncStorage.getItem('appskl');

      if (storageUser) {
        const today = new Date(moment.tz('America/Sao_Paulo').format());
        const storageObj = JSON.parse(storageUser);

        //se expirou
        if (storageObj.exp < today.getTime()) {
          await AsyncStorage.removeItem('appskl');
          setUser(null);
        } else setUser(JSON.parse(storageUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  async function saveToStorage({ uid, email, nome, tipo, ativo }) {
    let today = new Date(moment.tz('America/Sao_Paulo').format());
    let dataExpiracao = today;
    dataExpiracao.setHours(today.getHours() + 2); // Adiciona 2 horas

    const appskl = {
      key: uid,
      email,
      nome,
      tipo,
      ativo,
      exp: dataExpiracao.getTime()
    };
    if (email) await AsyncStorage.setItem('appskl', JSON.stringify(appskl));
  }

  async function savePessoa(
    uid,
    email,
    nome,
    celular,
    tipo = '',
    ativo = false
  ) {
    let pessoa = firebase.database().ref('pessoas');
    let chave = uid;

    pessoa
      .child(chave)
      .set({
        email,
        nome,
        celular,
        tipo,
        ativo
      })
      .then(() => {
        const data = {
          key: chave,
          email,
          nome,
          celular,
          tipo,
          ativo
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getPessoa(userLogged) {
    const idPessoa = 'pessoas/' + userLogged.uid;
    await firebase
      .database()
      .ref(idPessoa)
      .on('value', (snapshot) => {
        const data = snapshot.val();

        if (data != null) {
          if (data.ativo) {
            setUser({ key: userLogged.uid, ...data }); //user.user.uid
            saveToStorage({ uid: userLogged.uid, ...data });
          } else {
            Alert.alert('Acesso negado', 'Usuário inativo.');
            setUser(null);
          }
        }
        setLoading(false);
      });
  }

  async function login(email, password) {
    setLoading(true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        const userLogged = {
          uid: user.user.uid,
          email: user.user.email,
          exp: 0
        };

        getPessoa(userLogged);
      })
      .catch((err) => {
        setLoading(false);
        let tipoErro = err.toString();
        if (tipoErro.includes('auth/invalid-email'))
          tipoErro = 'Email inválido!';
        if (tipoErro.includes('auth/missing-password'))
          tipoErro = 'A Senha é obrigatória!';
        if (tipoErro.includes('auth/invalid-credential'))
          tipoErro = 'Senha inválida!';
        if (tipoErro.includes('auth/user-disabled'))
          tipoErro = 'Usuário inativo. Favor contactar o administrador!';

        Alert.alert('Acesso negado', tipoErro);
        return null;
      });
  }

  //cadastro
  async function singUp(email, nome, celular, password) {
    setLoading(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const userLogged = {
          uid: user.user.uid,
          email: user.user.email,
          exp: 0
        };
        setUser(null); // Novos usuários necessitam ser ativados pelo admin
        savePessoa(userLogged.uid, email, nome, celular);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        Alert.alert('Atenção', 'Erro ao cadastrar usuário.');
        //alert('Erro ao cadastrar usuário. \n' + err);
        return;
      });
  }

  async function logout() {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        AsyncStorage.removeItem('appskl');
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //---------- DADOS DA PARÓQUIA -------------------

  async function salvarParoquiaConfig(
    nome,
    endereco,
    qtdePessoasCandidatas,
    qtdeCoroinhasPorHorario,
    qtdeAcolitosPorHorario,
    qtdeCerimoniariosPorHorario
  ) {
    const data = {
      nome,
      endereco,
      qtdePessoasCandidatas,
      qtdeCoroinhasPorHorario,
      qtdeAcolitosPorHorario,
      qtdeCerimoniariosPorHorario
    };
    await AsyncStorage.setItem('appsklconfig', JSON.stringify(data));
    setParoquiaConfig(data);
  }

  async function pegarParoquiaConfig() {
    const storageUser = await AsyncStorage.getItem('appsklconfig');

    if (!storageUser) setParoquiaConfig(null);
    else setParoquiaConfig(JSON.parse(storageUser));
  }

  // async function erase() {
  //   await AsyncStorage.removeItem('appsklconfig');
  // }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        singUp,
        logout,
        loading,
        paroquiaconfig,
        salvarParoquiaConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
