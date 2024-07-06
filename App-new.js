import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { database } from './src/firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function App() {
  const [listUsers, setListUsers] = useState([]);
  useEffect(() => {
    const users = ref(database, 'usuarios');
    onValue(users, (snapshot) => {
      const data = snapshot.val();
      const userList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));
      setListUsers(userList);
      console.log(userList);
    });
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
