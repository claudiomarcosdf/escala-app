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

import AppStyles from '../../appStyles';
import { getLabelHorario } from '../../utils/helpers';

export default function ItemListaPessoaEscala({ data, selectPessoa }) {
  function destak(data) {
    return data?.tipo == 'Administrador'
      ? { color: AppStyles.color.danger }
      : { color: '#2f3640' };
  }
  return (
    <View style={styles.container}>
      <View style={styles.personBox}>
        <View style={styles.iconPersonBox}>
          <FontAwesome6 name='person-praying' size={25} color='#2f3640' />
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => selectPessoa(data)}>
            <Text numberOfLines={1} style={styles.textNome}>
              {data.nome}
            </Text>
          </TouchableWithoutFeedback>
          <View style={{ flexDirection: 'row' }}>
            <TouchableWithoutFeedback>
              <Text style={[styles.textTipoPessoa, destak(data)]}>
                {data?.tipo}
              </Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <Text style={styles.textCelular}>
                {data.celular && ` | ${data.celular}`}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={styles.escalarBox}>
        <TouchableOpacity onPress={() => selectPessoa(data)}>
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
    marginTop: 4,
    marginHorizontal: 3,
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
  textTipoPessoa: {
    color: '#2f3640',
    fontSize: 12
  },
  textTipoCelular: {
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
