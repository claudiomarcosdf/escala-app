import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import firebase from './src/firebaseConfig';

export default function App() {
  const [listUsers, setListUsers] = useState([]);
  useEffect(() => {
    async function dados() {
      await firebase
        .database()
        .ref('usuarios') //'usuarios/1'
        .once('value', (snapshot) => {
          setListUsers(snapshot.val());
          //snapshot.val().nome
          //snapshot.val().idade
        });
    }

    dados();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, paddingBottom: 20 }}>Meus usuários</Text>
      {listUsers.map((item, index) => {
        return (
          <View key={index} style={styles.boxuser}>
            <Text style={styles.useritem}>{item.nome}</Text>
            <Text style={styles.useritem}>{item.idade}</Text>
          </View>
        );
      })}
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxuser: {
    flexDirection: 'row'
  },
  useritem: {
    padding: 4
  }
});
