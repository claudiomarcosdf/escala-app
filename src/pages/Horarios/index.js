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
import { MaterialCommunityIcons } from '@expo/vector-icons';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

import { HorarioContext } from '../../contexts/horarioContext';
import { getOnlyDateBr } from '../../utils/helpers';

export default function CadastroHorarios() {
  let dataAtual = getOnlyDateBr();

  const [dateNow, setDateNow] = useState(new Date(dataAtual));
  const [markedDates, setMarkedDates] = useState({
    [dataAtual]: { selected: true, marked: true }
    // ['2024-10-14']: { disabled: true, disableTouchEvent: true }
  });
  const [dateTimePicker, setDateTimePicker] = useState(new Date(dataAtual)); //para hora apenas
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  const {
    loading,
    incluirHorarios,
    excluirHorarios,
    finish,
    setFinish,
    getHorarios,
    horarios
  } = useContext(HorarioContext);

  async function handleDayPress(date) {
    const selectedDate = new Date(date.dateString);
    setDateNow(selectedDate);

    let markedDay = {};
    markedDay[date.dateString] = {
      selected: true,
      selectedColor: '#3b3dbf',
      textColor: '#fff'
    };

    setMarkedDates(markedDay);
    await getHorarios(selectedDate);
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

  function handleDeleteHorarioSelecionado(horarioSelecionado) {
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

  async function salvarHorariosFinalizar() {
    const date = new Date(dateNow);
    const onlyDate = date.valueOf() + date.getTimezoneOffset() * 60 * 1000;
    const dataFormatada = format(onlyDate, 'dd/MM/yyy');

    await incluirHorarios(dataFormatada, horariosDisponiveis);
    setDateTimePicker(new Date(dataAtual));
    setHorariosDisponiveis([]);
  }

  async function handleCadastrar() {
    Keyboard.dismiss();
    if (horariosDisponiveis.length == 0) {
      Alert.alert('Atenção', 'Os horários das missas devem ser informados!');
      return;
    }

    Alert.alert('Salvar horário(s)', `Confirma?`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: () => salvarHorariosFinalizar()
      }
    ]);
  }

  function handleDeleteHorario(horarios) {
    Alert.alert('Atenção', `Excluir horários do dia ${horarios.data}?`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Excluir',
        onPress: () => excluirHorarios(horarios.key)
      }
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxArea}>
        <View>
          <Text style={styles.titleText}>Horários das Missas</Text>
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
              onPress={() => handleDeleteHorarioSelecionado(horario)}
            >
              {horario}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.btnCadastrar}
          onPress={handleCadastrar}
          disabled={loading ? true : false}
        >
          <Text style={styles.btnText}>
            {loading ? 'Salvando Horários...' : 'Cadastrar horários'}
          </Text>
        </TouchableOpacity>
        {loading && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size={20} color='#0984e3' />
          </View>
        )}
        {finish && (
          <View style={styles.boxMessage}>
            <View style={styles.iconAndtext}>
              <AntDesign name='checkcircle' size={16} color='#2ecc71' />
              <Text style={styles.textMessage}>
                Horários cadastrados com sucesso!
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setFinish(false)}
              style={styles.btnFinish}
            >
              <Text style={styles.textBtnFinish}>Fechar</Text>
            </TouchableOpacity>
          </View>
        )}

        {horarios && (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 8,
              marginTop: 30,
              borderWidth: 1,
              borderColor: '#2ecc71',
              borderRadius: 5
            }}
          >
            <Text
              style={{ fontWeight: '500' }}
            >{`Horários do dia ${horarios.data}`}</Text>
            <Text style={{ fontWeight: '700', marginBottom: 5 }}>
              {horarios.horarios.join(' - ')}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteHorario(horarios)}>
              <MaterialCommunityIcons
                name='trash-can-outline'
                size={25}
                color='#ee5253'
              />
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
    marginBottom: 15
  },
  btnCadastrar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBotton: 10,
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
    marginBottom: 10,
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
    height: 40,
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
    height: 40,
    padding: 10,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#0096c7',
    fontWeight: '700',
    width: 120
  },
  textHorariosSelecionados: {
    marginBottom: 5,
    fontSize: 14,
    color: '#0096c7',
    fontWeight: '700'
  },
  boxHorarioDisponivel: {
    padding: 5,
    paddingHorizontal: 10,
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
