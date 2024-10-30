import { useState, useContext } from 'react';
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Keyboard
} from 'react-native';

import { format } from 'date-fns';
import ptBrToDataPicker from 'date-fns/locale/pt-BR';
import DateTimePicker from '@react-native-community/datetimepicker';

import AppStyles from '../../appStyles';
import { getOnlyDateBr } from '../../utils/helpers';
import { EscalaContext } from '../../contexts/escalaContext';

export default function ModalEscala({ visible, setVisible, pessoa }) {
  let dataAtual = getOnlyDateBr();
  const [date, setDate] = useState(new Date(dataAtual));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [nome, setNome] = useState('');

  const { escalarPessoa, building } = useContext(EscalaContext);

  async function handleEscalar() {
    const dataSelecionada = format(date, 'dd/MM/yyy');
    const horaSelecionada = date.toLocaleTimeString('pt-BR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    const novaEscala = {
      keypessoa: pessoa.key,
      pessoa: pessoa.nome,
      tipopessoa: pessoa.tipo,
      data: dataSelecionada,
      hora: horaSelecionada,
      atraso: false,
      falta: false
    };

    const gerouEscala = await escalarPessoa(novaEscala);
    if (gerouEscala) setVisible(false);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    const dataHoje = new Date(dataAtual);
    setShow(false);
    if (currentDate < dataHoje) {
      Alert.alert('Atenção', 'A data selecionada é menor que a data atual.');
      return;
    }

    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  function showDatepicker() {
    showMode('date');
  }

  function showTimepicker() {
    showMode('time');
  }

  function handleCancelar() {
    setDate(new Date(dataAtual));
    setVisible(false);
  }

  return (
    <SafeAreaView>
      <Modal animationType='slide' visible={visible} transparent={true}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <Text style={styles.titleText}>Escalar Pessoa</Text>
            <TextInput
              placeholder='Nome'
              style={styles.input}
              maxLength={47}
              numberOfLines={1}
              value={nome || pessoa?.nome}
              showSoftInputOnFocus={false}
              selectTextOnFocus={false}
              onChangeText={() => {}}
            />
            <View
              style={{
                marginBottom: 30,
                marginTop: 20
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={styles.btnDataHora}
                  onPress={showDatepicker}
                >
                  <Text style={styles.textBtnDataHora}>Data</Text>
                </TouchableOpacity>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <TextInput
                    placeholder='Data selecionada'
                    style={styles.textInputDataHora}
                    value={format(date, 'dd/MM/yyy')}
                    showSoftInputOnFocus={false}
                    selectTextOnFocus={false}
                    onChangeText={() => {}}
                  />
                </TouchableWithoutFeedback>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={styles.btnDataHora}
                  onPress={showTimepicker}
                >
                  <Text style={styles.textBtnDataHora}>Hora</Text>
                </TouchableOpacity>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <TextInput
                    placeholder='Hora selecionada'
                    style={styles.textInputDataHora}
                    value={date.toLocaleTimeString('pt-BR', {
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    showSoftInputOnFocus={false}
                    selectTextOnFocus={false}
                    onChangeText={() => {}}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>

            <Text style={styles.textShowDataHora}>
              {date.toLocaleString('pt-BR', {
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </Text>

            {building && (
              <ActivityIndicator size={20} color={AppStyles.color.loading} />
            )}

            <TouchableOpacity style={styles.btnEscalar} onPress={handleEscalar}>
              <Text style={styles.btnText}>Escalar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={handleCancelar}
            >
              <Text
                style={[
                  styles.btnText,
                  { color: AppStyles.color.primary, fontWeight: '600' }
                ]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {show && (
          <DateTimePicker
            testID='dateTimePicker'
            value={date}
            mode={mode}
            locale='pt-BR'
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
    paddingHorizontal: 5,
    backgroundColor: '#22222266'
  },
  modal: {
    marginTop: 5,
    paddingTop: 45,
    paddingHorizontal: 5,
    height: 500,
    borderRadius: 5,
    backgroundColor: '#F2f6fc',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppStyles.color.background,
    marginBottom: 15
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    color: AppStyles.color.background,
    borderColor: '#747d8c',
    width: '100%',
    fontSize: 15,
    fontWeight: '700',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  btnEscalar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginTop: 20,
    backgroundColor: AppStyles.color.primary,
    borderWidth: 1.4,
    borderColor: AppStyles.color.secondary,
    borderRadius: 5,
    width: '100%'
  },
  btnCancelar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginTop: 15,
    borderRadius: 8,
    borderWidth: 1.4,
    borderColor: AppStyles.color.primary,
    backgroundColor: '#ffffff',
    width: '100%'
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  },
  btnDataHora: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 45,
    borderWidth: 1.4,
    borderColor: AppStyles.color.secondary,
    borderRadius: 50,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: AppStyles.color.primary
  },
  textBtnDataHora: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  textInputDataHora: {
    color: AppStyles.color.primary,
    marginBottom: 10,
    backgroundColor: '#F2f6fc',
    borderRadius: 50,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: 45,
    padding: 10,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: AppStyles.color.primary,
    fontWeight: '700',
    width: 120
  },
  textShowDataHora: {
    color: AppStyles.color.blueLightColor,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 25
  }
});
