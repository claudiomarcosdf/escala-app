import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Login from './src/components/Login';

export default function escalaapp() {
  const [user, setUuser] = useState(null);

  if (!user) {
    return <Login />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>HOME</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  }
});
