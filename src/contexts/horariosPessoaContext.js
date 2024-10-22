import { createContext, useState, useContext } from 'react';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';
import { AuthContext } from './authContext';

export const HorarioPessoaContext = createContext({});

function HorarioPessoaProvider({ children }) {
  const [horariosPessoa, setHorariosPessoa] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [horariosVoluntariosDia, setHorariosVoluntariosDia] = useState([]);

  const { paroquiaconfig } = useContext(AuthContext);

  async function getHorarios(dataBR) {
    let retorno = [];
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

          objHorario[0].horarios.map((hora) => retorno.push(hora));
        }
      });
    return retorno;
  }

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

  //Verifica se a pessoa já salvou seus horários para a data informada
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

  /**
   * RETORNA VERDADEIRO SE A VAGA POR HORÁRIO JÁ FOI PREENCHIDA
   * @param {*} data
   * @param {*} horariosEscolhidos: ['09:00', '11:00']
   * @returns
   */
  async function horariosPreenchidos(data, horariosEscolhidos) {
    let retorno = { vagaPreenchida: false, horario: '' };

    const horariosDoDia = await Promise.all([getHorarios(data)]);
    let vagasPreenchidas = horariosDoDia[0].map((horario) => {
      //[{ horario: '', totalPreenchidas: 0}]
      return {
        horario,
        totalPreenchidas: 0
      };
    });

    const qtdeVagasPorHorario = paroquiaconfig
      ? paroquiaconfig?.qtdePessoasVoluntarias
      : 20; //Máx de pessoas que podem se voluntariar por horário

    await firebase
      .database()
      .ref('horariospessoa')
      .orderByChild('data')
      .equalTo(data)
      .once('value')
      .then(function (snapshot) {
        if (snapshot.val() != null) {
          const objHorarios = Object.keys(snapshot.val()).map((key) => ({
            key: key,
            ...snapshot.val()[key]
          }));

          objHorarios.forEach((horario) => {
            horario.horarios.forEach((hora) => {
              vagasPreenchidas[
                vagasPreenchidas.findIndex((element) => element.horario == hora)
              ].totalPreenchidas += 1;
            });
          });

          //horariosEscolhidos pela pessoa
          vagasPreenchidas.forEach((vagaPreenchida) => {
            const horarioFinded = horariosEscolhidos.findIndex(
              (horario) => horario == vagaPreenchida.horario
            );
            if (horarioFinded != -1) {
              if (vagaPreenchida.totalPreenchidas == qtdeVagasPorHorario) {
                retorno.vagaPreenchida = true;
                retorno.horario = vagaPreenchida.horario;
                return;
              }
            }
          });
        }
      });
    return retorno;
  }

  async function incluirHorariosPessoa(user, data, horarios) {
    //salva horários escolhidos
    setSaving(true);
    let horariosPessoadb = firebase.database().ref('horariospessoa');
    let chave = horariosPessoadb.push().key; //build new key

    const horariosOrder = horarios.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));

    let [horarioExiste, vagaHorario] = await Promise.all([
      horarioEscolhidoExiste(data, user.key),
      horariosPreenchidos(data, horariosOrder)
    ]);

    if (horarioExiste == true) {
      Alert.alert('Atenção', 'Você já candidatou para este dia.');
      setSaving(false);
      return;
    }

    if (vagaHorario.vagaPreenchida == true) {
      Alert.alert(
        'Atenção',
        'O horário das ' + vagaHorario.horario + ' já foi preenchido.'
      );
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
        horarios: horariosOrder
      })
      .then(() => {
        const dados = {
          key: chave,
          keypessoa: user.key,
          nomepessoa: user.nome,
          tipopessoa: user.tipo,
          data,
          horarios: horariosOrder
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

  async function getHorariosVoluntariosDoDia(dataBR) {
    //Retorna os horários de TODOS as pessoas candidatas do dia
    setLoading(true);
    setHorariosVoluntariosDia([]);
    await firebase
      .database()
      .ref('horariospessoa')
      .orderByChild('data')
      .equalTo(dataBR)
      .once('value', (snapshot) => {
        if (snapshot.val() != null) {
          const objHorariosVoluntarios = Object.keys(snapshot.val()).map(
            (key) => ({
              key: key,
              ...snapshot.val()[key]
            })
          );

          if (objHorariosVoluntarios.length != 0)
            setHorariosVoluntariosDia(
              [...objHorariosVoluntarios].sort(({ data: a }, { data: b }) =>
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
        getHorariosVoluntariosDoDia,
        setHorariosVoluntariosDia,
        horariosVoluntariosDia,
        horariosPreenchidos
      }}
    >
      {children}
    </HorarioPessoaContext.Provider>
  );
}

export default HorarioPessoaProvider;
