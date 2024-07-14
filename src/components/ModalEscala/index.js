import { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

export default function ModalEscala({ visible, setVisible, coroinha }) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [nome, setNome] = useState('');

  function handleEscalar() {
    setVisible(false);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
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

  return (
    <SafeAreaView>
      <Modal animationType='slide' visible={visible} transparent={true}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <Text style={styles.titleText}>Escalar Coroinha</Text>
            <TextInput
              placeholder='Nome'
              style={styles.input}
              value={nome || coroinha?.nome}
              onChangeText={() => {}}
            />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginBottom: 30
              }}
            >
              <TouchableOpacity
                style={styles.btnDataHora}
                onPress={showDatepicker}
              >
                <Text style={styles.textBtnDataHora}>Data</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDataHora}
                onPress={showTimepicker}
              >
                <Text style={styles.textBtnDataHora}>Hora</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.textShowDataHora}>{date.toLocaleString()}</Text>
            <TouchableOpacity style={styles.btnEscalar} onPress={handleEscalar}>
              <Text style={styles.btnText}>Escalar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {show && (
          <DateTimePicker
            testID='dateTimePicker'
            value={date}
            mode={mode}
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
    fontSize: 14,
    fontWeight: '700',
    color: '#2f3640',
    marginBottom: 15
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: '#747d8c',
    width: '100%'
  },
  btnEscalar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginTop: 50,
    borderRadius: 8,
    backgroundColor: '#0984e3',
    width: '100%'
  },
  btnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  btnDataHora: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBotton: 10,
    marginTop: 5,
    borderRadius: 8,
    backgroundColor: '#0984e3'
  },
  textBtnDataHora: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600'
  },
  textShowDataHora: {
    fontSize: 18,
    fontWeight: '700'
  }
});
