import { useEffect, createContext, useState } from 'react';

import moment from 'moment-timezone';
import firebase from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paroquia, setParoquia] = useState(null);

  useEffect(() => {
    async function loadStorage() {
      setLoading(true);
      pegarParoquia();

      const storageUser = await AsyncStorage.getItem('coroinhaUser');

      if (storageUser) {
        const today = new Date(moment.tz('America/Sao_Paulo').format());
        const storageObj = JSON.parse(storageUser);

        //se venceu
        if (storageObj.exp < today.getTime()) {
          await AsyncStorage.removeItem('coroinhaUser');
          setUser(null);
        } else setUser(JSON.parse(storageUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  async function saveToStorage({ uid, email }) {
    let today = new Date(moment.tz('America/Sao_Paulo').format());
    let dataExpiracao = today;
    dataExpiracao.setHours(today.getHours() + 2); // Adiciona 2 horas

    const coroinhaUser = {
      uid,
      email,
      exp: dataExpiracao.getTime()
    };
    if (email)
      await AsyncStorage.setItem('coroinhaUser', JSON.stringify(coroinhaUser));
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

        setUser(userLogged); //user.user.uid
        saveToStorage(userLogged);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert('Erro ao logar. \n' + err);
        return null;
      });
  }

  async function singUp(email, password) {
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
        setUser(userLogged); //user.user.uid
        saveToStorage(userLogged);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert('Erro ao cadastrar usuário. \n' + err);
        return;
      });
  }

  async function logout() {
    await AsyncStorage.removeItem('coroinhaUser');
    setUser(null);
  }

  //---------- DADOS DA PARÓQUIA -------------------

  async function salvarParoquia(nome, endereco) {
    const data = {
      nome,
      endereco
    };
    await AsyncStorage.setItem('coroinhaApp', JSON.stringify(data));
    setParoquia(data);
  }

  async function pegarParoquia() {
    const storageUser = await AsyncStorage.getItem('coroinhaApp');

    if (!storageUser) setParoquia(null);
    else setParoquia(JSON.parse(storageUser));
  }

  return (
    <AuthContext.Provider
      value={{ user, login, singUp, logout, loading, paroquia, salvarParoquia }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
