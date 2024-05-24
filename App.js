import { StyleSheet } from 'react-native';
import AppBase from './AppBase';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import store from './app/store'
import { Provider } from 'react-redux'


export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#c58fff',
      secondary: '#6a83de',
    },
  };


  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
      <NavigationContainer>
        <AppBase />
      </NavigationContainer>
      </Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
