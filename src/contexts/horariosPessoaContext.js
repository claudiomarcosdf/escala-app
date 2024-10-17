import { createContext, useState } from 'react';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';

export const HorarioPessoaContext = createContext({});

function HorarioPessoaProvider({ children }) {
  const [horariosPessoa, setHorariosPessoa] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [horariosCandidatosDia, setHorariosCanditatosDia] = useState([]);

  //Caso a escala exista não deixa excluir horariopessoa
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

  async function horarioEscolhidoExiste(data, userkey) {
    let retorno = false;
    await firebase
      .database()
      .ref('horariospessoa')
      .orderByChild('data')
      .equalTo(data)
      .once('value')
      .then(function (snapshot) {
        if (snapshot.val() != null) {
          const objHorariosPessoa = Object.keys(snapshot.val()).map((key) => ({
            key: key,
            ...snapshot.val()[key]
          }));

          const horariosPessoa = objHorariosPessoa.filter(
            (objHorario) => objHorario.keypessoa == userkey
          );

          if (horariosPessoa.length != 0) retorno = true;
        }
      });

    return retorno;
  }

  async function incluirHorariosPessoa(user, data, horarios) {
    //salva horários escolhidos
    setSaving(true);
    let horariosPessoadb = firebase.database().ref('horariospessoa');
    let chave = horariosPessoadb.push().key; //build new key

    let existe = await Promise.all([horarioEscolhidoExiste(data, user.key)]);

    if (existe[0] == true) {
      Alert.alert('Atenção', 'Você já candidatou para este dia.');
      setSaving(false);
      return;
    }

    horariosPessoadb
      .child(chave)
      .set({
        keypessoa: user.key,
        nomepessoa: user.nome,
        tipopessoa: user.tipo,
        data,
        horarios
      })
      .then(() => {
        const dados = {
          key: chave,
          keypessoa: user.key,
          nomepessoa: user.nome,
          tipopessoa: user.tipo,
          data,
          horarios
        };

        Alert.alert('Sucesso', 'Horários salvos com sucesso!');
        setSaving(false);
        setHorariosPessoa((oldHorariosPessoa) =>
          [...oldHorariosPessoa, dados].sort(({ data: a }, { data: b }) =>
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

  async function excluirHorariosPessoa(key, data) {
    let existe = await Promise.all([escalaExiste(data)]);

    if (existe[0] == true) {
      Alert.alert('Atenção', 'A escala para esta data já foi gerada!');
      return;
    }

    await firebase
      .database()
      .ref('horariospessoa')
      .child(key)
      .remove()
      .then(() => {
        const newHorariosList = horariosPessoa.filter(
          (item) => item.key !== key
        );
        setHorariosPessoa(newHorariosList);
      });
  }

  async function getHorariosPessoa(dataBR, userkey) {
    //Retorna os horários cujas datas são maiores que a informada (data atual)
    setLoading(true);
    setHorariosPessoa([]);
    await firebase
      .database()
      .ref('horariospessoa')
      .orderByChild('data')
      .startAt(dataBR)
      .once('value', (snapshot) => {
        if (snapshot.val() != null) {
          const objHorariosPessoa = Object.keys(snapshot.val()).map((key) => ({
            key: key,
            ...snapshot.val()[key]
          }));

          const horariosPessoaList = objHorariosPessoa.filter(
            (objHorario) => objHorario.keypessoa == userkey
          );

          if (horariosPessoaList.length != 0)
            setHorariosPessoa(
              [...horariosPessoaList].sort(({ data: a }, { data: b }) =>
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
    //Retorna os horários de TODOS as pessoas candidatas do dia
    setLoading(true);
    setHorariosCanditatosDia([]);
    await firebase
      .database()
      .ref('horariospessoa')
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
    <HorarioPessoaContext.Provider
      value={{
        loading,
        setLoading,
        horariosPessoa,
        setHorariosPessoa,
        incluirHorariosPessoa,
        excluirHorariosPessoa,
        saving,
        setSaving,
        getHorariosPessoa,
        getHorariosCandidadosDoDia,
        setHorariosCanditatosDia,
        horariosCandidatosDia
      }}
    >
      {children}
    </HorarioPessoaContext.Provider>
  );
}

export default HorarioPessoaProvider;
