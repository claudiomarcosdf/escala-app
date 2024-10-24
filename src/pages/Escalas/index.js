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

import AppStyles from '../../appStyles';
import ItemListaEscala from '../../components/ItemListaEscala';
import PrintEscala from '../../components/PrintEscala';
import { EscalaContext } from '../../contexts/escalaContext';
import {
  getOnlyDateBr,
  getDataToFilterFirebase,
  getAmericanDate
} from '../../utils/helpers';
import ModalFaltaAtraso from '../../components/ModalFaltaAtraso';

export default function Escalas() {
  let dataAtual = getOnlyDateBr();
  const [dateNow, setDateNow] = useState(new Date(dataAtual));
  const [markedDates, setMarkedDates] = useState({
    [dataAtual]: {
      selected: true,
      marked: true,
      selectedColor: AppStyles.color.blueLightColor
    }
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
      selectedColor: AppStyles.color.secondary,
      textColor: '#fff'
    };

    setMarkedDates(markedDay);
    exibirEscalas(date.dateString);
  }

  function handleDelete(key, pessoa) {
    if (!key) return;
    Alert.alert('Atenção', `Confirma exclusão de ${pessoa} da escala?`, [
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
    const dataEscala = new Date(getAmericanDate(data.data));
    const dataHoje = new Date(dataAtual);
    if (dataEscala < new Date(dataAtual)) {
      Alert.alert('Atenção', 'Não é mais possível lançar faltas ou atrasos.');
      return;
    }

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
            style={{
              borderRadius: 5,
              backgroundColor: AppStyles.color.primary
            }}
            theme={{
              todayTextColor: '#000',
              selectedDayBackgroundColor: AppStyles.color.secondary,
              selectedDayTextColor: '#fff'
            }}
          />
        </View>

        <View style={styles.boxComands}>
          <Text
            style={{
              fontSize: 13,
              fontColor: AppStyles.color.primary,
              fontWeight: '600'
            }}
          >
            Escala do dia
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.btnEscalar}
              onPress={() => navigation.navigate('EscalaIndividual')}
            >
              <Text style={styles.textBtnEscalar}>Escalar pessoa</Text>
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
                <Text style={{ fontSize: 14, color: AppStyles.color.danger }}>
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
    backgroundColor: AppStyles.color.background
  },
  boxArea: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
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
    borderRadius: 5,
    padding: 3,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    marginBottom: 3
  },
  textBtnEscalar: { color: '#fff', fontSize: 12, fontWeight: '700' },
  btnEscalar: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: AppStyles.color.primary
  },
  // btnCompartilhar: {
  //   marginLeft: 0,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: 25,
  //   width: 25,
  //   paddingHorizontal: 0,
  //   borderRadius: 50
  //    backgroundColor: AppStyles.color.loading
  // },
  list: {
    width: '100%',
    marginTop: 3,
    padding: 5,
    borderRadius: 8,
    backgroundColor: AppStyles.color.secondary
  },
  textMessage: {
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  }
});
