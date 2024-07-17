import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ptBR } from '../../localeCalendar';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

import { EscalaContext } from '../../contexts/escalaContext';
import { getOnlyDateBr } from '../../utils/helpers';

export default function GeradorEscalas() {
  let dataAtual = getOnlyDateBr();

  const [dateNow, setDateNow] = useState(new Date(dataAtual));
  const [markedDates, setMarkedDates] = useState({
    [dataAtual]: { selected: true, marked: true }
  });
  const [dateTimePicker, setDateTimePicker] = useState(new Date(dataAtual)); //para hora apenas
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  const { gerarEscala, building, finish, setFinish } =
    useContext(EscalaContext);

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

  function handleAdicionarHorario() {
    const dataEscolhida = dateNow;
    const dataHoje = new Date(dataAtual);
    if (dataEscolhida < dataHoje) {
      Alert.alert('Atenção', 'A data selecionada é menor que a data atual.');
      return;
    }

    const horaMarcada = dateTimePicker.toLocaleTimeString('pt-BR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    }); // 00:00

    const horarioJaExisteIndex = horariosDisponiveis.findIndex(
      (horario) => horario === horaMarcada
    );
    if (horarioJaExisteIndex != -1) {
      Alert.alert('Atenção', 'O horário já existe!');
      return;
    }

    setHorariosDisponiveis((oldHorarios) => [...oldHorarios, horaMarcada]);
  }

  function handleDeleteHorario(horarioSelecionado) {
    Alert.alert(
      'Atenção',
      `Confirma exclusão do horário "${horarioSelecionado}"`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => {
            const newListHoariosDisponiveis = horariosDisponiveis.filter(
              (horario) => horario !== horarioSelecionado
            );
            setHorariosDisponiveis([...newListHoariosDisponiveis]);
          }
        }
      ]
    );
  }

  const onChangeTimePicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowTimePicker(false);
    setDateTimePicker(currentDate);
  };

  function onTimePicker() {
    setShowTimePicker(true);
  }

  async function handleGerar() {
    //console.log('formato americano: ', dateNow);
    Keyboard.dismiss();
    if (horariosDisponiveis.length == 0) {
      Alert.alert('Atenção', 'Os horários das missas devem ser informados!');
      return;
    }

    const date = new Date(dateNow);
    const onlyDate = date.valueOf() + date.getTimezoneOffset() * 60 * 1000;
    const dataFormatada = format(onlyDate, 'dd/MM/yyy');
    await gerarEscala(dataFormatada, horariosDisponiveis);
    setDateTimePicker(new Date(dataAtual));
    setHorariosDisponiveis([]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxArea}>
        <View>
          <Text style={styles.titleText}>Gerador de Escalas</Text>
        </View>

        <View style={styles.boxCalendar}>
          <Calendar
            current={dataAtual}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            enableSwipeMonths={true}
            style={{ borderRadius: 5 }}
            theme={{
              //todayTextColor: '#ff0000',
              todayTextColor: '#000',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#fff'
            }}
          />
        </View>

        <View style={styles.boxHorario}>
          <TouchableOpacity style={styles.btnHora} onPress={onTimePicker}>
            <Text style={styles.textBtnHora}>Selecione o horário</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <TextInput
              placeholder='Hora selecionada'
              style={styles.textInputHora}
              value={dateTimePicker.toLocaleTimeString('pt-BR', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })}
              showSoftInputOnFocus={false}
              selectTextOnFocus={false}
              onChangeText={() => {}}
            />
          </TouchableWithoutFeedback>

          <TouchableOpacity
            style={styles.plusButton}
            onPress={handleAdicionarHorario}
          >
            <Feather name='plus' size={22} color='#fff' />
          </TouchableOpacity>
        </View>

        <Text style={styles.textHorariosSelecionados}>
          Horários das missas selecionados
        </Text>
        {horariosDisponiveis.length === 0 && (
          <Text style={{ fontSize: 12 }}>Nenhum selecionado</Text>
        )}
        <View style={{ flexDirection: 'row', marginBottom: 25 }}>
          {horariosDisponiveis.map((horario) => (
            <Text
              key={horario}
              style={styles.boxHorarioDisponivel}
              onPress={() => handleDeleteHorario(horario)}
            >
              {horario}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.btnCadastrar}
          onPress={handleGerar}
          disabled={building ? true : false}
        >
          <Text style={styles.btnText}>
            {building ? 'Gerando Escalas...' : 'Gerar Escalas'}
          </Text>
        </TouchableOpacity>
        {building && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size={20} color='#0984e3' />
          </View>
        )}
        {finish && (
          <View style={styles.boxMessage}>
            <View style={styles.iconAndtext}>
              <AntDesign name='checkcircle' size={16} color='#2ecc71' />
              <Text style={styles.textMessage}>Escala gerada com sucesso!</Text>
            </View>
            <TouchableOpacity
              onPress={() => setFinish(false)}
              style={styles.btnFinish}
            >
              <Text style={styles.textBtnFinish}>Fechar</Text>
            </TouchableOpacity>
          </View>
        )}

        {showTimePicker && (
          <DateTimePicker
            testID='dtTimePicker'
            value={dateTimePicker}
            mode={'time'}
            locale='pt-BR'
            is24Hour={true}
            onChange={onChangeTimePicker}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 5,
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
    marginBottom: 25
  },
  btnCadastrar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBotton: 10,
    marginTop: 5,
    borderRadius: 8,
    backgroundColor: '#0984e3',
    backgroundColor: '#0096c7',
    width: '100%'
  },
  btnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  boxHorario: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center'
  },
  plusButton: {
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 50,
    width: 55,
    height: 35,
    padding: 4,
    borderWidth: 1,
    borderColor: '#02c39a',
    backgroundColor: '#02c39a'
  },
  btnHora: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 45,
    borderRadius: 50,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#0096c7'
  },
  textBtnHora: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600'
  },
  textInputHora: {
    backgroundColor: '#F2f6fc',
    borderRadius: 50,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: 45,
    padding: 10,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#0096c7',
    fontWeight: '700',
    width: 120
  },
  textHorariosSelecionados: {
    marginBottom: 5,
    fontSize: 16,
    color: '#0096c7',
    fontWeight: '700'
  },
  boxHorarioDisponivel: {
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 4,
    borderRadius: 5,
    fontWeight: '500',
    backgroundColor: '#ffeaa7'
  },
  btnFinish: {
    // width: 70,
    // height: 20,
    paddingHorizontal: 10,
    paddingtop: 2,
    paddingBottom: 2,
    borderRadius: 5,
    marginTop: 4,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textBtnFinish: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 13
  },
  boxMessage: { marginTop: 20, alignItems: 'center' },
  iconAndtext: { flexDirection: 'row', alignItems: 'center' },
  textMessage: { color: '#2ecc71', fontWeight: '700', marginLeft: 5 }
});
