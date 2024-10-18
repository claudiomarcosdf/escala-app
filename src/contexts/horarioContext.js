import { createContext, useState } from 'react';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';

export const HorarioContext = createContext({});

function HorarioProvider({ children }) {
  const [horarios, setHorarios] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);

  //Verifica se existe escala com para horários cadastrados
  async function escalaExiste(data) {
    let retorno = false;
    await firebase
      .database()
      .ref('escalas')
      .orderByChild('data')
      .equalTo(data)
      .once('value')
      .then(function (snapshot) {
        if (snapshot.val() != null) retorno = true;
      });

    return retorno;
  }

  async function horarioExiste(data) {
    let retorno = false;
    await firebase
      .database()
      .ref('horarios')
      .orderByChild('data')
      .equalTo(data)
      .once('value')
      .then(function (snapshot) {
        if (snapshot.val() != null) retorno = true;
      });

    return retorno;
  }

  async function incluirHorarios(data, horarios) {
    setLoading(true);
    setFinish(false);
    let horariosdb = firebase.database().ref('horarios');
    let chave = horariosdb.push().key; //build new key

    let existe = await Promise.all([horarioExiste(data)]);

    if (existe[0] == true) {
      Alert.alert('Atenção', 'Horários já cadrastados para essa data!');
      setLoading(false);
      return;
    }

    horariosdb
      .child(chave)
      .set({
        data,
        horarios
      })
      .then(() => {
        const data = {
          key: chave,
          data,
          horarios
        };

        setLoading(false);
        setFinish(true);
        //setHorarios((oldHorarioss) => [...oldHorarioss, data].reverse());
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível cadastrar o horários.');
        setLoading(false);
      });
  }

  async function alterarHorarios(key, data, horarios) {
    firebase
      .database()
      .ref('horarios')
      .child(key)
      .update({
        data,
        horarios
      })
      .then(() => {
        // const horarioIndex = horarios.findIndex(
        //   (horario) => horario.key === key
        // );
        // let horariosClone = horarios;
        // horariosClone[horarioIndex].data = data;
        // horariosClone[horarioIndex].horarios = horarios;
        // setHorarios([...horariosClone]);
      });
  }

  async function excluirHorarios(key, data) {
    let existe = await Promise.all([escalaExiste(data)]);

    if (existe[0] == true) {
      Alert.alert('Atenção', 'Exitem escalas geradas com estes horários!');
      return;
    }

    await firebase
      .database()
      .ref('horarios')
      .child(key)
      .remove()
      .then(() => {
        setHorarios(null);
        // const newHorariosList = horarios.filter((item) => item.key !== key);
        // setHorarios(newHorariosList);
      });
  }

  async function getHorarios(data) {
    const dataBR = format(data, 'dd/MM/yyy');
    await firebase
      .database()
      .ref('horarios')
      .orderByChild('data')
      .equalTo(dataBR)
      .once('value')
      .then(function (snapshot) {
        if (snapshot.val() != null) {
          const objHorario = Object.keys(snapshot.val()).map((key) => ({
            key: key,
            ...snapshot.val()[key]
          }));

          setHorarios(objHorario[0]);
        } else setHorarios(null);
      });
  }

  async function getHorariosAtivos(dataBR) {
    //Retorna os horários cujas datas são maiores que a informada (data atual)
    await firebase
      .database()
      .ref('horarios')
      .orderByChild('data')
      .startAt(dataBR)
      .once('value')
      .then(function (snapshot) {
        if (snapshot.val() != null) {
          const objHorarios = Object.keys(snapshot.val()).map((key) => ({
            key: key,
            ...snapshot.val()[key]
          }));

          //console.log(objHorarios);
          setHorarios(objHorarios);
        } else setHorarios(null);
      });
  }

  return (
    <HorarioContext.Provider
      value={{
        loading,
        setLoading,
        horarios,
        setHorarios,
        incluirHorarios,
        finish,
        setFinish,
        alterarHorarios,
        excluirHorarios,
        getHorarios,
        getHorariosAtivos
      }}
    >
      {children}
    </HorarioContext.Provider>
  );
}

export default HorarioProvider;
