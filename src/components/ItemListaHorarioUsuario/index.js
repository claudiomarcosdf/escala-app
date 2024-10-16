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
import { getStatus } from '../../utils/helpers';

export default function ItemListaHorarioUsuario({ data, deleteItem }) {
  return (
    <View style={styles.container}>
      <View style={styles.horarioBox}>
        <View style={styles.iconHorarioBox}>
          <MaterialCommunityIcons name='timetable' size={25} color='#2f3640' />
        </View>
        <View>
          <TouchableWithoutFeedback>
            <Text numberOfLines={1} style={styles.textData}>
              {data?.data}
            </Text>
          </TouchableWithoutFeedback>

          <View style={{ flexDirection: 'row' }}>
            <TouchableWithoutFeedback>
              <Text style={styles.textHorario}>
                {data?.horarios.join(' - ')}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={styles.deleteBox}>
        <TouchableOpacity onPress={() => deleteItem(data?.key, data?.data)}>
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
  textData: {
    width: 230,
    color: '#2f3640',
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  textHorario: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500'
  },
  horarioBox: {
    flexDirection: 'row'
  },
  iconHorarioBox: {
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
