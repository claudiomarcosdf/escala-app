import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ItemListaCoroinha({ data }) {

  return (
    <View style={styles.container}>
      <Text style={styles.textNome}>{data.nome}</Text>
      <Text style={styles.textCelular}>{data.celular}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 0,
    backgroundColor: '#57606f',
  },
  textNome: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700'
  },
  textCelular: {
    color: '#fff',
    fontSize: 12
  }

});