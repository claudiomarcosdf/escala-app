import { useEffect, useState, useContext } from 'react';
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Keyboard
} from 'react-native';
import Checkbox from 'expo-checkbox';
import firebase from '../../firebaseConfig';
import { CoroinhaContext } from '../../contexts/coroinhaContext';
import { EscalaContext } from '../../contexts/escalaContext';
import ItemListaCoroinhaChecked from '../ItemListaCoroinhaChecked';

export default function ModalCoroinhasSelecionados({ visible, setVisible }) {
  const [allChecked, setAllChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { coroinhas } = useContext(CoroinhaContext);
  const { coroinhasSelecionados, setCoroinhasSelecionados } =
    useContext(EscalaContext);

  // useEffect(() => {
  //   setLoading(true);
  //   if (coroinhas && coroinhas?.length != 0) {
  //     const listSelected = coroinhas.map((coroinha) => {
  //       return {
  //         key: coroinha.key,
  //         nome: coroinha.nome,
  //         celular: coroinha.celular,
  //         checked: false
  //       };
  //     });

  //     setCoroinhasSelecionados(listSelected);
  //   }
  //   setLoading(false);
  // }, []);

  function handleConfirmar() {
    const coroinhasConfirm = coroinhasSelecionados.filter(
      (coroinha) => coroinha.checked == true
    );

    setCoroinhasSelecionados(coroinhasConfirm); //coroinhas escolhidos
    setVisible(false);
  }

  function handleCheck(data) {
    const newSelecteds = coroinhasSelecionados.map((coroinha) => {
      if (coroinha.key == data.key) {
        return {
          ...coroinha,
          checked: !data.checked
        };
      }
      return coroinha;
    });
    setCoroinhasSelecionados(newSelecteds);
  }

  function handleAllChecked(value) {
    setAllChecked(value);
    const newSelecteds = coroinhasSelecionados.map((coroinha) => {
      return {
        ...coroinha,
        checked: value
      };
    });
    setCoroinhasSelecionados(newSelecteds);
  }

  return (
    <SafeAreaView>
      <Modal animationType='slide' visible={visible} transparent={true}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <Text style={styles.titleText}>Coroinhas Selecionados</Text>

            <View style={styles.checkBoxAll}>
              <Checkbox
                value={allChecked}
                onValueChange={(value) => handleAllChecked(value)}
                color={true ? '#778da9' : undefined}
              />
            </View>
            <FlatList
              style={styles.list}
              keyExtractor={(item) => item.key}
              data={coroinhasSelecionados}
              renderItem={({ item }) => (
                <ItemListaCoroinhaChecked
                  data={item}
                  setChecked={handleCheck}
                />
              )}
              ListEmptyComponent={
                loading ? (
                  <View style={styles.textMessage}>
                    <Text style={styles.textMessage}>Carregando...</Text>
                  </View>
                ) : (
                  <View style={styles.textMessage}>
                    <Text style={{ fontSize: 14, color: '#ee5253' }}>
                      Nenhum coroinha cadastrado!
                    </Text>
                  </View>
                )
              }
            />

            <TouchableOpacity
              style={styles.btnConfirmar}
              onPress={handleConfirmar}
            >
              <Text style={[styles.btnText, { color: '#0096c7' }]}>
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
    marginTop: 35,
    paddingHorizontal: 5,
    backgroundColor: '#22222266'
  },
  modal: {
    flex: 1,
    marginTop: 5,
    paddingTop: 35,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#F2f6fc',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f3640',
    marginBottom: 0
  },
  checkBoxAll: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 15
  },
  list: {
    width: '100%',
    marginTop: 2,
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#dfe4ea'
  },
  btnConfirmar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0096c7',
    backgroundColor: '#ffffff',
    width: '100%'
  },
  textMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  }
});
