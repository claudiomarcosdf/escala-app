import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../pages/Home';
import Cadastro from '../pages/Cadastro';
import CadastroHorarios from '../pages/Horarios';
import EscalaIndividual from '../pages/EscalaIndividual';
import EscolhaHorarios from '../pages/EscolhaHorarios';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='Cadastro'
        component={Cadastro}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='CadastroHorarios'
        component={CadastroHorarios}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='EscalaIndividual'
        component={EscalaIndividual}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}
