import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { getLabelHorario } from '../../utils/helpers';

export default function ItemListaCoroinha({ data, deleteItem, editItem }) {
  return (
    <View style={styles.container}>
      <View style={styles.personBox}>
        <View style={styles.iconPersonBox}>
          <FontAwesome6 name='person-praying' size={25} color='#2f3640' />
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => editItem(data)}>
            <Text numberOfLines={1} style={styles.textNome}>
              {data.nome}
            </Text>
          </TouchableWithoutFeedback>

          <View style={{ flexDirection: 'row' }}>
            <TouchableWithoutFeedback>
              <Text style={styles.textCelular}>{`${getLabelHorario(
                data?.horario
              )} | `}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => editItem(data)}>
              <Text style={styles.textCelular}>{data.celular}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={styles.deleteBox}>
        <TouchableOpacity onPress={() => deleteItem(data.key, data.nome)}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 0,
    marginBottom: 3,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  textNome: {
    width: 230,
    color: '#2f3640',
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  textCelular: {
    color: '#2f3640',
    fontSize: 12
  },
  personBox: {
    flexDirection: 'row'
  },
  iconPersonBox: {
    display: 'flex',
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
