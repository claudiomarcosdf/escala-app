import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../pages/Home';
import Cadastro from '../pages/Cadastro';
import EscalaIndividual from '../pages/EscalaIndividual';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EscalaIndividual"
        component={EscalaIndividual}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator >
  );
}