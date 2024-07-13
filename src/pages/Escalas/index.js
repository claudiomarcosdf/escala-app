import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  Keybord
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ptBR } from '../../localeCalendar';

import ItemListaEscala from '../../components/ItemListaEscala';
import PrintEscala from '../../components/PrintEscala';
import { EscalaContext } from '../../contexts/escalaContext';
import { getOnlyDateBr, getDataToFilterFirebase } from '../../utils/helpers';

// const escalas = [
//   {
//     key: 1,
//     data: '11/07/2024',
//     hora: '09:00',
//     coroinha: 'Fulano de Tal',
//     celular: '61 98745-3589'
//   },
//   {
//     key: 2,
//     data: '11/07/2024',
//     hora: '11:00',
//     coroinha: 'Fulano de Tal',
//     celular: '61 98745-3589'
//   },
//   {
//     key: 3,
//     data: '11/07/2024',
//     hora: '17:00',
//     coroinha: 'Fulano de Tal',
//     celular: '61 98745-3589'
//   },
//   {
//     key: 4,
//     data: '11/07/2024',
//     hora: '18:00',
//     coroinha: 'Fulano de Tal',
//     celular: '61 98745-3589'
//   },
//   {
//     key: 5,
//     data: '11/07/2024',
//     hora: '19:00',
//     coroinha: 'Fulano de Tal',
//     celular: '61 98745-3589'
//   },
//   {
//     key: 6,
//     data: '11/07/2024',
//     hora: '21:00',
//     coroinha: 'Fulano de Tal',
//     celular: '61 98745-3589'
//   },
//   {
//     key: 7,
//     data: '11/07/2024',
//     hora: '23:00',
//     coroinha: 'Fulano de Tal',
//     celular: '61 98745-3589'
//   }
// ];

export default function Escalas() {
  let dataAtual = getOnlyDateBr();
  const [dateNow, setDateNow] = useState(new Date(dataAtual));
  const [markedDates, setMarkedDates] = useState({
    [dataAtual]: { selected: true, marked: true }
  });
  const [horaMarcada, setHoraMarcada] = useState({ horas: '', minutos: '' });

  const { escalas, setEscalas, getEscalas, loadingEscalas, excluirEscala } =
    useContext(EscalaContext);

  async function exibirEscalas(dataSelecionada) {
    const dataDeHoje = getDataToFilterFirebase();
    const dataParaBusca = dataSelecionada
      ? getDataToFilterFirebase(dataSelecionada)
      : dataDeHoje;
    await getEscalas(dataParaBusca);
  }

  useEffect(() => {
    exibirEscalas(dateNow ? dateNow.toISOString() : null);
  }, []);

  function handleDayPress(date) {
    setDateNow(new Date(date.dateString));

    let markedDay = {};
    markedDay[date.dateString] = {
      selected: true,
      selectedColor: '#3b3dbf',
      textColor: '#fff'
    };

    setMarkedDates(markedDay);
    exibirEscalas(date.dateString);
  }

  function handleDelete(key, coroinha) {
    if (!key) return;
    Alert.alert('Atenção', `Confirma exclusão do(a) ${coroinha} da escala?`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => excluirEscala(key)
      }
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxArea}>
        <View>
          <Text style={styles.titleText}>Escalas</Text>
        </View>

        <View style={styles.boxCalendar}>
          <Calendar
            current={dataAtual}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            enableSwipeMonths={true}
            style={{ borderRadius: 5 }}
            theme={{
              todayTextColor: '#000',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#fff'
            }}
          />
        </View>

        <View style={styles.boxComands}>
          <Text style={{ fontSize: 13, fontWeight: '600' }}>Escala do dia</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.btnEscalar} onPress={() => {}}>
              <Text style={styles.textBtnEscalar}>Escalar coroinha</Text>
            </TouchableOpacity>
            <PrintEscala data={escalas ? escalas : []} />
          </View>
        </View>

        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.key}
          data={escalas}
          renderItem={({ item }) => (
            <ItemListaEscala data={item} deleteItem={handleDelete} />
          )}
          ListEmptyComponent={
            loadingEscalas ? (
              <View style={styles.textMessage}>
                <Text style={styles.textMessage}>Carregando...</Text>
              </View>
            ) : (
              <View style={styles.textMessage}>
                <Text style={{ fontSize: 14, color: '#ee5253' }}>
                  Nenhuma escala para o dia selecionado!
                </Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 2,
    backgroundColor: '#F2f6fc'
  },
  boxArea: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2f3640',
    marginBottom: 8
  },
  boxCalendar: {
    width: '100%',
    marginBottom: 15
  },
  boxComands: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 5,
    padding: 3,
    backgroundColor: '#fff'
  },
  textBtnEscalar: { color: '#fff', fontSize: 12, fontWeight: '700' },
  btnEscalar: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#0984e3'
  },
  // btnCompartilhar: {
  //   marginLeft: 0,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: 25,
  //   width: 25,
  //   paddingHorizontal: 0,
  //   borderRadius: 50
  //    backgroundColor: '#0984e3'
  // },
  list: {
    width: '100%',
    marginTop: 10,
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#dfe4ea'
  },
  textMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  }
});
