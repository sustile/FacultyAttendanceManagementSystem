import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import Main from './Main';
import store from './Store/store';
import {Provider} from 'react-redux';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#76c893',
    secondary: '#b5e48c',
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <FlashMessage position="bottom" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false, headerTransparent: true}}
            />
            <Stack.Screen
              name="Home"
              component={Main}
              options={{headerShown: false, headerTransparent: true}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
