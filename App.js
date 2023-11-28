// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login/Login';
import Signup from './screens/Login/Signup';
import Home from './screens/Home/Home';
import Metas from './screens/Metas/Metas';
import Notas from './screens/Notas/Notas';
import Ideias from './screens/Ideias/Ideias'
import Sonhos from './screens/Sonhos/Sonhos'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Registro" component={Signup} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="Metas" component={Metas} options={{ headerShown: false }}/>
        <Stack.Screen name="Notas" component={Notas} options={{ headerShown: false }}/>
        <Stack.Screen name="Ideias" component={Ideias} options={{ headerShown: false }}/>
        <Stack.Screen name="Sonhos" component={Sonhos} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;