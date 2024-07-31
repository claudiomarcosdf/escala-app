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
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ptBR } from '../../localeCalendar';

import ItemListaEscala from '../../components/ItemListaEscala';
import PrintEscala from '../../components/PrintEscala';
import { EscalaContext } from '../../contexts/escalaContext';
import { getOnlyDateBr, getDataToFilterFirebase } from '../../utils/helpers';
import ModalFaltaAtraso from '../../components/ModalFaltaAtraso';

export default function Escalas() {
  let dataAtual = getOnlyDateBr();
  const [dateNow, setDateNow] = useState(new Date(dataAtual));
  const [markedDates, setMarkedDates] = useState({
    [dataAtual]: { selected: true, marked: true }
  });
  const [horaMarcada, setHoraMarcada] = useState({ horas: '', minutos: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [escalaSelecionada, setEscalaSelecionada] = useState(null);
  const navigation = useNavigation();

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

  function handleFaltasAtrasos(data) {
    setEscalaSelecionada(data);
    setModalVisible(true);
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
            <TouchableOpacity
              style={styles.btnEscalar}
              onPress={() => navigation.navigate('EscalaIndividual')}
            >
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
            <ItemListaEscala
              data={item}
              selectEscala={handleFaltasAtrasos}
              deleteItem={handleDelete}
            />
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
        <ModalFaltaAtraso
          visible={modalVisible}
          setVisible={setModalVisible}
          escala={escalaSelecionada}
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
    height: 24,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#0096c7'
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
