import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

export default function EscalaIndividual() {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text>ESCALA INDIVIDUAL</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc',
  }
});
