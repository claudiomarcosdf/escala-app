import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ItemListaEscala({ data, deleteItem, selectEscala }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCalendarBox}>
        <View style={[styles.iconBox, destak(data)]}>
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
          <TouchableWithoutFeedback onPress={() => selectEscala(data)}>
            <View>
              <Text numberOfLines={1} style={styles.textNome}>
                {data.pessoa}
              </Text>
              <Text style={styles.textCelular}>{data.tipopessoa}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={styles.deleteBox}>
        <TouchableOpacity onPress={() => deleteItem(data.key, data.pessoa)}>
          <MaterialCommunityIcons
            name='trash-can-outline'
            size={20}
            color='#ee5253'
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function destak(data) {
  return data?.falta
    ? { borderColor: '#e74c3c' }
    : data?.atraso
    ? { borderColor: '#f1c40f' }
    : {};
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
    width: 155,
    color: '#2f3640',
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
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
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#dfe4ea'
  },
  deleteBox: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
