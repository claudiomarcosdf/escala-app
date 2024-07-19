import { useEffect, createContext, useState } from 'react';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';

export const CoroinhaContext = createContext({});

function CoroinhaPrivider({ children }) {
  const [coroinhas, setCoroinhas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function getDados() {
      setCoroinhas([]);

      await firebase
        .database()
        .ref('coroinhas') //'coroinhas/1'
        .once('value', (snapshot) => {
          snapshot?.forEach((childItem) => {
            let data = {
              key: childItem.key,
              nome: childItem.val().nome,
              celular: childItem.val().celular
            };

            setCoroinhas((oldCoroinhas) => [...oldCoroinhas, data].reverse());
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

  async function incluirCoroinha(nome, celular) {
    let coroinha = firebase.database().ref('coroinhas');
    let chave = coroinha.push().key;

    coroinha
      .child(chave)
      .set({
        nome,
        celular
      })
      .then(() => {
        const data = {
          key: chave,
          nome,
          celular
        };

        setCoroinhas((oldCoroinhas) => [...oldCoroinhas, data].reverse());
      });
  }

  async function alterarCoroinha(key, nome, celular) {
    firebase
      .database()
      .ref('coroinhas')
      .child(key)
      .update({
        nome,
        celular
      })
      .then(() => {
        const coroinhaIndex = coroinhas.findIndex(
          (coroinha) => coroinha.key === key
        );
        let coroinhasClone = coroinhas;
        coroinhasClone[coroinhaIndex].nome = nome;
        coroinhasClone[coroinhaIndex].celular = celular;

        setCoroinhas([...coroinhasClone]);
      });
  }

  async function excluirCoroinha(key) {
    await firebase
      .database()
      .ref('coroinhas')
      .child(key)
      .remove()
      .then(() => {
        const newCoroinhasList = coroinhas.filter((item) => item.key !== key);
        setCoroinhas(newCoroinhasList);
      });
  }

  return (
    <CoroinhaContext.Provider
      value={{
        loading,
        coroinhas,
        setCoroinhas,
        incluirCoroinha,
        alterarCoroinha,
        excluirCoroinha
      }}
    >
      {children}
    </CoroinhaContext.Provider>
  );
}

export default CoroinhaPrivider;
