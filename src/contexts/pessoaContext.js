import { useEffect, createContext, useState } from 'react';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';

export const PessoaContext = createContext({});

function PessoaProvider({ children }) {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [horariosPessoa, setHorariosPessoa] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function getDados() {
      setPessoas([]);

      await firebase
        .database()
        .ref('pessoas') //'pessoas/1'
        .once('value', (snapshot) => {
          snapshot?.forEach((childItem) => {
            let data = {
              key: childItem.key,
              email: childItem.val().email,
              nome: childItem.val().nome,
              celular: childItem.val().celular,
              tipo: childItem.val().tipo,
              ativo: childItem.val().ativo
            };

            setPessoas((oldPessoas) => [...oldPessoas, data].reverse());
            setLoading(false);
          });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }

    getDados();
  }, []);

  async function incluirPessoa(uid, nome, celular, tipo = '', ativo = false) {
    //Inclusão NÃO disponível para o administrador porque é devida ao próprio usuário

    let pessoa = firebase.database().ref('pessoas');
    //let chave = pessoa.push().key; //build new key
    let chave = uid;

    pessoa
      .child(chave)
      .set({
        email,
        nome,
        celular,
        tipo,
        ativo
      })
      .then(() => {
        const data = {
          key: chave,
          email,
          nome,
          celular,
          tipo,
          ativo
        };

        setPessoas((oldPessoas) => [...oldPessoas, data].reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function alterarPessoa(key, nome, celular, tipo, ativo) {
    firebase
      .database()
      .ref('pessoas')
      .child(key)
      .update({
        nome,
        celular,
        tipo,
        ativo
      })
      .then(() => {
        const pessoaIndex = pessoas.findIndex((pessoa) => pessoa.key === key);
        let pessoasClone = pessoas;
        pessoasClone[pessoaIndex].nome = nome;
        pessoasClone[pessoaIndex].celular = celular;
        pessoasClone[pessoaIndex].tipo = tipo;
        pessoasClone[pessoaIndex].ativo = ativo;

        setPessoas([...pessoasClone]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function excluirPessoa(key) {
    await firebase
      .database()
      .ref('pessoas')
      .child(key)
      .remove()
      .then(() => {
        const newPessoasList = pessoas.filter((item) => item.key !== key);
        setPessoas(newPessoasList);
      });
  }

  return (
    <PessoaContext.Provider
      value={{
        loading,
        pessoas,
        setPessoas,
        incluirPessoa,
        alterarPessoa,
        excluirPessoa
      }}
    >
      {children}
    </PessoaContext.Provider>
  );
}

export default PessoaProvider;
