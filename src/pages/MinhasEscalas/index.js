import { useEffect, useState, useContext } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import moment from 'moment-timezone';

import AppStyles from '../../appStyles';
import { AuthContext } from '../../contexts/authContext';
import { EscalaContext } from '../../contexts/escalaContext';
import {
  getOnlyDateBr,
  getDataToFilterFirebase,
  transformToDate
} from '../../utils/helpers';

export default function MinhasEscalas() {
  let dataAtual = getOnlyDateBr();
  const [nowDate, setNowDate] = useState(new Date(dataAtual));
  const { user } = useContext(AuthContext);
  const { getEscalasPessoa, escalasPessoa, loading } =
    useContext(EscalaContext);

  const [state, setState] = useState({
    tableHead: ['Data', 'Hora', 'Situação'],
    tableData: [] // [['01/11/2024', '07:00', 'Escalado(a)']]
  });

  useEffect(() => {
    buscarEscalas();
  }, []);

  async function buscarEscalas() {
    const dataInicio = moment(nowDate)
      .subtract(1, 'years')
      .format('YYYY-MM-DD');
    await getEscalasPessoa(user.key, getDataToFilterFirebase(dataInicio));
  }

  // {
  //   console.log(
  //     'view',
  //     escalasPessoa && escalasPessoa.map(({ data, hora }) => [data, hora, ''])
  //   );
  // }

  function getDataToTable() {
    return escalasPessoa.map(({ data, hora }) => {
      let situacao = 'A servir';

      if (transformToDate(data) < nowDate) situacao = 'Concluído';

      return [data, hora, situacao];
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaElements}>
        <Text style={styles.titleText}>Minhas Escalas</Text>
        <TouchableOpacity
          style={styles.btnRefresh}
          onPress={() => buscarEscalas()}
        >
          <SimpleLineIcons name='refresh' size={15} color='#fff' />
        </TouchableOpacity>
        <View style={styles.containerTable}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
            <Row
              data={state.tableHead}
              style={styles.head}
              textStyle={styles.textHead}
            />
            <Rows
              data={getDataToTable()}
              style={styles.row}
              textStyle={styles.textData}
            />
          </Table>
          {loading && (
            <View style={styles.loadingMsg}>
              <Text style={{ color: '#fff' }}>Carregando...</Text>
            </View>
          )}
          {escalasPessoa.length == 0 && !loading && (
            <View style={styles.loadingMsg}>
              <Text style={{ color: '#fff' }}>Nenhuma escala encontrada</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 2,
    backgroundColor: AppStyles.color.background
  },
  boxAreaElements: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  btnRefresh: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 5
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 25
  },
  containerTable: {
    flex: 1,
    width: '100%',
    padding: 3,
    paddingTop: 8,
    backgroundColor: AppStyles.color.background
  },
  head: {
    height: 40,
    backgroundColor: AppStyles.color.primary
  },
  row: { height: 35 },
  textHead: { fontSize: 16, color: '#fff', margin: 6, textAlign: 'center' },
  textData: { color: '#ccc', margin: 6, textAlign: 'center' },
  loadingMsg: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25
  }
});
