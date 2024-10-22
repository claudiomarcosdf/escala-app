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

export default function ItemListaPessoa({ data, deleteItem, editItem }) {
  function destak(data) {
    return data?.tipo == 'Administrador'
      ? { color: '#ee5253' }
      : { color: '#2f3640' };
  }

  function getTipoEStatus() {
    const statusStyled = `  |  ${getStatus(data?.ativo)}`;
    const statusOnly = getStatus(data?.ativo);
    return data?.tipo ? (
      <Text style={[styles.textTipoStatus, destak(data)]}>
        {data?.tipo}
        <Text style={styles.textTipoStatus}>{statusStyled}</Text>
      </Text>
    ) : (
      <Text style={styles.textTipoStatus}>{statusOnly}</Text>
    );
  }

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
              {getTipoEStatus()}
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => editItem(data)}>
              <Text style={styles.textTipoStatus}>
                {data.celular && ` | ${data.celular}`}
              </Text>
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
    marginHorizontal: 3,
    marginTop: 4,
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
  textTipoStatus: {
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
