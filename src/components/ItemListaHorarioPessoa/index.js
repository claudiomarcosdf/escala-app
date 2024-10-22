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
import { getStatus, getNomeSobrenome } from '../../utils/helpers';

export default function ItemListaHorarioPessoa({
  data,
  deleteItem,
  fullFields
}) {
  function AdministradorView() {
    return (
      <View>
        <TouchableWithoutFeedback>
          <Text numberOfLines={1} style={styles.textPessoa}>
            {`${getNomeSobrenome(data?.nomepessoa)} (${data?.tipopessoa})`}
          </Text>
        </TouchableWithoutFeedback>

        <View style={{ flexDirection: 'row' }}>
          <TouchableWithoutFeedback>
            <Text numberOfLines={1} style={styles.textDataPessoa}>
              {data?.data}
              <Text style={styles.textHorarioPessoa}>
                {` - ${data?.horarios.join(' - ')}`}
              </Text>
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  function pessoaView() {
    return (
      <View>
        <TouchableWithoutFeedback>
          <Text numberOfLines={1} style={styles.textData}>
            {data?.data}
          </Text>
        </TouchableWithoutFeedback>

        <View style={{ flexDirection: 'row' }}>
          <TouchableWithoutFeedback>
            <Text style={styles.textHorario}>{data?.horarios.join(' - ')}</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.horarioBox}>
        <View style={styles.iconHorarioBox}>
          <MaterialCommunityIcons name='timetable' size={22} color='#2f3640' />
        </View>
        {fullFields ? AdministradorView() : pessoaView()}
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
    marginHorizontal: 3,
    marginTop: 4,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  textPessoa: {
    width: 230,
    color: '#2f3640',
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  textDataPessoa: {
    color: '#2f3640',
    fontSize: 10,
    fontWeight: '700'
  },
  textHorarioPessoa: {
    color: '#e74c3c',
    fontSize: 10,
    fontWeight: '500'
  },
  textData: {
    color: '#2f3640',
    fontSize: 14,
    fontWeight: '700'
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
    width: 30,
    height: 30,
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
