import { useEffect, useState, useContext } from 'react';
import {
  Alert,
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import Dropdown from 'react-native-input-select';
import { AuthContext } from '../../contexts/authContext';
import { HorarioContext } from '../../contexts/horarioContext';
import { UsuarioContext } from '../../contexts/usuarioContext';

export default function EscolhaHorarios() {
  const [data, setData] = useState(null);
  const [horariosSelecionado, setHorariosSelecionados] = useState([]);
  const { user } = useContext(AuthContext);
  const { getHorariosUsuario, incluirHorariosUsuario } =
    useContext(UsuarioContext);

  useEffect(() => {
    //selecionar as datas maiores que o dia atual
  }, []);

  async function handleSave() {
    // if (!data || !horariosSelecionado) {
    //   Alert.alert('Atenção', 'Favor informar o dia e os horários.');
    //   return;
    // }
    //await incluirHorariosUsuario(user.uid, data, horariosSelecionado);
    // Alert.alert('Sucesso', 'Informações salvas com sucesso!');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxAreaElements}>
        <Text style={styles.titleText}>Candidate-se às Missas</Text>

        <Dropdown
          placeholder='Selecione o dia...'
          placeholderStyle={{ opacity: 0.5 }}
          selectedItemStyle={{
            color: '#0096c7',
            fontSize: 16,
            fontWeight: '900'
          }}
          dropdownStyle={styles.dropdown}
          options={[
            { label: '15/10/2024', value: '15/10/2024' },
            { label: '16/10/2024', value: '16/10/2024' },
            { label: '26/10/2024', value: '26/10/2024' },
            { label: '27/10/2024', value: '27/10/2024' },
            { label: '30/10/2024', value: '30/10/2024' }
          ]}
          selectedValue={data}
          onValueChange={(value) => setData(value)}
          primaryColor={'#0096c7'}
        />

        <Dropdown
          placeholder='Selecione o(s) horário(s)...'
          placeholderStyle={{ opacity: 0.5 }}
          dropdownStyle={styles.dropdown}
          isMultiple
          options={[
            { label: '09:00', value: '09:00' },
            { label: '11:00', value: '11:00' },
            { label: '17:00', value: '17:00' },
            { label: '20:00', value: '20:00' }
          ]}
          listControls={{
            selectAllText: 'Marcar todos',
            unselectAllText: 'Desmarcar todos'
          }}
          selectedValue={horariosSelecionado}
          onValueChange={(value) => setHorariosSelecionados(value)}
          primaryColor={'#0096c7'}
        />

        <TouchableOpacity style={styles.btnSalvar} onPress={handleSave}>
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>

        {/* <View style={styles.boxTotalHorarios}>
          <Text style={styles.textTotal}>Horários cadastrados: </Text>
          <Text style={[styles.textTotal, { fontWeight: '700' }]}>
            {horariosUsuario.length != 0 ? horariosUsuario.length : 0}
          </Text>
        </View>

        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.key}
          data={horariosUsuario}
          renderItem={({ item }) => (
            <ItemListaUsuario
              data={item}
              deleteItem={handleDelete}
              editItem={handleEdit}
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
                  Nenhum usuário cadastrado!
                </Text>
              </View>
            )
          }
        /> */}
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
  list: {
    width: '100%',
    marginTop: 2,
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#dfe4ea'
  }
});
