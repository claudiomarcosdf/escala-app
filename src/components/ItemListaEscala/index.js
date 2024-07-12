import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ItemListaEscala({ data, deleteItem }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCalendarBox}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons
            name='calendar-clock'
            size={25}
            color='#2f3640'
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.boxDataHora}>
            <Text style={styles.textData}>{data.data}</Text>
            <Text style={styles.textHora}>{data.hora}</Text>
          </View>
          <View>
            <Text style={styles.textNome}>{data.coroinha}</Text>
            <Text style={styles.textCelular}>{data.celular}</Text>
          </View>
        </View>
      </View>
      <View style={styles.deleteBox}>
        <TouchableOpacity onPress={() => deleteItem(data.key, data.coroinha)}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color='#ee5253' />
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
    padding: 8,
    marginTop: 0,
    marginBottom: 3,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  boxDataHora: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30
  },
  textData: {
    color: '#2f3640',
    fontSize: 12,
    fontWeight: '700'
  },
  textHora: {
    color: '#5f27cd',
    fontSize: 14,
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
  iconCalendarBox: {
    flexDirection: 'row'
  },
  iconBox: {
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#dfe4ea',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteBox: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
