import { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ptBR } from '../../localeCalendar';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

import { EscalaContext } from '../../contexts/escalaContext';

export default function GeradorEscalas() {
  const inputRef = useRef(null);
  const [dateNow, setDateNow] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});
  const [horaMarcada, setHoraMarcada] = useState({ horas: '', minutos: '' });
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [building, setBuilding] = useState(false);

  const { gerarEscala } = useContext(EscalaContext);

  function handleDayPress(date) {
    setDateNow(new Date(date.dateString));

    let markedDay = {};
    markedDay[date.dateString] = {
      selected: true,
      selectedColor: '#3b3dbf',
      textColor: '#fff'
    }

    setMarkedDates(markedDay);
  }

  function checkLimit(value, limit) {
    if (value == '') return true;
    const parsedQty = Number.parseInt(value)
    if (Number.isNaN(parsedQty)) {
      alert('Horário inválido!');
    } else if (parsedQty > limit) {
      alert('Horário inválido!');
    } else {
      return true;
    }
  }

  function onCheckLimitHours(value) {
    if (checkLimit(value, 23)) setHoraMarcada({ ...horaMarcada, horas: value })
  }

  function onCheckLimitMinuts(value) {
    if (checkLimit(value, 59)) setHoraMarcada({ ...horaMarcada, minutos: value })
  }

  function handleAdicionarHorario() {
    if (horaMarcada.horas == '' || horaMarcada.minutos == '') alert('Favor informar horas e minutos!');

    const novoHorario = horaMarcada.horas + ':' + horaMarcada.minutos;
    const horarioJaExisteIndex = horariosDisponiveis.findIndex((horario) => horario === novoHorario);
    if (horarioJaExisteIndex != -1) {
      alert('O horário já existe!');
      return;
    }

    setHorariosDisponiveis(oldHorarios => [...oldHorarios, novoHorario]);
    setHoraMarcada({ horas: '', minutos: '' });
    inputRef.current.focus();
  }

  function handleDeleteHorario(horarioSelecionado) {
    Alert.alert('Atenção', `Confirma exclusão do horário "${horarioSelecionado}"`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => {
          const newListHoariosDisponiveis = horariosDisponiveis.filter((horario) => horario !== horarioSelecionado);
          setHorariosDisponiveis([...newListHoariosDisponiveis]);

        }
      }
    ])
  }

  async function handleGerar() {
    //console.log('formato americano: ', dateNow);
    Keyboard.dismiss();
    if (horariosDisponiveis.length == 0) {
      alert('Os horários das missas devem ser informados!');
      return;
    }
    setBuilding(true);
    const date = new Date(dateNow);
    const onlyDate = date.valueOf() + date.getTimezoneOffset() * 60 * 1000;
    const dataFormatada = format(onlyDate, 'dd/MM/yyy');
    await gerarEscala(dataFormatada, horariosDisponiveis);
    setBuilding(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxArea}>
        <View style={styles.titleText}>
          <Text>Gerador de Escalas</Text>
        </View>

        <View style={styles.boxCalendar}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            enableSwipeMonths={true}
            style={{ borderRadius: 5 }}
            theme={{
              todayTextColor: '#ff0000',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#fff'
            }}
          />
        </View>

        <View style={styles.boxHorario}>
          <Text style={{ padding: 3 }}>{"Informe o horário: "}</Text>
          <TextInput
            ref={inputRef}
            style={styles.inputHoras}
            keyboardType={"numeric"}
            maxLength={2}
            value={horaMarcada.horas}
            onChangeText={onCheckLimitHours}
          />
          <Text style={{ padding: 3 }}>{":"}</Text>
          <TextInput
            style={styles.inputMinutos}
            keyboardType={"numeric"}
            maxLength={2}
            value={horaMarcada.minutos}
            onChangeText={onCheckLimitMinuts}
          />
          <TouchableOpacity style={styles.plusButton} onPress={handleAdicionarHorario}>
            <Feather name="plus" size={17} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={{ color: "#0652DD", fontWeight: '700' }}>Horários das missas</Text>
        {horariosDisponiveis.length === 0 && <Text style={{ fontSize: 12 }}>Não informado</Text>}
        <View style={{ flexDirection: "row", marginBottom: 25 }}>
          {horariosDisponiveis.map((horario) =>
            <Text key={horario} style={styles.boxHorarioDisponivel} onPress={() => handleDeleteHorario(horario)}>{horario}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.btnCadastrar} onPress={handleGerar} disabled={building ? true : false}>
          <Text style={styles.btnText}>{building ? 'Gerando Escalas...' : 'Gerar Escalas'}</Text>
        </TouchableOpacity>
        {building && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size={20} color='#0984e3' />
          </View>

        )}
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
    width: '100%'
  },
  btnText: {
    color: '#FFF',
    fontSize: 14
  },
  boxHorario: {
    flexDirection: "row",
    marginBottom: 20
  },
  inputHoras: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: '#747d8c',
  },
  inputMinutos: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: '#747d8c',
  },
  plusButton: {
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 4,
    width: 40,
    height: 30,
    padding: 4,
    borderWidth: 1,
    backgroundColor: '#2d3436'
  },
  boxHorarioDisponivel: {
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 6,
    fontWeight: '500',
    backgroundColor: '#ffeaa7'
  }
});
