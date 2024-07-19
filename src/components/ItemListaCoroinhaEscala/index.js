import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import { FontAwesome6 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { getLabelHorario } from '../../utils/helpers';

export default function ItemListaCoroinhaEscala({ data, selectCoroinha }) {
  return (
    <View style={styles.container}>
      <View style={styles.personBox}>
        <View style={styles.iconPersonBox}>
          <FontAwesome6 name='person-praying' size={25} color='#2f3640' />
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => selectCoroinha(data)}>
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
            <TouchableWithoutFeedback>
              <Text style={styles.textCelular}>{data.celular}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={styles.escalarBox}>
        <TouchableOpacity onPress={() => selectCoroinha(data)}>
          <AntDesign name='right' size={20} color='#95a5a6' />
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
  escalarBox: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
