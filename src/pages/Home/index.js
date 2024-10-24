import { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import AppStyles from '../../appStyles';
import { AuthContext } from '../../contexts/authContext';

export default function Home() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.areaButtons}>
        <View style={styles.title}>
          <MaterialCommunityIcons
            name='view-dashboard-outline'
            size={24}
            color='#fff'
          />
          <Text style={styles.textTitle}>MENU</Text>
        </View>
        <View style={styles.boxButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <FontAwesome6
              name='person-praying'
              size={30}
              color='#fff'
              style={styles.iconsStyle}
            />
            <Text style={styles.textButtom}>Cadastro de Pessoa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CadastroHorarios')}
          >
            <MaterialCommunityIcons
              name='calendar-clock'
              size={30}
              color='#fff'
              style={styles.iconsStyle}
            />
            <Text style={styles.textButtom}>Horários das Missas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('GeradorEscalas')}
          >
            <MaterialCommunityIcons
              name='timer-cog-outline'
              size={30}
              color='#fff'
              style={styles.iconsStyle}
            />
            <Text style={styles.textButtom}>Gerador de Escalas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EscalaIndividual')}
          >
            <MaterialCommunityIcons
              name='calendar-account'
              size={30}
              color='#fff'
              style={styles.iconsStyle}
            />
            <Text style={styles.textButtom}>Escala Individual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Escalas')}
          >
            <MaterialCommunityIcons
              name='calendar-month'
              size={30}
              color='#fff'
              style={styles.iconsStyle}
            />
            <Text style={styles.textButtom}>Escalas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOut} onPress={() => logout()}>
            <Text style={styles.textButtomOut}>Sair do aplicativo</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingBottom: 5 }}>
        <Text style={styles.developer}>
          Desenvolvido por Claudio Marcos - (61) 99976-3771
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 10,
    backgroundColor: AppStyles.color.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    flexDirection: 'row',
    color: '#fff',
    alignItems: 'center',
    marginBottom: 25
  },
  textTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 10
  },
  areaButtons: {
    flex: 1,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconsStyle: {
    opacity: 0.8,
    marginBottom: 5
  },
  boxButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    height: 130,
    borderRadius: 5,
    backgroundColor: AppStyles.color.primary,
    borderWidth: 1.4,
    borderColor: AppStyles.color.secondary,
    padding: 20,
    marginBottom: 15
  },
  textButtom: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '400'
  },
  buttonOut: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: AppStyles.color.primary,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 20
  },
  textButtomOut: {
    color: AppStyles.color.primary,
    fontWeight: '600'
  },
  developer: { fontSize: 9, fontStyle: 'italic', color: '#2d3436' }
});
