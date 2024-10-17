import { useEffect, useState, useContext } from 'react';
import {
  Alert,
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Dropdown from 'react-native-input-select';
import { AuthContext } from '../../contexts/authContext';
import { HorarioContext } from '../../contexts/horarioContext';
import { UsuarioContext } from '../../contexts/usuarioContext';
import { getDataToFilterFirebase, getFullDateBR } from '../../utils/helpers';
import { HorarioUsuarioContext } from '../../contexts/horariosUsuarioContext';
import ItemListaHorarioUsuario from '../../components/ItemListaHorarioUsuario';

export default function EscolhaHorarios() {
  let dataAtual = getDataToFilterFirebase();

  const [data, setData] = useState(null);
  const [horariosSelecionado, setHorariosSelecionados] = useState([]);
  const { user } = useContext(AuthContext);
  const { getHorariosAtivos, horarios } = useContext(HorarioContext);
  const {
    getHorariosUsuario,
    horariosUsuario,
    incluirHorariosUsuario,
    excluirHorariosUsuario,
    loading,
    saving
  } = useContext(HorarioUsuarioContext);

  useEffect(() => {
    //selecionar as datas maiores que o dia atual
    async function buscaHorarios() {
      await getHorariosAtivos(dataAtual);
      await getHorariosUsuario(dataAtual, user.key);
    }

    buscaHorarios();
  }, []);

  async function handleSave() {
    if (!data || !horariosSelecionado) {
      Alert.alert('Atenção', 'Favor informar o dia e os horários.');
      return;
    }
    await incluirHorariosUsuario(user, data, horariosSelecionado);
  }

  function getDatas() {
    return horarios.map((horario) => {
      return { label: getFullDateBR(horario.data), value: horario.data };
    });
  }

  function getHorariosFiltrados() {
    if (!horarios || !data) return;

    let dataSelecionada = horarios.filter((horario) => horario.data == data);
    return dataSelecionada[0].horarios.map((hora) => {
      return { label: hora, value: hora };
    });
  }

  async function handleDelete(key, data) {
    if (!key) return;

    Alert.alert('Atenção', `Excluir horários do dia "${data}"?`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => {
          excluirHorariosUsuario(key);
        }
      }
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaElements}>
        <Text style={styles.titleText}>Candidate-se às Missas</Text>
        <Text style={styles.titleUsuario}>{user?.nome}</Text>

        <Dropdown
          placeholder='Selecione o dia...'
          placeholderStyle={{ opacity: 0.5 }}
          selectedItemStyle={{
            color: '#0096c7',
            fontSize: 16,
            fontWeight: '900'
          }}
          dropdownStyle={styles.dropdown}
          options={horarios ? getDatas() : null}
          selectedValue={data}
          onValueChange={(value) => {
            setHorariosSelecionados([]);
            setData(value);
          }}
          primaryColor={'#0096c7'}
        />

        <Dropdown
          placeholder='Selecione o(s) horário(s)...'
          placeholderStyle={{ opacity: 0.5 }}
          dropdownStyle={styles.dropdown}
          isMultiple
          options={horarios ? getHorariosFiltrados() : null}
          listControls={{
            selectAllText: 'Marcar todos',
            unselectAllText: 'Desmarcar todos'
          }}
          selectedValue={horariosSelecionado}
          onValueChange={(value) => setHorariosSelecionados(value)}
          primaryColor={'#0096c7'}
        />

        <TouchableOpacity style={styles.btnSalvar} onPress={handleSave}>
          <Text style={styles.btnText}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
        {saving && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size={20} color='#0984e3' />
          </View>
        )}

        <View style={styles.boxTotalHorarios}>
          <Text style={styles.textTotal}>Horários escolhidos: </Text>
          <Text style={[styles.textTotal, { fontWeight: '700' }]}>
            {horariosUsuario.length != 0 ? horariosUsuario.length : 0}
          </Text>
        </View>

        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.key}
          data={horariosUsuario}
          renderItem={({ item }) => (
            <ItemListaHorarioUsuario data={item} deleteItem={handleDelete} />
          )}
          ListEmptyComponent={
            loading ? (
              <View style={styles.textMessage}>
                <Text style={styles.textMessage}>Carregando...</Text>
              </View>
            ) : (
              <View style={styles.textMessage}>
                <Text style={{ fontSize: 14, color: '#ee5253' }}>
                  Nenhum horário escolhido!
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
    paddingHorizontal: 2,
    backgroundColor: '#F2f6fc'
  },
  boxAreaElements: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2f3640',
    marginBottom: 15
  },
  titleUsuario: {
    fontWeight: '500',
    color: '#0984e3',
    marginBottom: 10
  },
  dropdown: {
    borderColor: '#747d8c',
    backgroundColor: '#FFF',
    borderRadius: 4
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
  btnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  btnSalvar: {
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
  boxTotalHorarios: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 5
  },
  list: {
    width: '100%',
    marginTop: 2,
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#dfe4ea'
  },
  textTotal: { fontSize: 12, color: '#0096c7' },
  textMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  }
});
