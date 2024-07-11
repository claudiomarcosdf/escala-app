import { useState, useContext } from 'react';
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
import { AntDesign } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ptBR } from '../../localeCalendar';

import ItemListaEscala from '../../components/ItemListaEscala';
import { EscalaContext } from '../../contexts/escalaContext';
import { getOnlyDateBr } from '../../utils/helpers';

const escalas = [
  {
    data: '11/07/2024',
    hora: '09:00',
    coroinha: 'Fulano de Tal',
    celular: '61 98745-3589'
  },
  {
    data: '11/07/2024',
    hora: '11:00',
    coroinha: 'Fulano de Tal',
    celular: '61 98745-3589'
  },
  {
    data: '11/07/2024',
    hora: '17:00',
    coroinha: 'Fulano de Tal',
    celular: '61 98745-3589'
  },
  {
    data: '11/07/2024',
    hora: '18:00',
    coroinha: 'Fulano de Tal',
    celular: '61 98745-3589'
  },
  {
    data: '11/07/2024',
    hora: '19:00',
    coroinha: 'Fulano de Tal',
    celular: '61 98745-3589'
  },
  {
    data: '11/07/2024',
    hora: '21:00',
    coroinha: 'Fulano de Tal',
    celular: '61 98745-3589'
  },
  {
    data: '11/07/2024',
    hora: '23:00',
    coroinha: 'Fulano de Tal',
    celular: '61 98745-3589'
  }
];

export default function Escalas() {
  let dataAtual = getOnlyDateBr();
  const [dateNow, setDateNow] = useState(new Date(dataAtual));
  const [markedDates, setMarkedDates] = useState({
    [dataAtual]: { selected: true, marked: true }
  });
  const [horaMarcada, setHoraMarcada] = useState({ horas: '', minutos: '' });

  const { getEscalas, loadingEscalas } = useContext(EscalaContext);

  function handleDayPress(date) {
    setDateNow(new Date(date.dateString));

    let markedDay = {};
    markedDay[date.dateString] = {
      selected: true,
      selectedColor: '#3b3dbf',
      textColor: '#fff'
    };

    setMarkedDates(markedDay);
  }

  function handleDelete(key) {
    if (!key) return;

    // firebase
    //   .database()
    //   .ref('coroinhas')
    //   .child(key)
    //   .remove()
    //   .then(() => {
    //     const newCoroinhasList = coroinhas.filter((item) => item.key !== key);
    //     setCoroinhas(newCoroinhasList);
    //   });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxArea}>
        <View style={styles.titleText}>
          <Text>Escalas</Text>
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
          <Text style={{ fontSize: 13, fontWeight: '600' }}>
            Escalas do dia
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.btnEscalar} onPress={() => {}}>
              <Text style={styles.textBtnEscalar}>Escalar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCompartilhar} onPress={() => {}}>
              <AntDesign name='sharealt' size={18} color='#fff' />
            </TouchableOpacity>
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
                <Text style={{ fontSize: 14, color: '#ea8685' }}>
                  Nenhuma escala encontrada!
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
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  },
  boxArea: {
    flex: 1,
    alignItems: 'center',
    padding: 15
  },
  titleText: {
    fontSize: 16,
    color: '#2f3640',
    marginBottom: 20
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#0984e3'
  },
  btnCompartilhar: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#0984e3'
  },
  list: {
    width: '100%',
    marginTop: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#dfe4ea'
  },
  textMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  }
});
