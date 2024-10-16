import { useEffect, createContext, useState } from 'react';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';

export const UsuarioContext = createContext({});

function UsuarioProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [horariosUsuario, setHorariosUsuario] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function getDados() {
      setUsuarios([]);

      await firebase
        .database()
        .ref('usuarios') //'usuarios/1'
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

            setUsuarios((oldUsuarios) => [...oldUsuarios, data].reverse());
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

  async function incluirUsuario(uid, nome, celular, tipo = '', ativo = false) {
    //Inclusão NÃO disponível para o administrador porque é devida ao próprio usuário

    let usuario = firebase.database().ref('usuarios');
    //let chave = usuario.push().key; //build new key
    let chave = uid;

    usuario
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

        setUsuarios((oldUsuarios) => [...oldUsuarios, data].reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function alterarUsuario(key, nome, celular, tipo, ativo) {
    firebase
      .database()
      .ref('usuarios')
      .child(key)
      .update({
        nome,
        celular,
        tipo,
        ativo
      })
      .then(() => {
        const usuarioIndex = usuarios.findIndex(
          (usuario) => usuario.key === key
        );
        let usuariosClone = usuarios;
        usuariosClone[usuarioIndex].nome = nome;
        usuariosClone[usuarioIndex].celular = celular;
        usuariosClone[usuarioIndex].tipo = tipo;
        usuariosClone[usuarioIndex].ativo = ativo;

        setUsuarios([...usuariosClone]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function excluirUsuario(key) {
    await firebase
      .database()
      .ref('usuarios')
      .child(key)
      .remove()
      .then(() => {
        const newUsuariosList = usuarios.filter((item) => item.key !== key);
        setUsuarios(newUsuariosList);
      });
  }

  return (
    <UsuarioContext.Provider
      value={{
        loading,
        usuarios,
        setUsuarios,
        incluirUsuario,
        alterarUsuario,
        excluirUsuario
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
}

export default UsuarioProvider;
