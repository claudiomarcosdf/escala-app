import { useEffect, useState, useContext } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import Dropdown from 'react-native-input-select';
import moment from 'moment-timezone';
import { format } from 'date-fns';
import ptBrToDataPicker from 'date-fns/locale/pt-BR';
import DateTimePicker from '@react-native-community/datetimepicker';

import AppStyles from '../../appStyles';
import { EscalaContext } from '../../contexts/escalaContext';
import { getOnlyDateBr } from '../../utils/helpers';
import PrintEscala from '../../components/PrintEscala';

export default function Relatorios() {
  let dataAtual = getOnlyDateBr();
  const [dataInicial, setDataInicial] = useState(new Date(dataAtual));
  const [dataFinal, setDataFinal] = useState(new Date(dataAtual));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [dataTipo, setDataTipo] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState(null);

  const {
    getEscalasRelatorio,
    setEscalasRelatorio,
    escalasRelatorio,
    loading
  } = useContext(EscalaContext);

  useEffect(() => {
    if (escalasRelatorio.length != 0) setEscalasRelatorio([]);
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);

    if (dataTipo == 'inicial') setDataInicial(currentDate);
    else setDataFinal(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  function showDatepicker(value) {
    setDataTipo(value);
    showMode('date');
  }

  function getTextoDatas() {
    const dtInicio = format(dataInicial, 'dd/MM/yyy');
    const dtFinal = format(dataFinal, 'dd/MM/yyy');
    return `${dtInicio} até ${dtFinal}`;
  }

  async function handleConsultar() {
    if (!dataInicial && !dataFinal) {
      Alert.alert('Atenção', 'Favor informar a data inicial e final.');
      return;
    }
    setEscalasRelatorio([]);

    const dtInicio = format(dataInicial, 'dd/MM/yyy');
    const dtFinal = format(dataFinal, 'dd/MM/yyy');
    await getEscalasRelatorio(dtInicio, dtFinal, tipoPessoa);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaElements}>
        <Text style={styles.titleText}>Relatórios</Text>
        <View style={{}}>
          <Text style={styles.subtitleText}>Consulta de Escalas</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.btnData}
            onPress={() => showDatepicker('inicial')}
          >
            <Text style={styles.textBtnData}>Data inicial</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <TextInput
              placeholder='Data inicial'
              style={styles.textInputData}
              value={format(dataInicial, 'dd/MM/yyy')}
              showSoftInputOnFocus={false}
              selectTextOnFocus={false}
              onChangeText={() => {}}
            />
          </TouchableWithoutFeedback>

          <TouchableOpacity
            style={[styles.btnData, { borderRadius: 0, marginLeft: 10 }]}
            onPress={() => showDatepicker('final')}
          >
            <Text style={styles.textBtnData}>Data final</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <TextInput
              placeholder='Data final'
              style={[styles.textInputData, { borderRadius: 50 }]}
              value={format(dataFinal, 'dd/MM/yyy')}
              showSoftInputOnFocus={false}
              selectTextOnFocus={false}
              onChangeText={() => {}}
            />
          </TouchableWithoutFeedback>
        </View>

        <View
          style={{ flexDirection: 'row', marginHorizontal: 5, marginTop: 15 }}
        >
          <Dropdown
            placeholder='Função da pessoa...'
            placeholderStyle={{ opacity: 0.5 }}
            dropdownStyle={styles.dropdown}
            options={[
              { label: 'Cerimoniário', value: 'Cerimoniário' },
              { label: 'Coroinha', value: 'Coroinha' },
              { label: 'Mesce', value: 'Mesce' }
            ]}
            selectedValue={tipoPessoa}
            onValueChange={(value) => setTipoPessoa(value)}
            primaryColor={AppStyles.color.primary}
          />
        </View>

        <TouchableOpacity
          style={styles.btnConsultar}
          onPress={() => handleConsultar()}
        >
          <Text style={styles.textBtnConsultar}>
            {loading ? 'Consultando...' : 'Consultar'}
          </Text>
        </TouchableOpacity>
        {loading && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size={20} color={AppStyles.color.loading} />
          </View>
        )}

        {escalasRelatorio.length != 0 && (
          <>
            <Text style={styles.textOpcoes}>
              Opções de impressão e compartilhamento
            </Text>
            <View style={styles.boxOpcoes}>
              <PrintEscala
                data={escalasRelatorio}
                intervalDates={getTextoDatas()}
                heightBottom={40}
                widthBottom={40}
                iconSize={20}
                iconColor={AppStyles.color.blueLightColor}
              />
            </View>
          </>
        )}
      </View>
      {show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={dataTipo == 'inicial' ? dataInicial : dataFinal}
          mode={mode}
          locale='pt-BR'
          is24Hour={true}
          onChange={onChange}
        />
      )}
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
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 25
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 30
  },
  btnData: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 40,
    borderWidth: 1.4,
    borderColor: AppStyles.color.secondary,
    borderRadius: 50,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: AppStyles.color.primary
  },
  textBtnData: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600'
  },
  textInputData: {
    color: AppStyles.color.primary,
    marginBottom: 10,
    backgroundColor: '#F2f6fc',
    // borderRadius: 50,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: 40,
    padding: 3,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: AppStyles.color.primary,
    fontSize: 13,
    fontWeight: '700',
    width: 100
  },
  dropdown: {
    borderColor: '#747d8c',
    backgroundColor: '#FFF',
    borderRadius: 4
  },
  textBtnConsultar: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  btnConsultar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBotton: 10,
    marginTop: 30,
    borderWidth: 1.4,
    borderColor: AppStyles.color.secondary,
    borderRadius: 5,
    backgroundColor: AppStyles.color.primary,
    width: '100%'
  },
  textOpcoes: {
    color: AppStyles.color.blueLightColor,
    fontSize: 12,
    marginTop: 40,
    marginBottom: 5
  },
  boxOpcoes: {
    flexDirection: 'row',
    width: 110,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    borderWidth: 1.4,
    borderColor: AppStyles.color.secondary,
    borderRadius: 5
  }
});
