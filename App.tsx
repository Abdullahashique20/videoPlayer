import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import StackScreen from './src/screens/stackScreen';
import { NavigationContainer } from "@react-navigation/native";
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <StackScreen />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}



export default App;
