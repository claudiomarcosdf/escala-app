import { createContext, useState } from 'react';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';

export const HorarioUsuarioContext = createContext({});

function HorarioUsuarioProvider({ children }) {
  const [horariosUsuario, setHorariosUsuario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [horariosCandidatosDia, setHorariosCanditatosDia] = useState([]);

  async function horarioEscolhidoExiste(data, userkey) {
    let retorno = false;
    await firebase
      .database()
      .ref('horariosusuario')
      .orderByChild('data')
      .equalTo(data)
      .once('value')
      .then(function (snapshot) {
        if (snapshot.val() != null) {
          const objHorariosUsuario = Object.keys(snapshot.val()).map((key) => ({
            key: key,
            ...snapshot.val()[key]
          }));

          const horariosUsuario = objHorariosUsuario.filter(
            (objHorario) => objHorario.keyusuario == userkey
          );

          if (horariosUsuario.length != 0) retorno = true;
        }
      });

    return retorno;
  }

  async function incluirHorariosUsuario(user, data, horarios) {
    //salva horários escolhidos
    setSaving(true);
    let horariosUsuariodb = firebase.database().ref('horariosusuario');
    let chave = horariosUsuariodb.push().key; //build new key

    let existe = await Promise.all([horarioEscolhidoExiste(data, user.key)]);

    if (existe[0] == true) {
      Alert.alert('Atenção', 'Você já candidatou para este dia.');
      setSaving(false);
      return;
    }

    horariosUsuariodb
      .child(chave)
      .set({
        keyusuario: user.key,
        nomeusuario: user.nome,
        tipousuario: user.tipo,
        data,
        horarios
      })
      .then(() => {
        const dados = {
          key: chave,
          keyusuario: user.key,
          nomeusuario: user.nome,
          tipousuario: user.tipo,
          data,
          horarios
        };

        Alert.alert('Sucesso', 'Horários salvos com sucesso!');
        setSaving(false);
        setHorariosUsuario((oldHorariosUsuario) =>
          [...oldHorariosUsuario, dados].sort(({ data: a }, { data: b }) =>
            a > b ? -1 : a < b ? 1 : 0
          )
        );
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Erro', 'Não foi possível candidatar-se.');
        setSaving(false);
      });
  }

  async function excluirHorariosUsuario(key) {
    await firebase
      .database()
      .ref('horariosusuario')
      .child(key)
      .remove()
      .then(() => {
        const newHorariosList = horariosUsuario.filter(
          (item) => item.key !== key
        );
        setHorariosUsuario(newHorariosList);
      });
  }

  async function getHorariosUsuario(dataBR, userkey) {
    //Retorna os horários cujas datas são maiores que a informada (data atual)
    setLoading(true);
    setHorariosUsuario([]);
    await firebase
      .database()
      .ref('horariosusuario')
      .orderByChild('data')
      .startAt(dataBR)
      .once('value', (snapshot) => {
        if (snapshot.val() != null) {
          const objHorariosUsuario = Object.keys(snapshot.val()).map((key) => ({
            key: key,
            ...snapshot.val()[key]
          }));

          const horariosUsuarioList = objHorariosUsuario.filter(
            (objHorario) => objHorario.keyusuario == userkey
          );

          if (horariosUsuarioList.length != 0)
            setHorariosUsuario(
              [...horariosUsuarioList].sort(({ data: a }, { data: b }) =>
                a > b ? -1 : a < b ? 1 : 0
              )
            );
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  async function getHorariosCandidadosDoDia(dataBR) {
    //Retorna os horários de TODOS os usuários candidatos do dia
    setLoading(true);
    setHorariosCanditatosDia([]);
    await firebase
      .database()
      .ref('horariosusuario')
      .orderByChild('data')
      .equalTo(dataBR)
      .once('value', (snapshot) => {
        if (snapshot.val() != null) {
          const objHorariosCandidatos = Object.keys(snapshot.val()).map(
            (key) => ({
              key: key,
              ...snapshot.val()[key]
            })
          );

          if (objHorariosCandidatos.length != 0)
            setHorariosCanditatosDia(
              [...objHorariosCandidatos].sort(({ data: a }, { data: b }) =>
                a > b ? -1 : a < b ? 1 : 0
              )
            );
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  return (
    <HorarioUsuarioContext.Provider
      value={{
        loading,
        setLoading,
        horariosUsuario,
        setHorariosUsuario,
        incluirHorariosUsuario,
        excluirHorariosUsuario,
        saving,
        setSaving,
        getHorariosUsuario,
        getHorariosCandidadosDoDia,
        setHorariosCanditatosDia,
        horariosCandidatosDia
      }}
    >
      {children}
    </HorarioUsuarioContext.Provider>
  );
}

export default HorarioUsuarioProvider;
