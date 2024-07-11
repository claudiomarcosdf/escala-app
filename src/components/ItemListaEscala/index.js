import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default function ItemListaEscala({ data, deleteItem }) {
  return (
    <View style={styles.container}>
      <View style={styles.personBox}>
        <View style={styles.iconPersonBox}>
          <MaterialCommunityIcons
            name='calendar-clock'
            size={25}
            color='#2f3640'
          />
        </View>
        <View>
          <Text
            style={styles.textDataHora}
          >{`${data.data} - ${data.hora}`}</Text>
          <Text style={styles.textNome}>{data.coroinha}</Text>
          <Text style={styles.textCelular}>{data.celular}</Text>
        </View>
      </View>
      <View style={styles.deleteBox}>
        <TouchableOpacity onPress={() => deleteItem(data.key)}>
          <Ionicons name='trash-bin' size={20} color='#ff6b81' />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 0,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  textDataHora: {
    color: '#2f3640',
    fontSize: 12,
    fontWeight: '700'
  },
  textNome: {
    color: '#2f3640',
    fontSize: 13,
    fontWeight: '700'
  },
  textCelular: {
    color: '#2f3640',
    fontSize: 12
  },
  personBox: {
    flexDirection: 'row'
  },
  iconPersonBox: {
    padding: 2,
    marginRight: 15,
    borderRadius: 2,
    backgroundColor: '#dfe4ea',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteBox: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
