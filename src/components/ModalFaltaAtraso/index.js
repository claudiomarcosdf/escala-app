import { useEffect, useState, useContext } from 'react';
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
  Keyboard,
  Switch
} from 'react-native';

import AppStyles from '../../appStyles';
import { EscalaContext } from '../../contexts/escalaContext';

export default function ModalFaltaAtraso({ visible, setVisible, escala }) {
  const [isFalta, setIsFalta] = useState(false);
  const [isAtraso, setIsAtraso] = useState(false);
  const [show, setShow] = useState(false);
  const { lancarFaltaAtraso } = useContext(EscalaContext);

  useEffect(() => {
    if (escala) {
      setIsFalta(escala.falta);
      setIsAtraso(escala.atraso);
    }
  }, [escala]);

  function handleConfirmar() {
    Alert.alert('Alteração', `Confirma as alterações?`, [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: () => {
          setIsFalta(false);
          setIsAtraso(false);
          setVisible(false);
        }
      },
      {
        text: 'Continuar',
        onPress: () => {
          const escalaToUpdate = {
            ...escala,
            falta: isFalta,
            atraso: isAtraso
          };
          lancarFaltaAtraso(escalaToUpdate);
          setVisible(false);
        }
      }
    ]);
  }

  const toggleFalta = (value) => {
    setIsFalta((previousState) => !previousState);
    if (value) setIsAtraso(false);
  };

  const toggleAtraso = (value) => {
    setIsAtraso((escalaSelecionadaiousState) => !escalaSelecionadaiousState);
    if (value) setIsFalta(false);
  };

  return (
    <SafeAreaView>
      <Modal animationType='slide' visible={visible} transparent={true}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <Text style={styles.titleText}>Faltas e Atrasos</Text>

            <View style={styles.boxFalta}>
              <Text style={styles.textLabel}>Falta</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#fab1a0' }}
                thumbColor={isFalta ? AppStyles.color.danger : '#f4f3f4'}
                ios_backgroundColor='#3e3e3e'
                onValueChange={toggleFalta}
                value={isFalta}
                style={{ width: 70 }}
              />
            </View>
            <View style={styles.boxFalta}>
              <Text style={styles.textLabel}>Atraso</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#fab1a0' }}
                thumbColor={isAtraso ? AppStyles.color.danger : '#f4f3f4'}
                ios_backgroundColor='#3e3e3e'
                onValueChange={toggleAtraso}
                value={isAtraso}
                style={{ width: 70 }}
              />
            </View>

            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={handleConfirmar}
            >
              <Text
                style={[styles.btnText, { color: AppStyles.color.primary }]}
              >
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 35,
    paddingHorizontal: 5,
    backgroundColor: '#22222266'
  },
  modal: {
    marginTop: 5,
    paddingTop: 15,
    paddingHorizontal: 5,
    height: 255,
    borderRadius: 5,
    backgroundColor: '#F2f6fc',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppStyles.color.primary,
    marginBottom: 45
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
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  boxFalta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  textLabel: {
    color: AppStyles.color.primary,
    width: 50,
    paddingLeft: 5,
    fontWeight: '600'
  }
});
