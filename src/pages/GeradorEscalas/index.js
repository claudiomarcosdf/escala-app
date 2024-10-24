import { useEffect, useMemo, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';
import Dropdown from 'react-native-input-select';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from '../../localeCalendar';

import AppStyles from '../../appStyles';
import { HorarioContext } from '../../contexts/horarioContext';
import { EscalaContext } from '../../contexts/escalaContext';
import { HorarioPessoaContext } from '../../contexts/horariosPessoaContext';
import { getDataToFilterFirebase, getFullDateBR } from '../../utils/helpers';
import ItemListaHorarioPessoa from '../../components/ItemListaHorarioPessoa';

export default function GeradorEscalas() {
  let dataAtual = getDataToFilterFirebase();
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horariosDoDia, setHorariosDoDia] = useState([]);
  const [dateNow, setDateNow] = useState(new Date(dataAtual));

  const { getHorariosAtivos, horarios } = useContext(HorarioContext);
  const {
    loading: loadingVoluntarios,
    setHorariosVoluntariosDia,
    getHorariosVoluntariosDoDia,
    horariosVoluntariosDia,
    excluirHorariosPessoa
  } = useContext(HorarioPessoaContext);
  const { gerarEscala, building, finish, setFinish } =
    useContext(EscalaContext);

  useEffect(() => {
    //seleciona as datas maiores que o dia atual
    async function buscaHorarios() {
      await getHorariosAtivos(dataAtual);
    }
    buscaHorarios();
  }, []);

  useMemo(() => {
    exibeHorariosDoDia();
  }, [dataSelecionada]);

  function getDatas() {
    return horarios?.map((horario) => {
      return { label: getFullDateBR(horario.data), value: horario.data };
    });
  }

  function exibeHorariosDoDia() {
    if (!horarios) return;
    if (!dataSelecionada) {
      setHorariosDoDia([]);
      return;
    }

    const objDataSelecionada = horarios.filter(
      (horario) => horario.data == dataSelecionada
    );
    setHorariosDoDia(objDataSelecionada[0].horarios);
  }

  function getTotalVoluntarios() {
    return dataSelecionada
      ? horariosVoluntariosDia.length != 0
        ? horariosVoluntariosDia.length
        : 0
      : 0;
  }

  async function gerarEscalasFinalizar(embaralhar) {
    //console.log(horariosVoluntariosDia);
    await gerarEscala(
      dataSelecionada,
      horariosDoDia,
      horariosVoluntariosDia,
      embaralhar
    );
    setDataSelecionada(null);
  }

  async function handleGerar() {
    Keyboard.dismiss();
    if (!dataSelecionada || horariosVoluntariosDia.length == 0) {
      Alert.alert('Atenção', 'Não há voluntários para esta data!');
      return;
    }

    Alert.alert('Embaralhar', `Deseja embaralhar os voluntários às vagas?`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: () => gerarEscalasFinalizar(true)
      },
      {
        text: 'Não',
        onPress: () => gerarEscalasFinalizar(false)
      }
    ]);
  }

  async function handleChangeData(value) {
    setDataSelecionada(value);
    await getHorariosVoluntariosDoDia(value);
  }

  async function handleDelete(key, data) {
    if (!key) return;

    Alert.alert('Atenção', `Excluir horários do candidato?`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => {
          excluirHorariosPessoa(key, data);
        }
      }
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxArea}>
        <View>
          <Text style={styles.titleText}>Gerador de Escalas</Text>
        </View>

        <View style={styles.boxDropdown}>
          <Dropdown
            placeholder='Selecione o dia...'
            placeholderStyle={{ opacity: 0.5 }}
            selectedItemStyle={{
              color: AppStyles.color.primary,
              fontSize: 16,
              fontWeight: '900'
            }}
            dropdownStyle={styles.dropdown}
            options={horarios ? getDatas() : null}
            selectedValue={dataSelecionada}
            onValueChange={(value) => {
              handleChangeData(value);
            }}
            primaryColor={AppStyles.color.primary}
          />
        </View>

        <Text style={styles.textHorariosSelecionados}>
          Horários das missas do dia
        </Text>
        {horariosDoDia.length === 0 && (
          <Text style={{ fontSize: 12, color: '#fff' }}>
            Nenhuma data selecionada
          </Text>
        )}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {horariosDoDia.map((horario) => (
            <Text key={horario} style={styles.boxHorarioDisponivel}>
              {horario}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.btnGerar}
          onPress={handleGerar}
          disabled={building ? true : false}
        >
          <Text style={styles.btnText}>
            {building ? 'Gerando Escalas...' : 'Gerar Escalas'}
          </Text>
        </TouchableOpacity>
        {building && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size={20} color={AppStyles.color.loading} />
          </View>
        )}
        {finish && (
          <View style={styles.boxMessage}>
            <View style={styles.iconAndtext}>
              <AntDesign
                name='checkcircle'
                size={16}
                color={AppStyles.color.success}
              />
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

        <View style={styles.boxTotalVoluntarios}>
          <Text style={styles.textTotalVoluntarios}>
            Total de voluntários às vagas:{' '}
          </Text>
          <Text style={[styles.textTotalVoluntarios, { fontWeight: '700' }]}>
            {getTotalVoluntarios()}
          </Text>
        </View>

        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.key}
          data={dataSelecionada ? horariosVoluntariosDia : []}
          renderItem={({ item }) => (
            <ItemListaHorarioPessoa
              fullFields
              data={item}
              deleteItem={handleDelete}
            />
          )}
          ListEmptyComponent={
            loadingVoluntarios ? (
              <View style={styles.textMessageList}>
                <Text style={styles.textMessageList}>Carregando...</Text>
              </View>
            ) : (
              <View style={styles.textMessageList}>
                <Text style={{ fontSize: 14, color: AppStyles.color.danger }}>
                  Nenhum voluntário para este dia!
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
    paddingHorizontal: 5,
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
    marginBottom: 10
  },
  boxDropdown: {
    width: '100%',
    marginBottom: 3
  },
  dropdown: {
    borderColor: '#747d8c',
    backgroundColor: '#FFF',
    borderRadius: 4
  },
  btnGerar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBotton: 10,
    marginTop: 3,
    backgroundColor: AppStyles.color.primary,
    borderWidth: 1.4,
    borderColor: AppStyles.color.secondary,
    borderRadius: 5,
    width: '100%'
  },
  btnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  textHorariosSelecionados: {
    marginBottom: 5,
    fontSize: 16,
    color: AppStyles.color.blueLightColor,
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
    paddingHorizontal: 10,
    paddingtop: 2,
    paddingBottom: 2,
    borderRadius: 5,
    marginTop: 4,
    backgroundColor: AppStyles.color.success,
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
  textMessage: {
    color: AppStyles.color.success,
    fontWeight: '700',
    marginLeft: 5
  },
  boxTotalVoluntarios: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 18,
    paddingHorizontal: 5
  },
  textTotalVoluntarios: { fontSize: 12, color: AppStyles.color.blueLightColor },
  list: {
    width: '100%',
    marginTop: 3,
    padding: 5,
    borderRadius: 8,
    backgroundColor: AppStyles.color.secondary
  },
  textMessageList: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  }
});
